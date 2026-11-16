"use client";

import { useEffect, useRef, useState } from "react";

const SERVICE_OPTIONS = [
  "Account Recovery & Unban",
  "Verification Support",
  "Brand Protection & Impersonation",
  "Crypto Exchange (INR)",
  "Automated Ads & Distribution",
  "Custom Digital Service",
];

export default function TelegramInquiry() {
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
      setStatusMessage("Please write your custom details or requirements.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/telegram-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramUsername,
          selectedServices,
          customDetails,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setStatusMessage(data.message || "Inquiry sent to Telegram successfully!");
        setCustomDetails("");
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Failed to send inquiry to Telegram.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
      setStatusMessage("Network error. Please try again or contact via Telegram.");
    }
  };

  return (
    <section
      id="inquiry"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8"
      aria-labelledby="inquiry-heading"
    >
      {/* Background radial accent glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* Card Frame */}
        <div
          className="rounded-3xl p-4 sm:p-10"
          style={{
            background: "rgba(14,14,22,0.78)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span
              className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full inline-block mb-3"
              style={{
                color: "#C5A7FF",
                background: "rgba(124,58,237,0.22)",
                border: "1px solid rgba(124,58,237,0.4)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Direct Bot Dispatch
            </span>

            <h2
              id="inquiry-heading"
              className="text-3xl sm:text-4xl font-black tracking-tight mb-3"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "#FFFFFF",
              }}
            >
              Telegram Service Inquiry
            </h2>

            <p
              className="text-base font-medium max-w-xl mx-auto leading-relaxed"
              style={{
                color: "rgba(235,232,245,0.85)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Submit your Telegram username and custom requirements below. Your message
              will be dispatched directly to our Telegram Bot in real-time.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Telegram @username Input */}
            <div>
              <label
                htmlFor="telegram-username"
                className="block text-xs font-medium tracking-wider uppercase mb-2"
                style={{
                  color: "#C5A7FF",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Telegram Username <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sm font-medium"
                  style={{ color: "rgba(197,167,255,0.6)" }}
                >
                  @
                </div>
                <input
                  id="telegram-username"
                  type="text"
                  placeholder="username"
                  value={telegramUsername.replace(/^@/, "")}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    background: "rgba(8,8,12,0.7)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-inter)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
                    e.currentTarget.style.boxShadow =
                      "0 0 16px rgba(124,58,237,0.25)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Selectable Services Pills */}
            <div>
              <label
                className="block text-xs font-medium tracking-wider uppercase mb-2"
                style={{
                  color: "#C5A7FF",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Select Services Needed
              </label>

              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                      style={{
                        background: isSelected
                          ? "rgba(124,58,237,0.3)"
                          : "rgba(255,255,255,0.04)",
                        border: isSelected
                          ? "1px solid rgba(197,167,255,0.5)"
                          : "1px solid rgba(255,255,255,0.08)",
                        color: isSelected ? "#C5A7FF" : "rgba(217,214,227,0.6)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Details Textarea */}
            <div>
              <label
                htmlFor="custom-details"
                className="block text-xs font-medium tracking-wider uppercase mb-2"
                style={{
                  color: "#C5A7FF",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Custom Details & Requirements <span className="text-red-400">*</span>
              </label>

              <textarea
                id="custom-details"
                rows={4}
                placeholder="Write your specific request, account URL, issue description, or custom service details here..."
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none resize-none"
                style={{
                  background: "rgba(8,8,12,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-inter)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px rgba(124,58,237,0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Status Messages */}
            {statusMessage && (
              <div
                className="p-4 rounded-xl text-xs font-medium flex items-center gap-2"
                style={{
                  background:
                    status === "success"
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(239,68,68,0.12)",
                  border:
                    status === "success"
                      ? "1px solid rgba(34,197,94,0.3)"
                      : "1px solid rgba(239,68,68,0.3)",
                  color: status === "success" ? "#4ADE80" : "#FCA5A5",
                  fontFamily: "var(--font-inter)",
                }}
              >
                <span>{status === "success" ? "✅" : "⚠️"}</span>
                {statusMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, #4A16A8 0%, #7C3AED 50%, #9B5CFF 100%)",
                boxShadow:
                  "0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                fontFamily: "var(--font-inter)",
              }}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending Inquiry to Telegram...
                </span>
              ) : (
                "Send Inquiry to Telegram Bot →"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
