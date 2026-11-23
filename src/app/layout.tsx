import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SERVICES_SHOWCASE_SCRIPT } from "@/components/sections/services-showcase-script";
import { VERIFICATION_SCRIPT } from "@/components/sections/verification-script";
import { RESTORATION_SCRIPT } from "@/components/sections/restoration-script";
import { PLATFORM_RADAR_SCRIPT } from "@/components/sections/platform-radar-script";
import { TELEGRAM_DESK_SCRIPT } from "@/components/sections/telegram-desk-script";

const LOADER_LOGO_B64 = "data:image/png;base64,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";

const SOCIALASSIST_INTRO_SCRIPT = `
(function(){
  var LOGO = "${LOADER_LOGO_B64}";
  [].forEach.call(document.querySelectorAll("#pre [data-logo]"), function(i){ i.src = LOGO; });

  var MIN_MS = 3900; // how long the progress ring takes (minimum)
  var CIRC = 314.16;
  var $ = function(id){ return document.getElementById(id); };
  var pre = $("pre"), ring = $("pring"), pct = $("pct"), pulse = $("pulse"), body = document.body;
  if (!pre || !ring || !pct) return;
  var words = [].slice.call(pre.querySelectorAll(".w"));
  /* split each phrase into words so they glide in one after another */
  words.forEach(function(w){
    var t = w.textContent.trim().split(/\\s+/);
    w.textContent = "";
    t.forEach(function(s, k){
      var o = document.createElement("span");
      o.className = "wi";
      o.style.setProperty("--k", k);
      o.textContent = s;
      w.appendChild(o);
      if (k < t.length - 1) w.appendChild(document.createTextNode(" "));
    });
  });
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var loaded = document.readyState === "complete", raf, timers = [], shown = 0;
  addEventListener("load", function(){ loaded = true; });
  function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
  function inOut(t){ return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* Which theme is the site in? */
  function theme(){
    var f = window.SA_THEME;
    if (f === "light" || f === "dark") return f;
    var de = document.documentElement, b = document.body;
    var a = ((de.getAttribute("data-theme") || b.getAttribute("data-theme") || de.getAttribute("data-bs-theme") || "") + "").toLowerCase();
    if (a.indexOf("light") > -1) return "light";
    if (a.indexOf("dark") > -1) return "dark";
    var c = (" " + de.className + " " + b.className + " ").toLowerCase();
    if (/[\\s-](light|light-mode|theme-light)[\\s]/.test(c) || / light /.test(c)) return "light";
    if (/[\\s-](dark|dark-mode|theme-dark)[\\s]/.test(c) || / dark /.test(c)) return "dark";
    try {
      var s = localStorage.getItem("theme") || localStorage.getItem("color-theme") || localStorage.getItem("sa-theme");
      if (s === "light" || s === "dark") return s;
    } catch(e){}
    return matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark";
  }

  /* soft pointer / idle parallax */
  var tx = 0, ty = 0, cx = 0, cy = 0, lastMove = -1e9, parOn = false;
  addEventListener("pointermove", function(e){
    tx = e.clientX / innerWidth * 2 - 1;
    ty = e.clientY / innerHeight * 2 - 1;
    lastMove = performance.now();
  }, { passive: true });

  function par(now){
    if (pre.classList.contains("gone")){ parOn = false; return; }
    if (now - lastMove > 2200){ tx = Math.sin(now / 2600) * .45; ty = Math.cos(now / 3300) * .3; }
    cx += (tx - cx) * .05;
    cy += (ty - cy) * .05;
    pre.style.setProperty("--px", cx.toFixed(3));
    pre.style.setProperty("--py", cy.toFixed(3));
    requestAnimationFrame(par);
  }
  function startPar(){ if (reduce || parOn) return; parOn = true; requestAnimationFrame(par); }

  function beat(){ if (!pulse) return; pulse.classList.remove("beat"); void pulse.offsetWidth; pulse.classList.add("beat"); }
  function phrase(i){
    words.forEach(function(w, j){
      w.classList.toggle("on", j === i);
      w.classList.toggle("off", j < i);
    });
    if (!reduce) beat();
  }

  function run(){
    timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf);
    pre.setAttribute("data-theme", theme());
    pre.className = ""; void pre.offsetWidth;
    words.forEach(function(w){ w.classList.remove("on", "off"); });
    ring.style.strokeDashoffset = CIRC; pct.textContent = "0"; shown = 0;
    body.classList.add("lock"); body.classList.remove("ready");
    var lockInterval = setInterval(function(){
      if (!pre.classList.contains("gone") && !pre.classList.contains("out")) {
        if (!body.classList.contains("lock")) body.classList.add("lock");
      } else {
        clearInterval(lockInterval);
      }
    }, 50);
    pre.classList.add("in"); startPar();
    later(function(){ pre.classList.add("show"); }, reduce ? 0 : 450);
    if (reduce){ phrase(2); } else {
      later(function(){ phrase(0); }, 1300);
      later(function(){ phrase(1); }, 2350);
      later(function(){ phrase(2); }, 3400);
    }
    var t0 = performance.now() + (reduce ? 0 : 350);
    (function tick(now){
      var t = Math.max(0, Math.min(1, (now - t0) / (reduce ? 600 : MIN_MS))), target = inOut(t);
      if (!loaded) target = Math.min(target, .92);
      shown += (target - shown) * .1;
      if (target >= 1 && shown > .995) shown = 1;
      ring.style.strokeDashoffset = (CIRC * (1 - shown)).toFixed(2);
      pct.textContent = Math.round(shown * 100);
      if (shown >= 1){ pre.classList.add("done"); later(exit, reduce ? 200 : 900); return; }
      raf = requestAnimationFrame(tick);
    })(performance.now());
  }
  function exit(){
    pre.classList.add("out");
    /* the page starts appearing while the light is still expanding, so the two overlap and merge */
    later(function(){ body.classList.add("ready"); document.dispatchEvent(new Event("socialassist:ready")); }, reduce ? 0 : 650);
    later(function(){ pre.classList.add("reveal"); }, reduce ? 0 : 600);
    later(function(){ pre.classList.add("gone"); body.classList.remove("lock"); }, reduce ? 400 : 2300);
  }
  run();
})();
`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://socialassist.network"),
  title: "SocialAssist — We Resolve. We Protect. We Elevate.",
  description:
    "SocialAssist is a premium digital services network providing social media account assistance, verification support, brand protection, crypto exchange, and automated advertising. Est. 2021.",
  keywords: [
    "social media assistance",
    "account assistance",
    "social media verification",
    "brand protection",
    "crypto exchange",
    "automated advertising",
    "digital services",
    "Instagram assistance",
    "Facebook support",
    "account recovery",
    "social media management",
    "SocialAssist",
  ],
  authors: [{ name: "SocialAssist", url: "https://socialassist.network" }],
  openGraph: {
    title: "SocialAssist — We Resolve. We Protect. We Elevate.",
    description:
      "Premium social media assistance, verification support, brand protection, crypto exchange, and automated advertising — connected through one network.",
    siteName: "SocialAssist",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "SocialAssist — Digital Assistance Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialAssist — We Resolve. We Protect. We Elevate.",
    description:
      "Premium social media assistance network. Account recovery, verification, brand protection, crypto exchange & automated advertising.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://socialassist.network",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${spaceGrotesk.variable} light`}
      style={{ scrollBehavior: "smooth" }}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FAFAFC" />
        {/* Obsidian Dark Theme Stylesheet */}
        <link rel="stylesheet" href="/theme-dark.css" />
        {/* Zero-Flash Theme Initialization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var saved = localStorage.getItem('socialassist-theme') || localStorage.getItem('theme');
                if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch(e) {}
            })();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SocialAssist",
              foundingDate: "2021",
              description:
                "Premium digital services network providing social media assistance, verification, brand protection, crypto exchange, and automated advertising.",
              founder: { "@type": "Person", name: "Gixxu" },
              serviceType: [
                "Account Assistance",
                "Verification Support",
                "Brand Protection",
                "Crypto Exchange",
                "Automated Advertising",
              ],
            }),
          }}
        />
        {/* Google Translate Integration for Real-Time Multi-Language Support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,zh-CN,zh-TW,ja,es,fr,pt,ko,ru,tr,id,de,fa',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
        <script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden transition-colors duration-300" suppressHydrationWarning>
        {/* SocialAssist Smooth Opening Intro Loader */}
        <div id="pre" aria-label="Loading Social Assist" role="status">
          <div className="aurora" aria-hidden="true"><div className="pulse" id="pulse"><i className="a1"></i><i className="a2"></i></div></div>
          <div className="stage">
            <div className="mark">
              <svg viewBox="0 0 112 112" aria-hidden="true"><defs><linearGradient id="preg" x1="0" y1="0" x2="1" y2="1"><stop offset="0"/><stop offset=".55"/><stop offset="1"/></linearGradient></defs><circle className="tr" cx="56" cy="56" r="50"/><circle className="pr" id="pring" cx="56" cy="56" r="50"/></svg>
              <div className="disc"><img data-logo alt="" width={38} height={38} src={LOADER_LOGO_B64} /></div>
            </div>
            <div className="name" aria-label="Social Assist"><span>SOCIALASSIST</span></div>
            <div className="words" aria-hidden="true">
              <div className="w">We Resolve.</div>
              <div className="w g1">We Protect.</div>
              <div className="w g2">We Elevate.</div>
            </div>
          </div>
          <div className="pct" id="pct">0</div>
        </div>

        <div id="google_translate_element" style={{ display: "none" }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: SOCIALASSIST_INTRO_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: SERVICES_SHOWCASE_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: VERIFICATION_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: RESTORATION_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: PLATFORM_RADAR_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: TELEGRAM_DESK_SCRIPT,
          }}
        />
        {/* Telegram-style Circular Reveal Theme Switch Engine */}
        <script src="/theme-switch.js" defer></script>
      </body>
    </html>
  );
}
