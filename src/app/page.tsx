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
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <Navigation />

      {/* Main site content */}
      <div>
        {/* Background orbs & cursor glow */}
        <BackgroundEffects />

        {/* Page sections in exact UX journey order */}
        <main className="overflow-x-hidden">
          <HeroSection />
          <div className="section-contain"><CredibilityStrip /></div>
          <div className="section-contain"><ServicesSection /></div>
          <div className="section-contain"><PlatformEcosystem /></div>
          <div className="section-contain"><AccountAssistance /></div>
          <div className="section-contain"><VerificationSection /></div>
          <div className="section-contain"><BrandProtection /></div>
          <div className="section-contain"><CryptoExchange /></div>
          <div className="section-contain"><AutomatedAds /></div>
          <div className="section-contain"><AboutSection /></div>
          <div className="section-contain"><ChannelShowcase /></div>
          <div className="section-contain"><FinalCTA /></div>
        </main>

        <Footer />
      </div>
    </>
  );
}
