"use client";

import { useState, useEffect, useRef } from "react";
import { PeakChart } from "@/components/ui/peak-chart";

interface StatConfig {
  id: string;
  badge: string;
  target: number;
  suffix: string;
  decimals?: number;
  label: string;
  sub: string;
  chartTitle: string;
  chartCaption: string;
  accent: string;
  series: Record<string, { data: number[]; labels: string[] }>;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    id: "cases",
    badge: "500+",
    target: 500,
    suffix: "+",
    label: "Cases Resolved",
    sub: "Verified resolution",
    chartTitle: "Resolved Security Cases",
    chartCaption: "High-priority recoveries vs previous period",
    accent: "#38bdf8",
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
    badge: "99.9%",
    target: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Success Rate",
    sub: "Tier-1 internal channels",
    chartTitle: "Channel Execution Accuracy",
    chartCaption: "Direct internal route verification pass rate",
    accent: "#4f8ef7",
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
    badge: "100%",
    target: 100,
    suffix: "%",
    label: "Secure Network",
    sub: "Strict confidentiality",
    chartTitle: "Encrypted Network Integrity",
    chartCaption: "Zero-knowledge encryption & audit compliance",
    accent: "#2ec99a",
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
    badge: "24/7",
    target: 24,
    suffix: "/7",
    label: "Direct Support",
    sub: "Telegram escalation",
    chartTitle: "Support Readiness Window",
    chartCaption: "Active response SLA: average under 12 minutes",
    accent: "#8b5cf6",
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
  const [selectedId, setSelectedId] = useState("cases");
  const [period, setPeriod] = useState("Monthly");
  const [chartWidth, setChartWidth] = useState(380);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStat = STAT_CONFIGS.find((s) => s.id === selectedId) || STAT_CONFIGS[0];
  const activeSeries = activeStat.series[period] || activeStat.series.Monthly;

  // Responsive chart width calculation
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      if (vw < 460) {
        setChartWidth(Math.min(vw - 48, 330));
      } else if (vw < 768) {
        setChartWidth(370);
      } else {
        setChartWidth(420);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-12 w-full max-w-4xl mx-auto flex flex-col items-center"
      aria-label="Key Performance Statistics and Immersive Peak Chart"
    >
      {/* 
        ── 1. FOUR CORE KPI SELECTOR TILES ──
        Exact requested values: 500+, 100%, 24/7, 99.9%
        Clicking any metric morphs the PeakChart below
      */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 w-full">
        {STAT_CONFIGS.map((stat) => {
          const isSelected = stat.id === selectedId;
          return (
            <button
              key={stat.id}
              onClick={() => setSelectedId(stat.id)}
              className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 group overflow-hidden focus-visible:outline-none ${
                isSelected
                  ? "border-cyan-400/60 bg-[#121626]/90 shadow-[0_0_24px_rgba(56,189,248,0.25)] scale-[1.02]"
                  : "border-white/10 bg-[#0E1017]/70 hover:border-white/20 hover:bg-[#121522]/70 backdrop-blur-xl"
              }`}
            >
              {/* Active Specular Glow Line */}
              {isSelected && (
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              )}

              {/* Numerical Value */}
              <div
                className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-0.5 group-hover:text-cyan-300 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <span className="tabular-nums font-mono">{stat.badge}</span>
              </div>

              {/* Label */}
              <div
                className="text-xs sm:text-sm font-semibold text-zinc-100 mt-1 tracking-wide"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {stat.label}
              </div>

              {/* Sub-label */}
              <div
                className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-normal truncate"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {stat.sub}
              </div>

              {/* Interactive Indicator Pill */}
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-cyan-400 animate-pulse" : "bg-zinc-600"
                  }`}
                />
                <span>{isSelected ? "Active View" : "Click to View"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 
        ── 2. IMMERSIVE PEAK CHART VISUALIZATION ──
        Displays interactive glow field, breath animation, peak dot, and period selector
      */}
      <div className="mt-6 w-full flex flex-col items-center">
        <div className="relative p-2 sm:p-4 rounded-3xl border border-white/10 bg-[#070B14]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col items-center overflow-hidden">
          {/* Subtle Outer Glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${activeStat.accent}15 0%, transparent 70%)`,
            }}
          />

          {/* Interactive Chart Container */}
          <div className="relative z-10 flex items-center justify-center py-2">
            <PeakChart
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

          {/* Explanatory Caption */}
          <div className="relative z-10 mt-1 pb-1 text-center text-[11px] sm:text-xs text-zinc-400 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Interactive telemetry · Drag crosshair to inspect resolution timeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
