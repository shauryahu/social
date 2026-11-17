"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import SlideActionButton from "@/components/ui/slide-action-button";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Lock,
  Zap,
  UserRound,
  Layers3,
  Check,
  Plus,
  PencilLine,
  CheckCircle2,
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      className="relative z-10 py-12 sm:py-20 px-3 sm:px-6 w-full"
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
              ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(228, 238, 255, 0.6) 0%, rgba(238, 231, 255, 0.45) 45%, transparent 75%)"
              : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto z-10">
        {/* Apple-Inspired Glass Form Container */}
        <div
          className={`relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-12 lg:p-14 border transition-all duration-700 ${
            isLight
              ? "bg-[#FAFAFD]/95 border-[#E3E8F2] shadow-[0_20px_50px_-12px_rgba(16,24,40,0.06),0_1px_3px_rgba(16,24,40,0.04)]"
              : "bg-[#0d0f18]/95 border-white/10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.05)]"
          } backdrop-blur-2xl`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* ── Form Header ── */}
          <div className="text-center mb-7 sm:mb-9">
            {/* Direct Case Submission Badge */}
            <div className="flex justify-center mb-3.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase font-mono shadow-xs ${
                  isLight
                    ? "bg-[#EFF6FF] text-[#0879CE] border border-[#C7DFFF]"
                    : "bg-blue-950/40 text-blue-300 border border-blue-800/40"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#5278F5] flex-shrink-0" strokeWidth={1.8} />
                <span>Direct Case Submission</span>
              </span>
            </div>

            {/* Main Heading */}
            <h3
              id="inquiry-heading"
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 ${
                isLight ? "text-[#101522]" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Submit Case to{" "}
              <span
                className={
                  isLight
                    ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#168DEB] to-[#713CF6] font-bold"
                    : "inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 font-bold"
                }
              >
                Telegram Desk
              </span>
            </h3>

            {/* Clean Supporting Description */}
            <p
              className={`text-[14px] sm:text-[15px] max-w-lg mx-auto leading-relaxed ${
                isLight ? "text-[#586780]" : "text-zinc-400"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Direct, encrypted case transmission to our verified operators. Protected by anti-spam rate limiting and end-to-end operational confidentiality.
            </p>

            {/* ── Security Indicators ── */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-6">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                  isLight
                    ? "bg-white text-[#101522] border border-[#E3E8F2] shadow-[0_2px_6px_rgba(16,24,40,0.03)]"
                    : "bg-white/[0.04] text-zinc-300 border border-white/10"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-[#5278F5] flex-shrink-0" strokeWidth={1.8} />
                <span>Encrypted & Secure</span>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                  isLight
                    ? "bg-white text-[#101522] border border-[#E3E8F2] shadow-[0_2px_6px_rgba(16,24,40,0.03)]"
                    : "bg-white/[0.04] text-zinc-300 border border-white/10"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#8060F5] flex-shrink-0" strokeWidth={1.8} />
                <span>Priority Handling</span>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                  isLight
                    ? "bg-white text-[#101522] border border-[#E3E8F2] shadow-[0_2px_6px_rgba(16,24,40,0.03)]"
                    : "bg-white/[0.04] text-zinc-300 border border-white/10"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#8060F5] flex-shrink-0" strokeWidth={1.8} />
                <span>Verified Operators</span>
              </div>
            </div>
          </div>

          {/* ── Form Body ── */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Telegram Username Input */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UserRound className="w-4 h-4 text-[#7185A6] flex-shrink-0" strokeWidth={1.8} />
                <label
                  htmlFor="telegram-username"
                  className={`block text-xs font-semibold tracking-wider uppercase font-mono ${
                    isLight ? "text-[#243653]" : "text-zinc-300"
                  }`}
                >
                  Your Telegram Username <span className="text-[#5278F5]">*</span>
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7185A6] font-mono text-sm font-semibold transition-colors group-focus-within:text-[#326BEE]">
                  @
                </div>
                <input
                  id="telegram-username"
                  type="text"
                  placeholder="yourhandle"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ""))}
                  className={`w-full pl-9 pr-4 py-3 sm:py-3.5 rounded-[16px] text-sm transition-all duration-200 font-mono ${
                    isLight
                      ? "bg-white border border-[#DCE3EF] text-[#101522] placeholder:text-[#8999B4] focus:border-[#326BEE] focus:ring-4 focus:ring-[#326BEE]/10 shadow-xs"
                      : "bg-[#07080f] border border-white/15 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                  } focus:outline-none`}
                  required
                />
              </div>
            </div>

            {/* 2. Service Selection Chips */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Layers3 className="w-4 h-4 text-[#28466F] dark:text-indigo-400 flex-shrink-0" strokeWidth={1.8} />
                  <label
                    className={`block text-xs font-semibold tracking-wider uppercase font-mono ${
                      isLight ? "text-[#243653]" : "text-zinc-300"
                    }`}
                  >
                    Select Relevant Services
                  </label>
                </div>
                <span className="text-[11px] font-medium text-[#7D899F] dark:text-zinc-500 font-mono">
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
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 border ${
                        isSelected
                          ? isLight
                            ? "bg-[#F0EDFF] text-[#26315A] border-[#BBAAFF] shadow-xs font-semibold"
                            : "bg-purple-950/50 text-purple-200 border-purple-500/50 shadow-xs font-semibold"
                          : isLight
                          ? "bg-white text-[#40516D] border-[#DFE5EF] hover:border-[#C7DFFF] hover:text-[#243653] shadow-2xs"
                          : "bg-white/[0.03] text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#7654F5] flex-shrink-0" strokeWidth={1.8} />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-[#7185A6] flex-shrink-0" strokeWidth={1.8} />
                      )}
                      <span>{service}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Case Description Field */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PencilLine className="w-4 h-4 text-[#7185A6] flex-shrink-0" strokeWidth={1.8} />
                <label
                  htmlFor="custom-details"
                  className={`block text-xs font-semibold tracking-wider uppercase font-mono ${
                    isLight ? "text-[#243653]" : "text-zinc-300"
                  }`}
                >
                  Case Brief & Platform URLs <span className="text-[#5278F5]">*</span>
                </label>
              </div>
              <textarea
                id="custom-details"
                rows={4}
                placeholder="Include your account handle, problem description, ban notice date, or specific OTC requirements..."
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className={`w-full p-4 sm:p-5 rounded-[16px] text-sm leading-relaxed transition-all duration-200 resize-none sm:resize-y min-h-[120px] ${
                  isLight
                    ? "bg-white border border-[#DCE3EF] text-[#101522] placeholder:text-[#8999B4] focus:border-[#326BEE] focus:ring-4 focus:ring-[#326BEE]/10 shadow-xs"
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={1.8} />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" strokeWidth={1.8} />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* 5. Slide-to-Submit Button — Integrated SlideActionButton */}
            <div
              className="relative w-full pt-3 pb-1 flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px]"
              data-testid="slide-submit-container"
            >
              <SlideActionButton
                disabled={status === "loading"}
                threshold={0.78}
                resetDelay={2200}
                onComplete={handleSubmit}
                className={cn(
                  "w-full max-w-md h-16 rounded-[22px] transition-all duration-300 p-1.5",
                  isLight
                    ? "bg-[#F0F4FF] border border-[#C7DFFF] text-[#101522] shadow-[0_4px_20px_rgba(22,141,235,0.08)] ring-0"
                    : "bg-white/[0.04] border border-white/15 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-0"
                )}
                fillClassName="bg-gradient-to-r from-[#168DEB] via-[#4F46E5] to-[#713CF6]"
                thumbClassName={cn(
                  "h-full aspect-square rounded-[18px] text-white shadow-md transition-colors",
                  isLight
                    ? "bg-gradient-to-br from-[#168DEB] to-[#713CF6]"
                    : "bg-gradient-to-br from-[#326BEE] to-[#8060F5]"
                )}
                completeLabel={
                  status === "loading" ? (
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-white">
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Transmitting Case...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-white">
                      <Check className="w-4 h-4 text-emerald-300" strokeWidth={2.5} />
                      Case Transmitted
                    </span>
                  )
                }
              >
                <span className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-[#101522] dark:text-white">
                  <span>Slide to Submit Case</span>
                  <span className="text-[#168DEB] dark:text-blue-400 font-black">→</span>
                </span>
              </SlideActionButton>
            </div>
          </form>

          {/* ── Footer Slogan ── */}
          <div className="mt-8 pt-3 text-center border-t border-[#E3E8F2]/60 dark:border-white/5">
            <p
              className={`text-[11px] sm:text-[12px] font-[650] tracking-[3px] uppercase ${
                isLight ? "text-[#8B9DBA]" : "text-zinc-500"
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
