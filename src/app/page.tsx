"use client";

import { useState } from "react";
import BackgroundEffects from "@/components/BackgroundEffects";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/sections/HeroSection";
import CredibilityStrip from "@/components/sections/CredibilityStrip";
import BrandProtection from "@/components/sections/BrandProtection";
import CryptoExchange from "@/components/sections/CryptoExchange";
import AutomatedAds from "@/components/sections/AutomatedAds";
import AboutSection from "@/components/sections/AboutSection";
import ChannelShowcase from "@/components/sections/ChannelShowcase";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import LanguageSelectorDropdown from "@/components/ui/language-selector-dropdown";
import { useTheme } from "@/components/ThemeProvider";
import { SunMoonThemeToggle } from "@/components/ui/sun-moon-theme-toggle";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <>
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <Navbar />

      {/* Main site content */}
      <div>
        {/* Background orbs & cursor glow */}
        <BackgroundEffects />

        {/* Page sections in exact UX journey order with clean architectural contrast dividers */}
        <main className="overflow-x-hidden">
          <HeroSection />
          <div className="section-contain border-divider"><CredibilityStrip /></div>
          <services-showcase id="services"></services-showcase>
          <platform-radar id="platforms"></platform-radar>
          <restoration-section></restoration-section>
          <verification-section></verification-section>
          <div className="section-contain border-divider"><BrandProtection /></div>
          <div className="section-contain border-divider"><CryptoExchange /></div>
          <div className="section-contain"><AutomatedAds /></div>
          <div className="section-contain"><AboutSection /></div>
          <div className="section-contain border-divider"><ChannelShowcase /></div>
          <div className="section-contain border-divider"><FinalCTA /></div>
        </main>

        <Footer />
      </div>

      {/* Downside Progressive Blur */}
      <ProgressiveBlur
        position="bottom"
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none transition-colors duration-300"
        height="120px"
        blurAmount="8px"
        backgroundColor={isLight ? "#e9ebf0" : "#07070A"}
      />

      {/* Floating Bottom-Left Language Selector Dropdown */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40">
        <LanguageSelectorDropdown menuDirection="up" />
      </div>

      {/* Floating Bottom-Right Theme Toggle */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        <SunMoonThemeToggle
          theme={theme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          size={36}
          duration={1200}
          sky={true}
          className="transition-all duration-200 border border-slate-300/80 dark:border-white/10 shadow-lg hover:scale-105"
          title={isLight ? "Switch to Dark Theme" : "Switch to Light Theme"}
          aria-label="Toggle White and Dark Theme"
        />
      </div>
    </>
  );
}
