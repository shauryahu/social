"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

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
      className="relative z-10 py-12 px-2 sm:px-4 w-full"
      aria-labelledby="inquiry-heading"
    >
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-3xl p-6 sm:p-10 border border-white/10 bg-[#101018]/90 backdrop-blur-2xl shadow-2xl transition-all duration-700 dark-console-box"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-2 block text-cyan-400 font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ✦ Direct Case Submission ✦
            </span>
            <h3
              id="inquiry-heading"
              className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Submit Case to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Telegram Desk
              </span>
            </h3>
            <p
              className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Direct, encrypted case transmission directly to our verified operators. Protected by anti-spam rate limiting.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="telegram-username"
                className="block text-xs font-semibold tracking-wider uppercase mb-2 text-zinc-300 font-mono"
              >
                Your Telegram Username <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="telegram-username"
                  type="text"
                  placeholder="@yourhandle"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-[#08080C] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Service Pills */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2 text-zinc-300 font-mono">
                Select Relevant Services
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm"
                          : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Details */}
            <div>
              <label
                htmlFor="custom-details"
                className="block text-xs font-semibold tracking-wider uppercase mb-2 text-zinc-300 font-mono"
              >
                Case Brief & Platform URLs <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="custom-details"
                rows={4}
                placeholder="Include your account handle, problem description, ban notice date, or specific OTC requirements..."
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm bg-[#08080C] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>

            {/* Status notification */}
            {statusMessage && (
              <div
                className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                  status === "success"
                    ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                    : "bg-red-950/40 border border-red-800 text-red-300"
                }`}
              >
                <span>{status === "success" ? "✓" : "!"}</span>
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 ${
                isLight
                  ? "btn-light-cyan font-bold text-slate-950 shadow-md"
                  : "text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-950/50"
              }`}
            >
              {status === "loading" ? (
                <span>Transmitting Encrypted File...</span>
              ) : (
                <span>Send Priority Case to Telegram Bot →</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
