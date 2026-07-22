"use client";

import { useState } from "react";
import BackgroundEffects from "@/components/BackgroundEffects";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/sections/HeroSection";
import CredibilityStrip from "@/components/sections/CredibilityStrip";
import ServicesSection from "@/components/sections/ServicesSection";
import PlatformEcosystem from "@/components/sections/PlatformEcosystem";
import AccountAssistance from "@/components/sections/AccountAssistance";
import VerificationSection from "@/components/sections/VerificationSection";
import BrandProtection from "@/components/sections/BrandProtection";
import CryptoExchange from "@/components/sections/CryptoExchange";
import AutomatedAds from "@/components/sections/AutomatedAds";
import AboutSection from "@/components/sections/AboutSection";
import ChannelShowcase from "@/components/sections/ChannelShowcase";
import TelegramInquiry from "@/components/sections/TelegramInquiry";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/*
        Navigation is OUTSIDE the blurred div on purpose.
        A parent element with `filter` creates a new stacking context
        which breaks `position: fixed` on children.
        The nav fades in separately once loaded.
      */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease-out 0.1s",
          // NO filter here — filter would break fixed positioning
        }}
      >
        <Navigation />
      </div>

      {/* Main site content — uses opacity only, no filter, so fixed nav works */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.7s ease-out",
        }}
      >
        {/* Background orbs & cursor glow */}
        <BackgroundEffects />

        {/* Page sections in exact UX journey order */}
        <main>
          <HeroSection />
          <CredibilityStrip />
          <ServicesSection />
          <PlatformEcosystem />
          <AccountAssistance />
          <VerificationSection />
          <BrandProtection />
          <CryptoExchange />
          <AutomatedAds />
          <AboutSection />
          <ChannelShowcase />
          <FinalCTA />
        </main>

        <Footer />
      </div>
    </>
  );
}
