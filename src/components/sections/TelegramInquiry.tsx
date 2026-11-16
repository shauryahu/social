"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
  Shield,
  Lock,
  Zap,
  CheckCircle2,
  AtSign,
  Plus,
  Check,
  AlertCircle,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "Account Recovery & Unban",
  "Verification Support",
  "Brand Protection & Impersonation",
  "Crypto OTC Exchange (INR)",
  "Automated Advertising & Growth",
  "Custom Enterprise Advisory",
];

export default function TelegramInquiry() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Account Recovery & Unban",
  ]);
  const [customDetails, setCustomDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramUsername.trim()) {
      setStatus("error");
      setStatusMessage("Please enter your Telegram @username.");
      return;
    }
    if (!customDetails.trim()) {
      setStatus("error");
      setStatusMessage("Please specify your case requirements or inquiry details.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/telegram-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramUsername: telegramUsername.trim(),
          selectedServices,
          customDetails: customDetails.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(
          data.error || "An error occurred while transmitting your inquiry."
        );
        return;
      }

      setStatus("success");
      setStatusMessage(
        "Inquiry received by SocialAssist Telegram Desk. A senior representative will review your case file shortly."
      );
      setTelegramUsername("");
      setCustomDetails("");
    } catch {
      setStatus("error");
      setStatusMessage(
        "Transmission error. Please contact @socialassist directly on Telegram."
      );
    }
  };

  return (
    <section
      id="inquiry"
      ref={ref}
      className="relative z-10 py-10 sm:py-16 px-2 sm:px-4 w-full"
      aria-labelledby="inquiry-heading"
    >
      {/* Subtle Blue & Lavender Atmospheric Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0"
      >
        <div
          className="w-[90vw] max-w-[1000px] h-[520px] rounded-full blur-[80px] sm:blur-[100px] transition-opacity duration-700 pointer-events-none"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(219, 234, 254, 0.55) 0%, rgba(237, 233, 254, 0.4) 45%, transparent 75%)"
              : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto z-10">
        {/* Apple-Inspired Glass Form Container */}
        <div
          className={`relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-12 lg:p-14 border transition-all duration-700 ${
            isLight
              ? "bg-white/95 border-slate-200/90 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)]"
              : "bg-[#0d0f18]/95 border-white/10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.05)]"
          } backdrop-blur-2xl`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* ── Form Header ── */}
          <div className="text-center mb-6 sm:mb-8">
            {/* Direct Case Submission Badge */}
            <div className="flex justify-center mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase font-mono ${
                  isLight
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-xs"
                    : "bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
                }`}
              >
                <Shield className="w-3 h-3 text-indigo-500" />
                <span>Direct Case Submission</span>
              </span>
            </div>

            {/* Main Heading */}
            <h3
              id="inquiry-heading"
              className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2.5 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Submit Case to{" "}
              <span
                className={
                  isLight
                    ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 font-black"
                    : "inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 font-black"
                }
              >
                Telegram Desk
              </span>
            </h3>

            {/* Clean Supporting Description */}
            <p
              className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed ${
                isLight ? "text-slate-500" : "text-zinc-400"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Direct, encrypted case transmission to our verified operators. Protected by anti-spam rate limiting and end-to-end operational confidentiality.
            </p>

            {/* ── Security Indicators ── */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-6">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isLight
                    ? "bg-slate-50/90 text-slate-600 border border-slate-200/80 shadow-xs"
                    : "bg-white/[0.04] text-zinc-300 border border-white/10"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Encrypted & Secure</span>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isLight
                    ? "bg-slate-50/90 text-slate-600 border border-slate-200/80 shadow-xs"
                    : "bg-white/[0.04] text-zinc-300 border border-white/10"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Priority Handling</span>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isLight
                    ? "bg-slate-50/90 text-slate-600 border border-slate-200/80 shadow-xs"
                    : "bg-white/[0.04] text-zinc-300 border border-white/10"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Verified Operators</span>
              </div>
            </div>
          </div>

          {/* ── Form Body ── */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Telegram Username Input */}
            <div>
              <label
                htmlFor="telegram-username"
                className={`block text-xs font-semibold tracking-wider uppercase mb-2 font-mono ${
                  isLight ? "text-slate-700" : "text-zinc-300"
                }`}
              >
                Your Telegram Username <span className="text-indigo-600 dark:text-indigo-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  id="telegram-username"
                  type="text"
                  placeholder="yourhandle"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl text-sm transition-all duration-200 font-mono ${
                    isLight
                      ? "bg-white border border-slate-200/90 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
                      : "bg-[#07080f] border border-white/15 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                  } focus:outline-none`}
                  required
                />
              </div>
            </div>

            {/* 2. Service Selection Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`block text-xs font-semibold tracking-wider uppercase font-mono ${
                    isLight ? "text-slate-700" : "text-zinc-300"
                  }`}
                >
                  Select Relevant Services
                </label>
                <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                  {selectedServices.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {SERVICE_OPTIONS.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? isLight
                            ? "bg-indigo-50/90 text-indigo-950 border border-indigo-400/70 shadow-xs font-semibold"
                            : "bg-indigo-950/50 text-indigo-200 border border-indigo-500/50 shadow-xs font-semibold"
                          : isLight
                          ? "bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900 shadow-2xs"
                          : "bg-white/[0.03] text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                      )}
                      <span>{service}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Case Description Field */}
            <div>
              <label
                htmlFor="custom-details"
                className={`block text-xs font-semibold tracking-wider uppercase mb-2 font-mono ${
                  isLight ? "text-slate-700" : "text-zinc-300"
                }`}
              >
                Case Brief & Platform URLs <span className="text-indigo-600 dark:text-indigo-400">*</span>
              </label>
              <textarea
                id="custom-details"
                rows={4}
                placeholder="Include your account handle, problem description, ban notice date, or specific OTC requirements..."
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className={`w-full p-4 sm:p-5 rounded-2xl text-sm leading-relaxed transition-all duration-200 resize-none sm:resize-y min-h-[120px] ${
                  isLight
                    ? "bg-white border border-slate-200/90 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
                    : "bg-[#07080f] border border-white/15 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                } focus:outline-none`}
                required
              />
            </div>

            {/* 4. Status Notification */}
            {statusMessage && (
              <div
                role="alert"
                className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 transition-all duration-300 ${
                  status === "success"
                    ? isLight
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs"
                      : "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                    : isLight
                    ? "bg-rose-50 border border-rose-200 text-rose-800 shadow-xs"
                    : "bg-rose-950/40 border border-rose-800 text-rose-300"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* 5. Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="group relative w-full py-4 sm:py-4.5 px-8 rounded-full font-semibold text-sm sm:text-base text-white overflow-hidden transition-all duration-300 shadow-[0_8px_25px_-5px_rgba(79,70,229,0.35)] hover:shadow-[0_12px_32px_-5px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)",
              }}
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Transmitting Encrypted File...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send Priority Case to Telegram Bot →</span>
                </div>
              )}
            </button>
          </form>

          {/* ── Footer Slogan ── */}
          <div className="mt-8 pt-2 text-center">
            <p
              className={`text-xs font-semibold tracking-[0.3em] uppercase font-mono ${
                isLight ? "text-slate-400" : "text-zinc-500"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              WE RESOLVE · WE PROTECT · WE ELEVATE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
