"use client";

import { useEffect, useRef, useState } from "react";

const COIN_DATA = {
  USDT: { name: "Tether USD", rate: 91.45, symbol: "₮", color: "#26A17B" },
  BTC: { name: "Bitcoin", rate: 8450000, symbol: "₿", color: "#F7931A" },
  ETH: { name: "Ethereum", rate: 278000, symbol: "Ξ", color: "#627EEA" },
  LTC: { name: "Litecoin", rate: 7450, symbol: "Ł", color: "#345D9D" },
  BNB: { name: "BNB Chain", rate: 58200, symbol: "BNB", color: "#F3BA2F" },
};

type CoinKey = keyof typeof COIN_DATA;

export default function CryptoExchange() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinKey>("USDT");
  const [amount, setAmount] = useState<number>(1000);

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

  const activeRate = COIN_DATA[selectedCoin].rate;
  const estimatedPayout = Math.round(amount * activeRate);

  return (
    <section
      id="exchange"
      ref={ref}
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden"
      aria-labelledby="exchange-heading"
    >
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[60vw] max-w-[800px] h-[500px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(38, 161, 123, 0.08) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block text-cyan-400 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ✦ Over-The-Counter Digital Settlement ✦
          </span>
          <h2
            id="exchange-heading"
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#FFFFFF" }}
          >
            Crypto.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #34D399 50%, #818CF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Converted Simply.
            </span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto text-zinc-400"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Exchange supported digital assets to INR and approved fiat corridors
            through SocialAssist&apos;s escrow-protected OTC settlement desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive 3D OTC Calculator & Asset Tokens */}
          <div
            className="flex flex-col items-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s",
            }}
          >
            <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#101018]/85 backdrop-blur-2xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                  Live OTC Rate Estimator
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Real-Time Desk
                </span>
              </div>

              {/* Coin Selector Chips */}
              <div>
                <label className="block text-xs text-zinc-400 mb-2 font-medium">Select Currency:</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(COIN_DATA) as CoinKey[]).map((coin) => (
                    <button
                      key={coin}
                      onClick={() => setSelectedCoin(coin)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        selectedCoin === coin
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/40"
                          : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="text-sm font-semibold">{COIN_DATA[coin].symbol}</span>
                      <span className="text-[10px] font-mono">{coin}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">You Transfer:</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={amount || ""}
                      onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-[#0A0A0F] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-white text-base font-mono font-semibold outline-none transition-colors"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-bold text-zinc-400 font-mono">
                      {selectedCoin}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Estimated Bank Credit (INR):</label>
                  <div className="w-full bg-emerald-950/25 border border-emerald-800/40 rounded-xl py-3 px-4 text-emerald-400 text-lg font-mono font-bold flex items-center justify-between">
                    <span>₹ {estimatedPayout.toLocaleString("en-IN")}</span>
                    <span className="text-[11px] text-zinc-400 font-sans font-normal">Instant IMPS/RTGS</span>
                  </div>
                </div>
              </div>

              {/* Rate & Slippage Transparency */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Indicative: <strong className="text-white font-mono">1 {selectedCoin} = ₹{activeRate.toLocaleString("en-IN")}</strong>
                </span>
                <span className="text-emerald-400 font-mono font-semibold">0% Slippage</span>
              </div>

              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg shadow-emerald-950/40"
              >
                <span>Lock Rate on Telegram Escrow</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Details */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(24px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            <h3
              className="text-2xl sm:text-3xl font-black mb-4 text-white tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Simple. Streamlined. Escrow-Protected.
            </h3>
            <p
              className="text-base sm:text-lg leading-relaxed mb-6 text-zinc-300 font-normal"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Submit an inquiry to execute high-volume OTC liquidations to INR and approved bank channels
              through SocialAssist&apos;s human-assisted desk. Every exchange transaction is locked
              under strict milestone guarantees.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { label: "Supported Assets", val: "USDT (TRC20/ERC20), BTC, ETH, LTC, BNB" },
                { label: "Settlement Medium", val: "Instant IMPS / RTGS / Direct Bank Wire" },
                { label: "Escrow Protocol", val: "Verified intermediary lock before release" },
                { label: "Execution Time", val: "Average 15–30 minutes post-confirmation" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-3 border-b border-white/5"
                >
                  <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                    {row.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p
              className="text-xs leading-relaxed p-3.5 rounded-xl text-zinc-400 bg-white/[0.02] border border-white/5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Regulatory Notice: Exchange rates, liquidity availability, and supported rails fluctuate with market
              conditions. SocialAssist operates an inquiry-based, human-verified matching process with strict AML screening.
            </p>

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-6 px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] flex items-center gap-2 border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 shadow-lg shadow-cyan-950/40"
            >
              <span>Connect with OTC Desk</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
