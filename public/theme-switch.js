(function () {
  "use strict";

  var STORAGE_KEY = "socialassist-theme";

  function getCurrentTheme() {
    var dt = document.documentElement.getAttribute("data-theme");
    if (dt === "dark" || dt === "light") return dt;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }

  function isLowEndDevice() {
    if (typeof window === "undefined") return false;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }
    var nav = window.navigator || {};
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) {
      return true;
    }
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) {
      return true;
    }
    return false;
  }

  /* Comprehensive shadow DOM theme definitions for encapsulated custom elements */
  var SHADOW_STYLES = {
    "brand-defense": `
      .wrap { color: #fafafa !important; }
      h1 { color: #fafafa !important; }
      .tag { color: rgba(255,255,255,0.6) !important; }
      .tag i { background: #c4b5fd !important; box-shadow: 0 0 8px rgba(196,181,253,0.6) !important; }
      .lead { color: rgba(255,255,255,0.72) !important; }
      .cta { background: #ffffff !important; color: #000000 !important; font-weight: 600 !important; border: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 4px 16px rgba(255,255,255,0.14) !important; }
      .cta span { background: #000000 !important; color: #ffffff !important; }
      .cta:hover { background: #f4f4f5 !important; }
      .card, .list { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; }
      .row { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.10) !important; color: #fafafa !important; }
      .row .t { color: #fafafa !important; }
      .row .d { color: rgba(255,255,255,0.72) !important; }
      .row .ico { background: rgba(255,255,255,0.06) !important; color: #c4b5fd !important; }
      .row:hover, .row:focus-visible { background: rgba(255,255,255,0.08) !important; color: #ffffff !important; }
    `,

    "otc-section": `
      .sec, .wrap { color: #fafafa !important; }
      .eyebrow { color: rgba(255,255,255,0.6) !important; }
      h1 { color: #fafafa !important; }
      h1 .dim { background: linear-gradient(90deg, #ffffff 0%, #a1a1aa 60%, #c4b5fd 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }
      .sub { color: rgba(255,255,255,0.72) !important; }
      .card { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; }
      .seg button { color: rgba(255, 255, 255, 0.72) !important; }
      .seg button[aria-checked="true"] { background: #ffffff !important; color: #000000 !important; font-weight: 700 !important; }
      .coin { background: rgba(255, 255, 255, 0.06) !important; border: 1px solid rgba(255, 255, 255, 0.10) !important; color: rgba(255, 255, 255, 0.85) !important; }
      .coin .g, .coin .t { color: rgba(255, 255, 255, 0.85) !important; }
      .coin[aria-checked="true"] { background: #ffffff !important; border-color: #ffffff !important; color: #000000 !important; box-shadow: 0 6px 18px -4px rgba(255, 255, 255, 0.35) !important; }
      .coin[aria-checked="true"] .g, .coin[aria-checked="true"] .t { color: #000000 !important; }
      .cta { background: #ffffff !important; color: #000000 !important; font-weight: 700 !important; }
      .cta span, #ctaT { color: #000000 !important; }
      .os-title { color: #fafafa !important; }
      .os-lead { color: rgba(255,255,255,0.72) !important; }
      .os-row { border-bottom: 1px solid rgba(255,255,255,0.10) !important; }
      .os-k { color: rgba(255,255,255,0.60) !important; }
      .os-v { color: #fafafa !important; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important; }
      .os-note { color: rgba(255,255,255,0.55) !important; }
      .os-cta { background: #ffffff !important; color: #000000 !important; font-weight: 600 !important; border: 1px solid rgba(255,255,255,0.2) !important; }
      .os-cta:hover { background: #f4f4f5 !important; }
    `,

    "services-showcase": `
      .sec, .wrap, header { color: #fafafa !important; }
      .tag { color: rgba(255,255,255,0.6) !important; }
      .tag::before { background: #c4b5fd !important; box-shadow: 0 0 8px rgba(196,181,253,0.6) !important; }
      h2, h2 .w > span { color: #fafafa !important; }
      .grad { background: linear-gradient(90deg, #ffffff 0%, #e2e8f0 50%, #c4b5fd 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }
      .sub { color: rgba(255,255,255,0.72) !important; }
      .orbs .o1, .orbs .o2, .orbs .o3 { background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.05) 40%, transparent 70%) !important; }
      .tilt { box-shadow: 0 50px 90px -34px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.1) !important; }
      .bar { background: #151518 !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
      .bar .ttl { color: rgba(255,255,255,0.72) !important; }
      .screen { background: #0e0e10 !important; }
      .card, article.card {
        background: rgba(255, 255, 255, 0.045) !important;
        border: 1px solid rgba(255, 255, 255, 0.10) !important;
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        color: #fafafa !important;
      }
      article.card h3, .card h3 {
        color: #fafafa !important;
      }
      article.card p, .card p {
        color: rgba(255, 255, 255, 0.72) !important;
      }
      .card .ico {
        background: rgba(255, 255, 255, 0.08) !important;
        color: #c4b5fd !important;
      }
      .card .btn {
        color: #fafafa !important;
      }
      .card .btn span {
        color: #c4b5fd !important;
      }
    `,

    "platform-radar": `
      :host { overflow: visible !important; padding-bottom: 96px !important; }
      .wrap { overflow: visible !important; color: #fafafa !important; }
      .stagew { overflow: visible !important; }
      .stage { overflow: visible !important; }
      .tag { color: rgba(255,255,255,0.6) !important; }
      .tag i { background: #c4b5fd !important; box-shadow: 0 0 8px rgba(196,181,253,0.6) !important; }
      h2 { color: #fafafa !important; }
      .lead { color: rgba(255,255,255,0.72) !important; }
      .orbs .o1, .orbs .o2, .orbs .o3 { background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.05) 40%, rgba(139,92,246,0) 100%) !important; }
      .pill.glass { background: rgba(18,18,22,0.65) !important; border: 1px solid rgba(255,255,255,0.10) !important; color: #fafafa !important; }
      .pill b { color: #fafafa !important; }
      .pill span { color: rgba(255,255,255,0.72) !important; }
      .seam-fade { display: none !important; }
      .cnt { opacity: 1 !important; }
      .app { display: block !important; }
      .tile { display: block !important; }
      .tile img, .tile svg { display: block !important; width: 100% !important; height: 100% !important; border-radius: 22% !important; }
    `,

    "restoration-section": `
      .wrap { color: #fafafa !important; }
      .tag { color: rgba(255,255,255,0.6) !important; }
      .tag i { background: #c4b5fd !important; box-shadow: 0 0 8px rgba(196,181,253,0.6) !important; }
      h1 { color: #fafafa !important; }
      .lead { color: rgba(255,255,255,0.72) !important; }
      .note { color: rgba(255,255,255,0.55) !important; }
      .orbs .o1, .orbs .o2, .orbs .o3 { background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.05) 40%, transparent 70%) !important; }
      .glass.feat { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; color: #fafafa !important; }
      .feat i, .feat svg { color: #c4b5fd !important; stroke: #c4b5fd !important; }
      .card { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; color: #fafafa !important; }
      .card h2 { color: #fafafa !important; }
      .card .sub { color: rgba(255,255,255,0.72) !important; }
      .card .val, .card .num { color: #fafafa !important; }
      .cta { background: #ffffff !important; color: #000000 !important; font-weight: 600 !important; border: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 4px 16px rgba(255,255,255,0.14) !important; }
      .cta span { background: #000000 !important; color: #ffffff !important; }
      .cta:hover { background: #f4f4f5 !important; }
    `,

    "verification-section": `
      .wrap { color: #fafafa !important; }
      h1 { color: #fafafa !important; }
      .lead { color: rgba(255,255,255,0.72) !important; }
      .note { color: rgba(255,255,255,0.55) !important; }
      .orbs .o1, .orbs .o2, .orbs .o3 { background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.05) 40%, transparent 70%) !important; }
      .glass.feat { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; color: #fafafa !important; }
      .feat i, .feat svg { color: #c4b5fd !important; stroke: #c4b5fd !important; }
      .card { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; color: #fafafa !important; }
      .card h2 { color: #fafafa !important; }
      .card .sub { color: rgba(255,255,255,0.72) !important; }
      .tabs { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.10) !important; }
      .tab { color: rgba(255,255,255,0.72) !important; }
      .tab[aria-selected="true"] { color: #000000 !important; font-weight: 700 !important; }
      .tabs .ind { background: #ffffff !important; }
      .info dt { color: rgba(255,255,255,0.55) !important; }
      .info dd { color: #fafafa !important; }
      .plats span { color: rgba(255,255,255,0.72) !important; background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.10) !important; }
      .cta { background: #ffffff !important; color: #000000 !important; font-weight: 600 !important; border: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 4px 16px rgba(255,255,255,0.14) !important; }
      .cta span { background: #000000 !important; color: #ffffff !important; }
      .cta:hover { background: #f4f4f5 !important; }
    `,

    "telegram-desk": `
      :host { color: #fafafa !important; }
      .wrap { color: #fafafa !important; }
      .lead { color: rgba(255,255,255,0.72) !important; }
      .orb.o1, .orb.o2, .orb.o3 { background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.05) 40%, transparent 70%) !important; }
      .card { background: rgba(255,255,255,0.045) !important; border: 1px solid rgba(255,255,255,0.10) !important; box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; color: #fafafa !important; }
      .card::after { display: none !important; }
      .badge { background: rgba(196,181,253,0.12) !important; border: 1px solid rgba(196,181,253,0.25) !important; color: #c4b5fd !important; }
      .card h2 { color: #fafafa !important; }
      .card h2 em { background: linear-gradient(90deg, #ffffff 0%, #e2e8f0 50%, #c4b5fd 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }
      .card .desc { color: rgba(255,255,255,0.72) !important; }
      .pillx { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.10) !important; color: rgba(255,255,255,0.72) !important; }
      .lab { color: rgba(255,255,255,0.60) !important; }
      .lab b { color: #c4b5fd !important; }
      .lab .cnt { color: rgba(255,255,255,0.55) !important; }
      .inp { background: rgba(255,255,255,0.04) !important; border: 1px solid rgba(255,255,255,0.12) !important; color: #fafafa !important; }
      .inp input, .inp textarea { color: #fafafa !important; }
      .inp input::placeholder, .inp textarea::placeholder { color: rgba(255,255,255,0.55) !important; }
      .inp:focus-within { border-color: #c4b5fd !important; box-shadow: 0 0 0 3px rgba(196,181,253,0.25) !important; background: rgba(255,255,255,0.06) !important; }
      .chips .chip { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.10) !important; color: rgba(255,255,255,0.72) !important; }
      .chips .chip[aria-pressed=true] { background: rgba(196,181,253,0.18) !important; border-color: #c4b5fd !important; color: #fafafa !important; }
      .chips .chip svg { color: #c4b5fd !important; }
      .s2 { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.12) !important; box-shadow: inset 0 1px 2px rgba(0,0,0,0.4) !important; }
      .s2 .lbl { --b: rgba(255,255,255,0.55) !important; --h: #fafafa !important; }
      .explore { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.18) !important; color: #ffffff !important; }
      .explore svg { stroke: #ffffff !important; }
      .foot { color: rgba(255,255,255,0.55) !important; }
    `
  };

  function syncShadowRoots(theme) {
    try {
      Object.keys(SHADOW_STYLES).forEach(function (tag) {
        var els = document.querySelectorAll(tag);
        els.forEach(function (el) {
          if (!el.shadowRoot) return;
          var existing = el.shadowRoot.getElementById("sa-dark-shadow-theme");
          if (theme === "dark") {
            if (!existing) {
              var s = document.createElement("style");
              s.id = "sa-dark-shadow-theme";
              s.textContent = SHADOW_STYLES[tag];
              el.shadowRoot.appendChild(s);
            }
          } else {
            if (existing) {
              existing.remove();
            }
          }
        });
      });
    } catch (e) {}
  }

  function applyTheme(theme) {
    var de = document.documentElement;
    de.setAttribute("data-theme", theme);
    if (theme === "dark") {
      de.classList.remove("light");
      de.classList.add("dark");
    } else {
      de.classList.remove("dark");
      de.classList.add("light");
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.setItem("theme", theme);
    } catch (e) {}

    syncShadowRoots(theme);

    /* Notify React state / ThemeProvider / 3D Canvas */
    try {
      window.dispatchEvent(new Event("socialassist-theme-change"));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
  }

  var isSwitching = false;
  var activeTransition = null;

  function triggerCircularSwitch(targetTheme, x, y, activeBtn) {
    if (isSwitching) return;
    isSwitching = true;

    // Fallback for browsers without View Transitions or low-end / reduced motion
    if (!document.startViewTransition || isLowEndDevice()) {
      try {
        if (isLowEndDevice() && document.body && document.body.animate) {
          document.body.animate(
            [{ opacity: 0.7 }, { opacity: 1 }],
            { duration: 300, easing: "ease-out" }
          );
        }
        applyTheme(targetTheme);
      } catch (e) {
        console.warn("Theme switch fallback error:", e);
      } finally {
        isSwitching = false;
      }
      return;
    }

    /* Wave origin & radius to furthest viewport corner */
    var endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Prevent competing CSS transitions from racing the wave
    var de = document.documentElement;
    de.classList.add("theme-switching");
    de.style.setProperty("--wave-x", x + "px " + y + "px");

    // Ensure ONLY the active triggering button has view-transition-name: theme-toggle
    // and clear it from any other elements to strictly prevent duplicate view-transition-name
    var allToggles = document.querySelectorAll('button[data-slot="theme-toggle"], [style*="view-transition-name"]');
    allToggles.forEach(function (el) {
      if (el !== activeBtn) {
        el.style.viewTransitionName = "none";
      }
    });
    if (activeBtn) {
      activeBtn.style.viewTransitionName = "theme-toggle";
    }

    function cleanup() {
      de.classList.remove("theme-switching");
      de.style.removeProperty("--wave-x");
      if (activeBtn) {
        activeBtn.style.removeProperty("view-transition-name");
      }
      allToggles.forEach(function (el) {
        el.style.removeProperty("view-transition-name");
      });
      isSwitching = false;
      activeTransition = null;
    }

    try {
      // Synchronous DOM changes inside the callback
      activeTransition = document.startViewTransition(function () {
        applyTheme(targetTheme);
      });

      activeTransition.ready.then(function () {
        var animated = false;

        // Try soft feather wave mask animation using @property --wave-r
        try {
          if (window.CSS && CSS.registerProperty) {
            try {
              CSS.registerProperty({
                name: "--wave-r",
                syntax: "<length>",
                inherits: false,
                initialValue: "0px"
              });
            } catch (ignore) {}
          }

          var anim = de.animate(
            {
              "--wave-r": ["0px", (endRadius + 80) + "px"]
            },
            {
              duration: 700,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)"
            }
          );
          if (anim) animated = true;
        } catch (maskErr) {
          animated = false;
        }

        // Fallback to circular clip-path if mask is unsupported
        if (!animated) {
          de.animate(
            {
              clipPath: [
                "circle(0px at " + x + "px " + y + "px)",
                "circle(" + endRadius + "px at " + x + "px " + y + "px)"
              ]
            },
            {
              duration: 700,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)"
            }
          );
        }
      }).catch(function (err) {
        // Fallback safely if transition was aborted or snapshot failed
        applyTheme(targetTheme);
        cleanup();
      });

      activeTransition.finished.then(function () {
        cleanup();
      }).catch(function (err) {
        applyTheme(targetTheme);
        cleanup();
      });

    } catch (err) {
      applyTheme(targetTheme);
      cleanup();
    }
  }

  function wireToggle() {
    if (isLowEndDevice()) {
      document.documentElement.classList.add("low-end");
    }

    /* Intercept clicks on the existing theme toggle button */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest('button[data-slot="theme-toggle"]');
      if (!btn) return;

      // Handle rapid repeated clicks safely: block subsequent clicks while a transition is running
      if (isSwitching) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      var current = getCurrentTheme();
      var next = current === "dark" ? "light" : "dark";

      var rect = btn.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;

      triggerCircularSwitch(next, x, y, btn);
    }, true);

    /* Initial shadow DOM sync */
    var initialTheme = getCurrentTheme();
    syncShadowRoots(initialTheme);

    /* Continuous observer to sync newly mounted custom elements (e.g. on client navigation / hydration) */
    if (typeof MutationObserver !== "undefined") {
      var observer = new MutationObserver(function () {
        syncShadowRoots(getCurrentTheme());
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireToggle);
  } else {
    wireToggle();
  }
})();
