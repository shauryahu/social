"use client";

import { useState, useEffect, useRef } from "react";
import { PeakChart } from "@/components/ui/peak-chart";
import { ShieldCheck, TrendingUp, Lock, Headphones, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface StatConfig {
  id: string;
  target: number;
  suffix: string;
  decimals?: number;
  label: string;
  sub: string;
  chartTitle: string;
  chartCaption: string;
  accent: string;
  icon: typeof ShieldCheck;
  series: Record<string, { data: number[]; labels: string[] }>;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    id: "cases",
    target: 500,
    suffix: "+",
    label: "Cases Resolved",
    sub: "Verified resolution",
    chartTitle: "Cases Resolved",
    chartCaption: "High-priority recoveries vs previous period",
    accent: "#38bdf8",
    icon: ShieldCheck,
    series: {
      Weekly: {
        data: [42, 58, 64, 82, 115, 138, 150],
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      Monthly: {
        data: [120, 145, 180, 210, 260, 310, 360, 420, 470, 500],
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "Current"],
      },
      Yearly: {
        data: [110, 160, 210, 280, 340, 390, 430, 460, 485, 500],
        labels: ["Jan", "Mar", "May", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Peak"],
      },
    },
  },
  {
    id: "rate",
    target: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Success Rate",
    sub: "Tier-1 internal channels",
    chartTitle: "Success Rate",
    chartCaption: "Direct internal route verification pass rate",
    accent: "#4f8ef7",
    icon: TrendingUp,
    series: {
      Weekly: {
        data: [98.4, 98.9, 99.1, 99.4, 99.7, 99.8, 99.9],
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      Monthly: {
        data: [97.5, 98.1, 98.6, 99.0, 99.2, 99.5, 99.8, 99.9],
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "Peak"],
      },
      Yearly: {
        data: [96.0, 97.2, 98.0, 98.8, 99.3, 99.7, 99.9],
        labels: ["Q1", "Q2", "Q3", "Q4", "H1", "H2", "Current"],
      },
    },
  },
  {
    id: "network",
    target: 100,
    suffix: "%",
    label: "Secure Network",
    sub: "Strict confidentiality",
    chartTitle: "Secure Network",
    chartCaption: "Zero-knowledge encryption & confidentiality audit",
    accent: "#2ec99a",
    icon: Lock,
    series: {
      Weekly: {
        data: [100, 100, 100, 100, 100, 100, 100],
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      Monthly: {
        data: [99.8, 99.9, 100, 100, 100, 100, 100],
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "Current"],
      },
      Yearly: {
        data: [99.5, 99.8, 99.9, 100, 100, 100],
        labels: ["2022", "2023", "2024", "Q1", "Q2", "Current"],
      },
    },
  },
  {
    id: "support",
    target: 24,
    suffix: "/7",
    label: "Direct Support",
    sub: "Telegram escalation",
    chartTitle: "Direct Support",
    chartCaption: "Active response SLA: average under 12 minutes",
    accent: "#8b5cf6",
    icon: Headphones,
    series: {
      Weekly: {
        data: [24, 24, 24, 24, 24, 24, 24],
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      Monthly: {
        data: [24, 24, 24, 24, 24, 24, 24, 24],
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      },
      Yearly: {
        data: [24, 24, 24, 24, 24, 24],
        labels: ["2022", "2023", "2024", "Q1", "Q2", "Current"],
      },
    },
  },
];

export default function AnimatedStatistics() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [selectedId, setSelectedId] = useState("cases");
  const [period, setPeriod] = useState("Monthly");
  const [chartWidth, setChartWidth] = useState(360);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStat = STAT_CONFIGS.find((s) => s.id === selectedId) || STAT_CONFIGS[0];
  const activeSeries = activeStat.series[period] || activeStat.series.Monthly;

  // Responsive chart width calculation
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      if (vw < 420) {
        setChartWidth(Math.min(vw - 40, 310));
      } else if (vw < 768) {
        setChartWidth(340);
      } else if (vw < 1024) {
        setChartWidth(360);
      } else {
        setChartWidth(390);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-20 sm:mt-24 md:mt-28 w-full max-w-5xl mx-auto"
      aria-label="Key Performance Statistics and Immersive Peak Chart"
    >
      {/* 
        ── SIDE-BY-SIDE CONSOLE LAYOUT ──
        Left: Vertically stacked stats buttons (without numbers)
        Right: Immersive Peak Chart displaying the animated numbers and curve
      */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 w-full">
        {/* 
          ── LEFT COLUMN: VERTICALLY STACKED METRIC SELECTORS ──
          Ordered top-to-bottom: Cases Resolved, Success Rate, Secure Network, Direct Support
          No numbers displayed here; numbers only reveal inside the chart upon click!
        */}
        <div className="w-full md:w-72 lg:w-80 flex flex-col gap-3 justify-center">
          <div className="text-left pb-1">
            <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Interactive Telemetry
            </span>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select a metric to view live telemetry and verification history
            </p>
          </div>

          {STAT_CONFIGS.map((stat) => {
            const isSelected = stat.id === selectedId;
            const Icon = stat.icon;

            return (
              <button
                key={stat.id}
                onClick={() => setSelectedId(stat.id)}
                className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 group overflow-hidden focus-visible:outline-none flex items-center justify-between gap-3 ${
                  isSelected
                    ? isLight
                      ? "border-sky-500/70 bg-gradient-to-r from-sky-100/90 via-white to-sky-50/70 shadow-[0_8px_24px_rgba(2,132,199,0.18)] scale-[1.02]"
                      : "border-cyan-400/60 bg-gradient-to-r from-cyan-950/40 via-[#121626]/90 to-[#121626]/90 shadow-[0_0_24px_rgba(56,189,248,0.22)] scale-[1.02]"
                    : isLight
                      ? "border-slate-200/90 bg-white/95 hover:border-slate-300 hover:bg-white shadow-sm"
                      : "border-white/10 bg-[#0E1017]/70 hover:border-white/20 hover:bg-[#121522]/70 backdrop-blur-xl"
                }`}
              >
                {/* Active Specular Glow Line */}
                {isSelected && (
                  <div
                    className="absolute inset-x-0 top-0 h-[1.5px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`,
                    }}
                  />
                )}

                {/* Left: Icon & Text (No numbers) */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? isLight
                          ? "bg-sky-500/15 text-sky-700 border border-sky-400/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                        : isLight
                          ? "bg-slate-100 text-slate-500 group-hover:text-slate-900 border border-slate-200"
                          : "bg-white/5 text-zinc-400 group-hover:text-white border border-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-sm sm:text-base font-bold tracking-wide transition-colors ${
                        isSelected
                          ? isLight
                            ? "text-slate-950"
                            : "text-white"
                          : isLight
                            ? "text-slate-700 group-hover:text-slate-950"
                            : "text-zinc-200 group-hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {stat.label}
                    </div>
                    <div
                      className={`text-[11px] sm:text-xs font-normal truncate mt-0.5 ${
                        isLight ? "text-slate-500" : "text-zinc-400"
                      }`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {stat.sub}
                    </div>
                  </div>
                </div>

                {/* Right: Active status dot & chevron */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected
                        ? "animate-pulse"
                        : isLight
                          ? "bg-slate-300 group-hover:bg-slate-400"
                          : "bg-zinc-600 group-hover:bg-zinc-400"
                    }`}
                    style={{
                      backgroundColor: isSelected ? stat.accent : undefined,
                      boxShadow: isSelected ? `0 0 10px ${stat.accent}` : undefined,
                    }}
                  />
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected
                        ? isLight
                          ? "text-sky-600 translate-x-0.5"
                          : "text-cyan-400 translate-x-0.5"
                        : isLight
                          ? "text-slate-400 group-hover:text-slate-600"
                          : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* 
          ── RIGHT COLUMN: IMMERSIVE PEAK CHART ──
          The numbers ONLY appear here in the chart!
          Morphs smoothly on click with Louis Studios glow, Steffen curve, peak dot, and period selector
        */}
        <div className="flex flex-col items-center">
          {/* Outer White Container with Mathematically Equal Spacing and Concentric Pillowy Rounded Corners */}
          <div
            data-stat-chart-card=""
            className={`relative border backdrop-blur-2xl flex items-center justify-center overflow-hidden p-4 sm:p-5 rounded-[48px] sm:rounded-[58px] md:rounded-[60px] ${
              isLight
                ? "border-slate-200/90 bg-white/95 shadow-2xl shadow-slate-200/80"
                : "border-white/10 bg-[#070B14]/90 shadow-2xl shadow-black/80"
            }`}
            style={{
              boxSizing: "border-box",
              borderRadius: `${Math.round((56 * chartWidth) / 540 + (chartWidth <= 320 ? 16 : 20))}px`,
            }}
          >
            {/* Subtle Dynamic Ambient Glow — Centered with matching inherited radius */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{
                borderRadius: "inherit",
                background: `radial-gradient(circle at 50% 50%, ${activeStat.accent}18 0%, transparent 70%)`,
              }}
            />

            {/* Interactive Chart Container: Pure Zero-Padding Block */}
            <div className="relative z-10 flex items-center justify-center p-0 m-0 leading-none">
              <PeakChart
                className="block leading-none m-0 p-0"
                style={{ display: "block" }}
                width={chartWidth}
                accent={activeStat.accent}
                data={activeSeries.data}
                labels={activeSeries.labels}
                value={activeStat.target}
                valueSuffix={activeStat.suffix}
                decimals={activeStat.decimals ?? 0}
                title={activeStat.chartTitle}
                caption={activeStat.chartCaption}
                updatedText="Live Network Verified"
                trend="up"
                period={period}
                onPeriodChange={setPeriod}
                periods={["Weekly", "Monthly", "Yearly"]}
                formatValue={(v) =>
                  activeStat.decimals
                    ? `${v.toFixed(activeStat.decimals)}${activeStat.suffix}`
                    : `${Math.round(v)}${activeStat.suffix}`
                }
              />
            </div>
          </div>

          {/* Explanatory Caption — Positioned directly underneath the white container */}
          <div className="mt-3 text-center text-[11px] sm:text-xs text-zinc-400 font-mono flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Click metric on left to inspect · Drag crosshair to read points</span>
          </div>
        </div>
      </div>
    </div>
  );
}
