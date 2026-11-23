"use client";

import { useEffect, useRef } from "react";

const TEMPLATE = `
<style>
:host {
  display: block;
  box-sizing: border-box;
  width: 100%;
  background: transparent;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-shadow: none;
}

.wrap {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 56px 24px 64px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
  text-align: left;
  color: #0a0a0a;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}

@media (min-width: 640px) {
  .wrap {
    padding: 72px 32px 80px;
    gap: 48px;
  }
}

@media (min-width: 820px) {
  .wrap {
    grid-template-columns: 1fr 1.1fr;
    gap: clamp(36px, 5vw, 68px);
    padding: 88px clamp(32px, 5vw, 60px) 96px;
  }
}

.tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b6b6b;
  margin-bottom: 18px;
}

.tag i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0a0a0a;
  flex: none;
}

h1 {
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.05;
  letter-spacing: -.035em;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0;
}

@media (min-width: 820px) {
  h1 {
    max-width: 12ch;
  }
}

.lead {
  margin-top: 20px;
  color: #6b6b6b;
  font-size: 16px;
  line-height: 1.55;
  max-width: 44ch;
}

@media (max-width: 819px) {
  .lead {
    max-width: none;
  }
}

.cta {
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #0a0a0a;
  color: #ffffff;
  border: 0;
  border-radius: 999px;
  padding: 12px 12px 12px 24px;
  font: 600 15px Inter, system-ui, sans-serif;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  box-shadow: none;
}

.cta span {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  color: #0a0a0a;
  transition: transform .2s ease;
  flex-shrink: 0;
  box-shadow: none;
}

@media (hover: hover) {
  .cta:hover span {
    transform: translateX(3px);
  }
}

.cta:focus-visible,
.row:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 3px;
}

.list {
  background: #ffffff;
  border: 1px solid #e2e2df;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  box-shadow: none;
}

.row {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border-top: 1px solid #e2e2df;
  background: #ffffff;
  color: #0a0a0a;
  transition: background .2s ease, color .2s ease;
  box-sizing: border-box;
  box-shadow: none;
}

.row:first-child {
  border-top: 0;
}

.ico {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f2f2f0;
  display: grid;
  place-items: center;
  color: #0a0a0a;
  flex-shrink: 0;
  transition: background .2s ease, color .2s ease;
  box-shadow: none;
}

.ico svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  box-shadow: none;
}

.row .t {
  display: block;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -.01em;
  color: inherit;
  line-height: 1.35;
  box-shadow: none;
}

.row .d {
  display: block;
  font-size: 14px;
  line-height: 1.45;
  color: #6b6b6b;
  margin-top: 2px;
  transition: color .2s ease;
  box-shadow: none;
}

.row:focus-visible {
  background: #0a0a0a;
  color: #ffffff;
}
.row:focus-visible .d {
  color: #a8a8a8;
}
.row:focus-visible .ico {
  background: rgba(255, 255, 255, .16);
  color: #ffffff;
}

@media (hover: hover) {
  .row:hover {
    background: #0a0a0a;
    color: #ffffff;
  }
  .row:hover .d {
    color: #a8a8a8;
  }
  .row:hover .ico {
    background: rgba(255, 255, 255, .16);
    color: #ffffff;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
  }
}
</style>

<div class="wrap">
  <div>
    <p class="tag"><i></i>Intellectual property and brand defense</p>
    <h1>Your identity should belong to you.</h1>
    <p class="lead">When bad actors hijack your name, likeness or intellectual property, they damage consumer trust and your valuation. SocialAssist files rapid legal takedown notices and uses platform-verified channels to remove them for good.</p>
    <button class="cta" type="button">Start a brand protection review <span>→</span></button>
  </div>
  <div class="list">
    <div class="row" tabindex="0">
      <div class="ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg></div>
      <div><span class="t">Executive and VIP impersonation</span><span class="d">Immediate takedown of fake clone accounts on Instagram, X and Telegram.</span></div>
    </div>
    <div class="row" tabindex="0">
      <div class="ico"><svg viewBox="0 0 24 24"><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/></svg></div>
      <div><span class="t">Fraudulent commercial representation</span><span class="d">Removing scam stores, fake token projects and phishing landing pages.</span></div>
    </div>
    <div class="row" tabindex="0">
      <div class="ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a3.5 3.5 0 100 5"/></svg></div>
      <div><span class="t">Copyright and DMCA escalation</span><span class="d">Direct legal portal removal of stolen media, assets and trademarked materials.</span></div>
    </div>
    <div class="row" tabindex="0">
      <div class="ico"><svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></div>
      <div><span class="t">Proactive perimeter monitoring</span><span class="d">Ongoing surveillance to stop copycat profiles before they gain traction.</span></div>
    </div>
  </div>
</div>
`;

export default function BrandProtection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!customElements.get("brand-defense")) {
      class BrandDefense extends HTMLElement {
        connectedCallback() {
          let root = this.shadowRoot;
          if (!root) {
            root = this.attachShadow({ mode: "open" });
          }
          root.innerHTML = TEMPLATE;

          const cta = root.querySelector(".cta");
          if (cta) {
            cta.addEventListener("click", () => {
              document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
            });
          }
        }
      }

      customElements.define("brand-defense", BrandDefense);
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const el = document.createElement("brand-defense");
      el.style.display = "block";
      el.style.width = "100%";
      el.style.boxSizing = "border-box";
      el.style.background = "transparent";
      containerRef.current.appendChild(el);
    }
  }, []);

  return (
    <section
      id="brand-protection"
      ref={containerRef}
      className="w-full relative z-10 max-w-full"
      style={{
        display: "block",
        boxSizing: "border-box",
        width: "100%",
        background: "transparent",
        padding: 0,
        margin: 0,
        marginBottom: "36px",
      }}
      aria-label="Intellectual Property and Brand Defense"
    />
  );
}
