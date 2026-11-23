"use client";

import { useEffect, useRef } from "react";

export default function CryptoExchange() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!customElements.get("otc-section")) {
      const TEMPLATE = `
<style>
:host{
  display:block;box-sizing:border-box;text-align:center;color:#0b0c10;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;
  background:transparent;width:100%;max-width:100%;overflow-x:clip;
}
*,*::before,*::after{box-sizing:border-box}
[hidden]{display:none!important}
h1,h2,p,dl,dd,dt{margin:0;padding:0}
button,input,select{font-family:inherit}

.page{
  max-width:860px;width:100%;margin:0 auto;box-sizing:border-box;
  padding:calc(56px + env(safe-area-inset-top,0px)) 24px calc(88px + env(safe-area-inset-bottom,0px));
}
@media (min-width:640px){
  .page{
    padding:calc(72px + env(safe-area-inset-top,0px)) 36px 96px;
  }
}
@media (min-width:1024px){
  .page{
    padding:calc(88px + env(safe-area-inset-top,0px)) clamp(40px,5vw,64px) 112px;
  }
}

header{max-width:100%;margin:0 auto;padding:0}
.eyebrow{font-weight:600;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:#2b2e3a;margin-bottom:20px}
h1{
  font-weight:800;font-size:clamp(30px,7.5vw,68px);line-height:1.08;letter-spacing:-.035em;
  color:#0b0c10;margin-bottom:18px;overflow-wrap:break-word;word-break:break-word;max-width:100%;
}
h1 .dim{background:linear-gradient(90deg,#2b2e3a,#5a5f70);-webkit-background-clip:text;background-clip:text;color:transparent;display:inline}
.sub{max-width:660px;width:100%;margin:0 auto 48px;font-size:clamp(15px,2.2vw,19.5px);line-height:1.5;color:#4a4e5d;padding:0}

.card{
  position:relative;max-width:600px;width:100%;margin:0 auto;text-align:left;color:#fff;padding:26px;border-radius:34px;
  background:radial-gradient(120% 55% at 50% -8%,rgba(255,255,255,.13),transparent 60%),linear-gradient(160deg,rgba(40,42,54,.96),rgba(15,16,22,.97));
  border:1px solid rgba(255,255,255,.1);box-sizing:border-box;
  box-shadow:0 28px 50px -28px rgba(10,12,20,.55),0 2px 6px rgba(10,12,20,.12),inset 0 1px 0 rgba(255,255,255,.28);
}
.card::before{
  content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(140deg,rgba(255,255,255,.5),rgba(255,255,255,.02) 34%,rgba(255,255,255,.02) 66%,rgba(255,255,255,.3));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);
}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.14)}
.top h2{font-weight:700;font-size:clamp(13.5px,3.2vw,17px);letter-spacing:.02em;text-transform:uppercase;color:#fff}
.live{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:500;color:rgba(255,255,255,.85);white-space:nowrap}
.live i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);transition:background .3s,box-shadow .3s}
.live i.on{background:#34d27b;box-shadow:0 0 0 4px rgba(52,210,123,.22)}

.seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;border-radius:99px;background:rgba(255,255,255,.08);margin-top:18px}
.seg button{appearance:none;-webkit-appearance:none;border:0;height:40px;border-radius:99px;background:transparent;color:rgba(255,255,255,.78);font-weight:600;font-size:14px;cursor:pointer;transition:background .3s,color .3s}
.seg button[aria-checked="true"]{background:linear-gradient(180deg,#fff,#dfe1e9);color:#14161d;box-shadow:0 3px 10px rgba(0,0,0,.3)}

.lbl{display:block;margin:20px 0 9px;font-weight:600;font-size:13.5px;color:rgba(255,255,255,.72)}
.rowlbl{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}
.flip{appearance:none;-webkit-appearance:none;cursor:pointer;margin-bottom:6px;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-size:15px;line-height:1;padding:0;transition:transform .2s,background .2s}
.flip:hover{background:rgba(255,255,255,.2);transform:rotate(180deg)}

.coins{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;width:100%;box-sizing:border-box}
.coin{
  appearance:none;-webkit-appearance:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:4px;height:clamp(56px,11vw,66px);padding:0;border-radius:18px;min-width:0;width:100%;box-sizing:border-box;
  color:rgba(255,255,255,.85);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);
  transition:background .25s,color .25s,box-shadow .25s,transform .2s;
}
.coin:active{transform:scale(.96)}
.coin .g{height:22px;display:grid;place-items:center;font-size:19px;font-weight:700;line-height:1}
.coin .g svg{width:19px;height:19px;fill:currentColor}
.coin .t{font-size:12px;font-weight:600;letter-spacing:.01em}
.coin[aria-checked="true"]{background:linear-gradient(180deg,#fff,#dcdfe8);color:#14161d;border-color:#fff;box-shadow:0 6px 18px -4px rgba(255,255,255,.35)}

.field{
  display:flex;align-items:center;gap:10px;height:64px;padding:0 10px 0 18px;border-radius:20px;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);position:relative;width:100%;box-sizing:border-box;
  transition:border-color .2s,box-shadow .2s,background .2s;
}
.field.out{height:76px;background:rgba(255,255,255,.04)}
.field:focus-within{border-color:rgba(255,255,255,.6);background:rgba(255,255,255,.09);box-shadow:0 0 0 4px rgba(255,255,255,.08)}

input{
  appearance:none;-webkit-appearance:none;flex:1;min-width:0;width:100%;margin:0;padding:0;border:0;outline:0;box-shadow:none;border-radius:0;
  background:transparent;color:#fff;-webkit-text-fill-color:#fff;caret-color:#fff;font-weight:600;font-size:clamp(18px,4.6vw,24px);
  line-height:1.2;letter-spacing:-.01em;font-variant-numeric:tabular-nums;box-sizing:border-box;
}
input:focus,input:focus-visible{outline:none;box-shadow:none}
input::placeholder{color:rgba(255,255,255,.3);-webkit-text-fill-color:rgba(255,255,255,.3)}
input:-webkit-autofill{-webkit-text-fill-color:#fff;transition:background-color 9999s}

strong{
  flex:1;min-width:0;font-weight:700;font-size:clamp(20px,5vw,30px);letter-spacing:-.015em;color:#fff;
  font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

.pill{
  flex:none;display:inline-flex;align-items:center;height:42px;padding:0 16px;border-radius:99px;
  background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);font-weight:600;font-size:14px;color:#fff;white-space:nowrap;
}
.pill.soft{font-weight:500;font-size:13px;color:rgba(255,255,255,.8)}

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM DARK GLASSMORPHIC CURRENCY DROPDOWNS (No Native White Menus)
   ══════════════════════════════════════════════════════════════════════ */
.dd-wrap{position:relative;flex:none;display:inline-flex}

.dd-trigger{
  appearance:none;-webkit-appearance:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:space-between;
  gap:8px;height:42px;padding:0 14px 0 16px;border-radius:99px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);
  font-weight:600;font-size:14px;color:#fff;white-space:nowrap;user-select:none;
  transition:background .2s,border-color .2s,box-shadow .2s,transform .15s;
}
.dd-trigger:hover{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.36)}
.dd-trigger:active{transform:scale(.98)}
.dd-trigger[aria-expanded="true"]{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.5);box-shadow:0 0 14px rgba(255,255,255,.16)}

.dd-chevron{
  width:10px;height:7px;stroke:rgba(255,255,255,.85);transition:transform .25s cubic-bezier(.16,1,.3,1);pointer-events:none;
}
.dd-trigger[aria-expanded="true"] .dd-chevron{transform:rotate(180deg)}

.dd-menu{
  position:absolute;top:calc(100% + 8px);right:0;z-index:100;min-width:180px;max-width:calc(100vw - 32px);
  max-height:250px;overflow-y:auto;overflow-x:hidden;padding:6px;border-radius:18px;
  background:rgba(24,26,34,.96);-webkit-backdrop-filter:blur(28px) saturate(180%);backdrop-filter:blur(28px) saturate(180%);
  border:1px solid rgba(255,255,255,.16);
  box-shadow:0 20px 40px -10px rgba(0,0,0,.7),0 8px 16px -4px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.2);
  transform-origin:top right;animation:dd-pop .2s cubic-bezier(.16,1,.3,1) forwards;
}

@keyframes dd-pop{
  0%{opacity:0;transform:scale(.95) translateY(-6px)}
  100%{opacity:1;transform:scale(1) translateY(0)}
}

.dd-item{
  appearance:none;-webkit-appearance:none;border:0;width:100%;display:flex;align-items:center;justify-content:space-between;
  gap:10px;padding:8px 12px;border-radius:12px;background:transparent;color:rgba(255,255,255,.88);font-family:inherit;
  font-size:13.5px;font-weight:500;cursor:pointer;text-align:left;transition:background .15s,color .15s;
}
.dd-item:hover{background:rgba(255,255,255,.1);color:#fff}
.dd-item[aria-selected="true"]{
  background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.14));color:#fff;font-weight:700;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2);
}
.dd-item-left{display:flex;align-items:center;gap:8px}
.dd-item-glyph{width:20px;height:20px;display:grid;place-items:center;font-size:14px;font-weight:700;color:#fff}
.dd-item-glyph svg{width:16px;height:16px;fill:currentColor}
.dd-item-name{font-size:13px;font-weight:600;color:#fff}
.dd-item-sub{font-size:11px;color:rgba(255,255,255,.5);font-family:monospace}
.dd-check{display:none;width:12px;height:12px;color:#34d27b}
.dd-item[aria-selected="true"] .dd-check{display:block}

.dd-menu::-webkit-scrollbar{width:5px}
.dd-menu::-webkit-scrollbar-track{background:transparent}
.dd-menu::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:99px}
.dd-menu::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.35)}

.meta{display:flex;justify-content:space-between;gap:12px;margin-top:20px;padding-top:18px;border-top:1px solid rgba(255,255,255,.14);font-weight:500;font-size:14px;color:rgba(255,255,255,.72)}
.meta b,.meta .r{color:#fff;font-weight:700}
.meta .r{white-space:nowrap}

.cta{
  appearance:none;-webkit-appearance:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;
  width:100%;height:64px;margin-top:18px;border-radius:99px;border:1px solid #fff;color:#0b0c10;font-weight:700;
  font-size:clamp(15.5px,3.8vw,18px);background:linear-gradient(180deg,#fff,#d9dce8);box-shadow:0 0 28px rgba(255,255,255,.22),inset 0 1px 0 #fff;
  transition:transform .2s,box-shadow .2s;
}
.cta:hover{transform:scale(1.015);box-shadow:0 0 34px rgba(255,255,255,.35),inset 0 1px 0 #fff}
.cta:active{transform:scale(.985)}
.src{margin-top:14px;text-align:center;font-size:12px;color:rgba(255,255,255,.6);line-height:1.4}
:focus-visible{outline:2px solid #fff;outline-offset:3px}

.os{max-width:600px;width:100%;margin:72px auto 0;text-align:left;box-sizing:border-box}
.os-title{font-weight:700;font-size:clamp(23px,4.5vw,30px);line-height:1.15;letter-spacing:-.02em;color:#0b0c10;margin-bottom:14px}
.os-lead{font-size:clamp(15px,2.2vw,16.5px);line-height:1.6;color:#4a4e5d;margin-bottom:26px}
.os-row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:16px 0;border-bottom:1px solid rgba(15,18,40,.14);width:100%;box-sizing:border-box}
.os-k{font-size:14px;font-weight:500;color:#555a6b;flex:none}
.os-v{font:600 13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#0b0c10;text-align:right;overflow-wrap:break-word;word-break:break-word}
.os-note{margin-top:22px;font-size:12.5px;line-height:1.6;color:#555a6b}
.os-cta{
  display:inline-flex;align-items:center;gap:10px;margin-top:26px;padding:16px 30px;border-radius:99px;text-decoration:none;
  font-weight:600;font-size:15px;color:#fff;border:1px solid rgba(255,255,255,.18);background:linear-gradient(160deg,#3a3d4a,#0f1118);
  box-shadow:0 12px 26px -12px rgba(10,12,20,.6),inset 0 1px 0 rgba(255,255,255,.3);transition:transform .2s;
}
.os-cta:hover{transform:scale(1.02)}
.os-cta:active{transform:scale(.98)}
.os-cta:focus-visible{outline-color:#0b0c10}

@media (max-width:640px){
  .os-row{flex-direction:column;gap:4px}
  .os-v{text-align:left}
  .os-cta{width:100%;justify-content:center}
}
@media (max-width:520px){
  .card{padding:20px 14px;border-radius:28px}
  .coins{gap:6px}
  .coin{border-radius:14px;height:clamp(52px,12vw,62px)}
  .coin .g{font-size:17px}
  .coin .t{font-size:11px}
  .field{padding:0 8px 0 14px;height:58px}
  .field.out{height:68px}
  .meta{font-size:12.5px;flex-direction:column;gap:6px}
  .dd-menu{min-width:160px;right:0}
  .dd-trigger{height:38px;padding:0 12px 0 14px;font-size:13px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<div class="page">
  <header>
    <p class="eyebrow">Over-the-counter digital settlement</p>
    <h1>Crypto. <span class="dim">Converted Simply.</span></h1>
    <p class="sub">Exchange supported digital assets to INR and approved fiat corridors through SocialAssist’s escrow-protected OTC settlement desk.</p>
  </header>

  <section class="card" aria-labelledby="est">
    <div class="top">
      <h2 id="est">Live OTC Rate Estimator</h2>
      <div class="live"><i id="dot"></i>Real-Time Desk</div>
    </div>
    <div class="seg" role="radiogroup" aria-label="Conversion type">
      <button type="button" role="radio" id="mInr" aria-checked="true">Crypto to INR</button>
      <button type="button" role="radio" id="mSwap" aria-checked="false">Crypto to Crypto</button>
    </div>

    <span class="lbl" id="l1">Select Currency:</span>
    <div class="coins" role="radiogroup" aria-labelledby="l1" id="fromBox"></div>

    <label class="lbl" for="amt">You Transfer:</label>
    <div class="field">
      <input id="amt" type="text" inputmode="decimal" autocomplete="off" placeholder="0" value="1000">
      <div class="dd-wrap" id="fromDdWrap">
        <button type="button" class="dd-trigger" id="fromTrigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select transfer currency">
          <span id="fromTriggerText">USDT</span>
          <svg class="dd-chevron" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 1.5 6 6.5 11 1.5"/></svg>
        </button>
        <div class="dd-menu" id="fromMenu" role="listbox" aria-label="Transfer currency options" hidden></div>
      </div>
    </div>

    <div class="rowlbl">
      <span class="lbl" id="outLbl">Estimated Bank Credit (INR):</span>
      <button class="flip" id="flip" type="button" aria-label="Reverse the swap direction" hidden>⇅</button>
    </div>
    <div class="field out">
      <strong id="out">₹ 0</strong>
      <span class="pill soft" id="outU">Instant IMPS/RTGS</span>
      <div class="dd-wrap" id="toDdWrap" hidden>
        <button type="button" class="dd-trigger" id="toTrigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select receive currency">
          <span id="toTriggerText">BTC</span>
          <svg class="dd-chevron" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 1.5 6 6.5 11 1.5"/></svg>
        </button>
        <div class="dd-menu" id="toMenu" role="listbox" aria-label="Receive currency options" hidden></div>
      </div>
    </div>

    <div class="meta">
      <span id="rateL">Indicative: <b id="rate"></b></span>
      <span class="r" id="rateR">0% Slippage</span>
    </div>
    <button class="cta" type="button"><span id="ctaT">Lock Rate on Telegram Escrow</span> <span aria-hidden="true">→</span></button>
    <p class="src" id="src">Connecting to live rates…</p>
  </section>

  <section class="os" aria-labelledby="os-h">
    <h2 class="os-title" id="os-h">Simple. Streamlined. Escrow-Protected.</h2>
    <p class="os-lead">Submit an inquiry to execute high-volume OTC liquidations to INR and approved bank channels through SocialAssist’s human-assisted desk. Every exchange transaction is locked under strict milestone guarantees.</p>
    <dl>
      <div class="os-row"><dt class="os-k">Supported Assets</dt><dd class="os-v">USDT (TRC20/ERC20), BTC, ETH, BNB, SOL, XRP, DOGE, TRX, LTC, GRAM</dd></div>
      <div class="os-row"><dt class="os-k">Settlement Medium</dt><dd class="os-v">Instant IMPS / RTGS / Direct Bank Wire</dd></div>
      <div class="os-row"><dt class="os-k">Escrow Protocol</dt><dd class="os-v">Verified intermediary lock before release</dd></div>
      <div class="os-row"><dt class="os-k">Execution Time</dt><dd class="os-v">Average 15–30 minutes post-confirmation</dd></div>
    </dl>
    <p class="os-note">Regulatory Notice: Exchange rates, liquidity availability, and supported rails fluctuate with market conditions. SocialAssist operates an inquiry-based, human-verified matching process with strict AML screening.</p>
    <a class="os-cta" href="https://t.me/socialassist" target="_blank" rel="noopener noreferrer">Connect with OTC Desk <span aria-hidden="true">→</span></a>
  </section>
</div>`;

      function init(root: ShadowRoot) {
        const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
        const ETH =
          '<svg viewBox="0 0 24 24"><path d="M12 1.5 5.2 12.3 12 16.3l6.8-4L12 1.5Zm0 16.8-6.8-4L12 22.5l6.8-8.2-6.8 4Z"/></svg>';
        const BNB =
          '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.6 2.6L12 7.7 9.4 5.1ZM5.1 9.4 7.7 12l-2.6 2.6L2.5 12ZM18.9 9.4l2.6 2.6-2.6 2.6-2.6-2.6ZM12 16.3l2.6 2.6L12 21.5l-2.6-2.6ZM12 9.4l2.6 2.6-2.6 2.6L9.4 12Z"/></svg>';
        const SOL =
          '<svg viewBox="0 0 24 24"><path d="M6 5.5h14l-2.5 3.5H3.5ZM3.5 10.2h14L20 13.7H6ZM6 15h14l-2.5 3.5H3.5Z"/></svg>';
        const COINS = [
          { s: "USDT", d: 2, def: "1000", name: "Tether USD", g: "₹" },
          { s: "BTC", d: 6, def: "0.01", name: "Bitcoin", g: "₿" },
          { s: "ETH", d: 5, def: "0.5", name: "Ethereum", g: ETH },
          { s: "BNB", d: 4, def: "2", name: "BNB Chain", g: BNB },
          { s: "SOL", d: 4, def: "10", name: "Solana", g: SOL },
          { s: "XRP", d: 3, def: "500", name: "Ripple", g: "✕" },
          { s: "DOGE", d: 2, def: "5000", name: "Dogecoin", g: "Ð" },
          { s: "TRX", d: 2, def: "3000", name: "Tron", g: "T" },
          { s: "LTC", d: 4, def: "5", name: "Litecoin", g: "Ł" },
          { s: "GRAM", d: 3, def: "500", name: "Gram", g: "G" },
        ];

        // USD prices (USDT quote): fallback values, replaced by live Binance prices when reachable.
        const usd: Record<string, number> = {
          USDT: 1,
          BTC: 64420,
          ETH: 1805,
          BNB: 590,
          SOL: 74.5,
          XRP: 0.974,
          DOGE: 0.0593,
          TRX: 0.33,
          LTC: 44.38,
          GRAM: 1.05,
        };
        const INR_PER_USDT = 96; // desk rate (INR per 1 USDT)
        const FEE = 0.02; // 2% crypto-to-crypto fee
        let mode: "inr" | "swap" = "inr";
        let from = "USDT";
        let to = "BTC";
        const $ = (id: string) => root.getElementById(id);
        const amt = $("amt") as HTMLInputElement;
        const out = $("out") as HTMLElement;

        function coin(s: string) {
          return COINS.filter((c) => c.s === s)[0] || COINS[0];
        }
        function nf(v: number, d: number, loc?: string) {
          return v.toLocaleString(loc || "en-US", {
            minimumFractionDigits: d,
            maximumFractionDigits: d,
          });
        }

        let disp = 0;
        let target = 0;
        let dec = 0;
        let pre = "₹ ";
        let loc = "en-IN";
        let raf = 0;
        let last = 0;

        function paint() {
          if (out) out.textContent = pre + nf(disp, dec, loc);
        }

        function setTarget(v: number, d: number, p: string, l: string) {
          const changed = d !== dec || p !== pre;
          target = v;
          dec = d;
          pre = p;
          loc = l;
          if (changed) disp = 0;
          if (reduce) {
            disp = v;
            paint();
            return;
          }
          if (!raf) {
            last = performance.now();
            raf = requestAnimationFrame(tick);
          }
        }

        function tick(t: number) {
          const dt = Math.min(0.05, (t - last) / 1000);
          last = t;
          disp += (target - disp) * (1 - Math.exp(-dt / 0.13));
          if (Math.abs(target - disp) < Math.pow(10, -dec) / 2) {
            disp = target;
            raf = 0;
            paint();
            return;
          }
          paint();
          raf = requestAnimationFrame(tick);
        }

        function calc() {
          const v = parseFloat(amt?.value || "0") || 0;
          const rateEl = $("rate");
          if (mode === "inr") {
            const r = (usd[from] ?? 1) * INR_PER_USDT;
            setTarget(v * r, 0, "₹ ", "en-IN");
            if (rateEl) rateEl.textContent = "1 " + from + " = ₹" + nf(r, 2, "en-IN");
          } else {
            const x = (usd[from] ?? 1) / (usd[to] ?? 1);
            setTarget(v * x * (1 - FEE), coin(to).d, "", "en-US");
            if (rateEl) {
              rateEl.textContent =
                "1 " +
                from +
                " = " +
                Number(x.toPrecision(6)).toLocaleString("en-US", {
                  maximumFractionDigits: 8,
                }) +
                " " +
                to;
            }
          }
        }

        function tiles() {
          const box = $("fromBox");
          if (!box) return;
          box.innerHTML = "";
          COINS.forEach((c) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "coin";
            b.setAttribute("role", "radio");
            b.setAttribute("aria-checked", c.s === from ? "true" : "false");
            const g = c.s === "USDT" && mode === "swap" ? "₮" : c.g;
            b.innerHTML =
              '<span class="g" aria-hidden="true">' +
              g +
              '</span><span class="t">' +
              c.s +
              "</span>";
            b.onclick = () => {
              pickFrom(c.s);
            };
            box.appendChild(b);
          });
        }

        // ══════════════════════════════════════════════════════════════════════
        // CUSTOM DROPDOWN ENGINE: Render dark glass menu items & control open/close
        // ══════════════════════════════════════════════════════════════════════
        function closeAllDd() {
          closeDd("from");
          closeDd("to");
        }

        function closeDd(which: "from" | "to") {
          const menu = $(which + "Menu");
          const trig = $(which + "Trigger");
          if (menu) menu.hidden = true;
          if (trig) trig.setAttribute("aria-expanded", "false");
        }

        function openDd(which: "from" | "to") {
          closeDd(which === "from" ? "to" : "from");
          const menu = $(which + "Menu");
          const trig = $(which + "Trigger");
          if (!menu || !trig) return;

          const currentVal = which === "from" ? from : to;
          menu.innerHTML = "";

          COINS.forEach((c) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "dd-item";
            item.setAttribute("role", "option");
            const isSel = c.s === currentVal;
            item.setAttribute("aria-selected", isSel ? "true" : "false");

            const glyph = c.s === "USDT" && mode === "swap" ? "₮" : c.g;
            item.innerHTML =
              '<div class="dd-item-left">' +
                '<span class="dd-item-glyph" aria-hidden="true">' + glyph + "</span>" +
                "<div>" +
                  '<div class="dd-item-name">' + c.s + "</div>" +
                  '<div class="dd-item-sub">' + c.name + "</div>" +
                "</div>" +
              "</div>" +
              '<svg class="dd-check" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6l3 3 5-5"/></svg>';

            item.onclick = (e) => {
              e.stopPropagation();
              if (which === "from") {
                pickFrom(c.s);
              } else {
                pickTo(c.s);
              }
              closeDd(which);
            };
            menu.appendChild(item);
          });

          menu.hidden = false;
          trig.setAttribute("aria-expanded", "true");
        }

        function toggleDd(which: "from" | "to", e: MouseEvent) {
          e.stopPropagation();
          const trig = $(which + "Trigger");
          const isOpen = trig?.getAttribute("aria-expanded") === "true";
          if (isOpen) {
            closeDd(which);
          } else {
            openDd(which);
          }
        }

        // Attach dropdown trigger events
        const fromTrig = $("fromTrigger");
        if (fromTrig) {
          fromTrig.onclick = (e) => toggleDd("from", e);
        }
        const toTrig = $("toTrigger");
        if (toTrig) {
          toTrig.onclick = (e) => toggleDd("to", e);
        }

        // Click outside closes both dropdowns
        const onRootClick = (e: Event) => {
          const path = e.composedPath ? e.composedPath() : [];
          const inFrom = path.some((el) => el === $("fromDdWrap"));
          const inTo = path.some((el) => el === $("toDdWrap"));
          if (!inFrom) closeDd("from");
          if (!inTo) closeDd("to");
        };
        root.addEventListener("click", onRootClick);

        const onDocClick = () => {
          closeAllDd();
        };
        window.addEventListener("click", onDocClick);

        function pickFrom(s: string) {
          const old = from;
          from = s;
          if (mode === "swap" && to === s) to = old;
          if (amt) amt.value = coin(s).def;
          closeAllDd();
          build();
        }

        function pickTo(s: string) {
          const oldTo = to;
          to = s;
          if (from === to) {
            from = oldTo;
            if (amt) amt.value = coin(from).def;
          }
          closeAllDd();
          build();
        }

        function build() {
          const swap = mode === "swap";
          $("mInr")?.setAttribute("aria-checked", !swap ? "true" : "false");
          $("mSwap")?.setAttribute("aria-checked", swap ? "true" : "false");
          const l1 = $("l1");
          if (l1) l1.textContent = swap ? "You send:" : "Select Currency:";
          const outLbl = $("outLbl");
          if (outLbl) {
            outLbl.textContent = swap
              ? "You Receive (after 2% fee):"
              : "Estimated Bank Credit (INR):";
          }

          const outU = $("outU");
          if (outU) outU.hidden = swap;
          const toDdWrap = $("toDdWrap");
          if (toDdWrap) toDdWrap.hidden = !swap;
          const flip = $("flip");
          if (flip) flip.hidden = !swap;

          // Update trigger texts
          const fromTrigText = $("fromTriggerText");
          if (fromTrigText) fromTrigText.textContent = from;
          const toTrigText = $("toTriggerText");
          if (toTrigText) toTrigText.textContent = to;

          const rateL = $("rateL");
          if (rateL && rateL.firstChild) {
            rateL.firstChild.textContent = swap ? "Binance rate: " : "Indicative: ";
          }
          const rateR = $("rateR");
          if (rateR) rateR.textContent = swap ? "2% swap fee" : "0% Slippage";
          const ctaT = $("ctaT");
          if (ctaT) {
            ctaT.textContent = swap
              ? "Lock Swap on Telegram Escrow"
              : "Lock Rate on Telegram Escrow";
          }
          tiles();
          calc();
        }

        const mInr = $("mInr");
        if (mInr) {
          mInr.onclick = () => {
            mode = "inr";
            closeAllDd();
            build();
          };
        }

        const mSwap = $("mSwap");
        if (mSwap) {
          mSwap.onclick = () => {
            mode = "swap";
            if (to === from) to = from === "BTC" ? "ETH" : "BTC";
            closeAllDd();
            build();
          };
        }

        const flipBtn = $("flip");
        if (flipBtn) {
          flipBtn.onclick = () => {
            const t = from;
            from = to;
            to = t;
            if (amt) amt.value = coin(from).def;
            closeAllDd();
            build();
          };
        }

        if (amt) {
          amt.addEventListener("input", () => {
            let s = amt.value.replace(/[^0-9.]/g, "");
            const i = s.indexOf(".");
            if (i > -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");
            amt.value = s.slice(0, 14);
            calc();
          });
        }

        const ctaBtn = root.querySelector(".cta") as HTMLButtonElement | null;
        if (ctaBtn) {
          ctaBtn.onclick = () => {
            const contactEl = document.getElementById("contact");
            if (contactEl) {
              contactEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.open("https://t.me/socialassist", "_blank");
            }
          };
        }

        // Live prices: /api/rates & Netlify first, then Binance directly, then Binance Vision.
        const SOURCES = [
          "/api/rates",
          "/.netlify/functions/rates",
          "https://api.binance.com/api/v3/ticker/price",
          "https://data-api.binance.vision/api/v3/ticker/price",
        ];
        let srcIdx = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        function status(on: boolean) {
          const dot = $("dot");
          if (dot) dot.className = on ? "on" : "";
          const src = $("src");
          if (src) {
            src.textContent = on
              ? "Crypto prices streaming live from Binance spot markets."
              : "Showing recent market prices. Live feed is currently unavailable.";
          }
        }

        function get(url: string) {
          const ctl = new AbortController();
          const t = setTimeout(() => {
            ctl.abort();
          }, 5000);
          return fetch(url, { signal: ctl.signal, cache: "no-store" })
            .then((r) => {
              if (!r.ok) throw 0;
              return r.json();
            })
            .then(
              (a) => {
                clearTimeout(t);
                return a;
              },
              (e) => {
                clearTimeout(t);
                throw e;
              }
            );
        }

        function apply(a: Array<{ symbol?: string; price?: string }>) {
          let n = 0;
          if (!Array.isArray(a)) return 0;
          a.forEach((x) => {
            if (!x || !x.symbol || x.symbol.slice(-4) !== "USDT") return;
            const s = x.symbol.slice(0, -4);
            const p = parseFloat(x.price || "0");
            if (s !== "USDT" && usd[s] !== undefined && p > 0) {
              usd[s] = p;
              n++;
            }
          });
          return n;
        }

        function live() {
          let tries = 0;
          (function next() {
            if (tries >= SOURCES.length) {
              status(false);
              timer = setTimeout(live, 20000);
              return;
            }
            const i = (srcIdx + tries++) % SOURCES.length;
            get(SOURCES[i])
              .then((a) => {
                if (!apply(a)) throw 0;
                srcIdx = i;
                status(true);
                calc();
                timer = setTimeout(live, 5000);
              })
              .catch(next);
          })();
        }

        build();
        disp = target;
        paint();
        live();

        return () => {
          if (timer) clearTimeout(timer);
          if (raf) cancelAnimationFrame(raf);
          root.removeEventListener("click", onRootClick);
          window.removeEventListener("click", onDocClick);
        };
      }

      class OtcSection extends HTMLElement {
        private _root: ShadowRoot | null = null;
        private _stop: (() => void) | null = null;

        connectedCallback() {
          if (!this._root) {
            this._root = this.attachShadow({ mode: "open" });
          }
          this._root.innerHTML = TEMPLATE;
          if (this._stop) {
            this._stop();
            this._stop = null;
          }
          this._stop = init(this._root);
        }

        disconnectedCallback() {
          if (this._stop) {
            this._stop();
            this._stop = null;
          }
        }
      }

      customElements.define("otc-section", OtcSection);
    }

    if (containerRef.current && !containerRef.current.querySelector("otc-section")) {
      const el = document.createElement("otc-section");
      containerRef.current.appendChild(el);
    }
  }, []);

  return (
    <section
      id="exchange"
      ref={containerRef}
      className="w-full relative z-10 max-w-full"
      style={{ display: "block", boxSizing: "border-box", width: "100%", background: "transparent" }}
    />
  );
}
