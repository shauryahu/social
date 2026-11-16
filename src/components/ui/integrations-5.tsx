"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  InstagramIcon,
  WhatsAppIcon,
  TikTokIcon,
  XIcon,
  TelegramIcon,
  YouTubeIcon,
} from "@/components/icons/PlatformIcons";

interface IntegrationCardProps {
  children: React.ReactNode;
  className?: string;
  isCenter?: boolean;
  label?: string;
}

export function IntegrationCard({
  children,
  className,
  isCenter = false,
  label,
}: IntegrationCardProps) {
  return (
    <div
      title={label}
      className={cn(
        "relative z-30 flex size-11 sm:size-12 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110",
        "bg-white border-slate-200/90 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/15",
        "dark:bg-slate-900/95 dark:border-white/20 dark:shadow-black/50 dark:backdrop-blur-md",
        className
      )}
    >
      <div
        className={cn(
          "m-auto flex items-center justify-center size-fit *:size-5",
          isCenter && "*:size-8 sm:*:size-9"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export interface NetworkRadarProps {
  className?: string;
}

export function NetworkRadar({ className }: NetworkRadarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={cn(
        "aspect-16/10 group relative mx-auto flex w-full max-w-[21rem] items-center justify-between sm:max-w-sm",
        className
      )}
    >
      {/* Outer radar sweeping beam */}
      <div
        role="presentation"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t duration-[4.5s]",
          isLight
            ? "border-sky-500/50 bg-gradient-to-b from-sky-500/25 via-indigo-500/10 to-transparent opacity-85 group-hover:opacity-100"
            : "border-cyan-400/60 bg-gradient-to-b from-cyan-400/30 via-indigo-500/15 to-transparent opacity-80 group-hover:opacity-100"
        )}
      />

      {/* Inner radar sweeping beam (faster counter-rhythm) */}
      <div
        role="presentation"
        className={cn(
          "pointer-events-none absolute inset-10 sm:inset-14 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t duration-[3.2s]",
          isLight
            ? "border-purple-500/45 bg-gradient-to-b from-purple-500/20 via-sky-400/10 to-transparent opacity-75 group-hover:opacity-100"
            : "border-purple-400/55 bg-gradient-to-b from-purple-400/25 via-cyan-400/10 to-transparent opacity-70 group-hover:opacity-100"
        )}
      />

      {/* Outer Ring: Concentric radar grid with platforms */}
      <div
        className={cn(
          "absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t to-transparent to-25%",
          isLight
            ? "border-slate-300/80 bg-gradient-to-b from-slate-200/40"
            : "border-white/15 bg-gradient-to-b from-white/10"
        )}
      >
        <IntegrationCard
          label="Instagram"
          className="-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4"
        >
          <InstagramIcon className="w-5 h-5" />
        </IntegrationCard>

        <IntegrationCard
          label="Telegram"
          className="absolute top-0 -translate-y-1/2"
        >
          <TelegramIcon className="w-5 h-5 text-sky-500" />
        </IntegrationCard>

        <IntegrationCard
          label="X (Twitter)"
          className="translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4"
        >
          <XIcon className="w-4 h-4 text-slate-900 dark:text-white" />
        </IntegrationCard>
      </div>

      {/* Inner Ring: Concentric radar grid with platforms */}
      <div
        className={cn(
          "absolute inset-10 sm:inset-14 flex aspect-square scale-90 items-center justify-center rounded-full border-t to-transparent to-25%",
          isLight
            ? "border-slate-300/80 bg-gradient-to-b from-slate-200/50"
            : "border-white/15 bg-gradient-to-b from-white/10"
        )}
      >
        <IntegrationCard
          label="YouTube"
          className="absolute top-0 -translate-y-1/2"
        >
          <YouTubeIcon className="w-5 h-5 text-red-500" />
        </IntegrationCard>

        <IntegrationCard
          label="WhatsApp"
          className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4"
        >
          <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
        </IntegrationCard>

        <IntegrationCard
          label="TikTok"
          className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4"
        >
          <TikTokIcon className="w-4 h-4 text-slate-900 dark:text-white" />
        </IntegrationCard>
      </div>

      {/* Center Radar Hub: SocialAssist Brand Logo */}
      <div className="absolute inset-x-0 bottom-0 mx-auto my-1 sm:my-2 flex w-fit justify-center gap-2">
        <div
          className={cn(
            "relative z-20 rounded-full border p-1 transition-all duration-300",
            isLight
              ? "bg-slate-100/90 border-slate-300/80 shadow-md shadow-black/10"
              : "bg-slate-900/90 border-white/20 shadow-md shadow-black/50"
          )}
        >
          <IntegrationCard
            className={cn(
              "size-14 sm:size-16 transition-transform duration-300 hover:scale-105",
              isLight
                ? "bg-white border-slate-300 shadow-xl shadow-black/15"
                : "bg-slate-950 border-white/25 shadow-xl shadow-black/60"
            )}
            isCenter={true}
            label="SocialAssist Network Core"
          >
            <Image
              src={
                isLight
                  ? "/images/logo-apple-black.png"
                  : "/images/logo-apple-white.png"
              }
              alt="SocialAssist Brand Logo"
              width={36}
              height={36}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain block"
              priority
            />
          </IntegrationCard>
        </div>
      </div>
    </div>
  );
}

export interface IntegrationsSectionProps {
  className?: string;
  hideHeader?: boolean;
}

export default function IntegrationsSection({
  className,
  hideHeader = false,
}: IntegrationsSectionProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <NetworkRadar />

          {!hideHeader && (
            <div className="relative z-20 mx-auto mt-10 max-w-lg space-y-5 text-center">
              <h2
                className={cn(
                  "text-balance text-2xl font-bold tracking-tight md:text-3xl",
                  isLight ? "text-slate-900" : "text-white"
                )}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Real-Time Network Radar
              </h2>
              <p
                className={cn(
                  "text-sm md:text-base leading-relaxed",
                  isLight ? "text-slate-600" : "text-zinc-300"
                )}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Continuous orbital scanning, instant triage, and ironclad
                resolution across the global social media ecosystem.
              </p>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={cn(
                    "rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                    isLight
                      ? "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
                      : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10 hover:border-white/30"
                  )}
                >
                  <Link href="#services">Explore Network Coverage</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
