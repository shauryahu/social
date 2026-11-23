"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface NavItem {
  name: string;
  href: string;
  key: string;
  fx: string;
  path: string;
}

export const ITEMS: NavItem[] = [
  {
    name: "Home",
    href: "#home",
    key: "home",
    fx: "hop",
    path: '<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M6 9.6V20h12V9.6"/>',
  },
  {
    name: "Services",
    href: "#services",
    key: "globe",
    fx: "spin",
    path: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17"/>',
  },
  {
    name: "Platforms",
    href: "#platforms",
    key: "grid",
    fx: "pop",
    path: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  },
  {
    name: "Exchange",
    href: "#exchange",
    key: "swap",
    fx: "swap",
    path: '<path d="M5 8h13l-3-3M19 16H6l3 3"/>',
  },
  {
    name: "Automation",
    href: "#automation",
    key: "bolt",
    fx: "zap",
    path: '<path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z"/>',
  },
  {
    name: "About",
    href: "#about",
    key: "user",
    fx: "wave",
    path: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5"/>',
  },
  {
    name: "Inquiry",
    href: "#contact",
    key: "mail",
    fx: "pop",
    path: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  },
];

export default function Navbar() {
  const [active, setActive] = useState(0);
  const [fx, setFx] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const activeRef = useRef(0);
  const isMobileRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const vdRef = useRef<HTMLSpanElement>(null);

  const desktopItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const pLRef = useRef<number | null>(null);
  const pWRef = useRef<number>(0);
  const pTRef = useRef<number | null>(null);

  const placeH = useCallback((go: boolean) => {
    const ind = indRef.current;
    const b = desktopItemsRef.current[activeRef.current];
    if (!ind || !b) return;

    const L = b.offsetLeft;
    const W = b.offsetWidth;
    ind.style.left = `${L}px`;
    ind.style.width = `${W}px`;

    const pL = pLRef.current;
    const pW = pWRef.current;

    if (go && pL !== null && pL !== L) {
      const lo = Math.min(pL, L);
      const hi = Math.max(pL, L + W);
      ind.animate(
        [
          { left: `${pL}px`, width: `${pW}px` },
          {
            left: `${lo}px`,
            width: `${hi - lo}px`,
            offset: 0.42,
            easing: "cubic-bezier(.3, 1.4, .5, 1)",
          },
          { left: `${L}px`, width: `${W}px` },
        ],
        { duration: 640, easing: "cubic-bezier(.4, 0, .2, 1)" }
      );
    }
    pLRef.current = L;
    pWRef.current = W;
  }, []);

  const placeV = useCallback((go: boolean) => {
    const vd = vdRef.current;
    const b = mobileItemsRef.current[activeRef.current];
    if (!vd || !b) return;

    const T = b.offsetTop;
    const H = b.offsetHeight;
    vd.style.top = `${T}px`;
    vd.style.height = `${H}px`;

    const pT = pTRef.current;

    if (go && pT !== null && pT !== T) {
      vd.animate(
        [
          { top: `${pT}px`, height: `${H}px` },
          {
            top: `${Math.min(pT, T)}px`,
            height: `${Math.abs(T - pT) + H}px`,
            offset: 0.45,
            easing: "cubic-bezier(.3, 1.4, .5, 1)",
          },
          { top: `${T}px`, height: `${H}px` },
        ],
        { duration: 640, easing: "cubic-bezier(.4, 0, .2, 1)" }
      );
    }
    pTRef.current = T;
  }, []);

  const place = useCallback(
    (go: boolean) => {
      if (isMobileRef.current) {
        placeV(go);
      } else {
        placeH(go);
      }
    },
    [placeH, placeV]
  );

  const createRipple = (host: HTMLElement | null, e: React.PointerEvent) => {
    if (!host) return;
    const r = host.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "rip";
    s.style.left = `${e.clientX - r.left}px`;
    s.style.top = `${e.clientY - r.top}px`;
    const rp = host.querySelector(".rp");
    if (rp) {
      rp.appendChild(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
    }
  };

  const handlePick = (i: number, href: string, e: React.MouseEvent) => {
    setActive(i);
    activeRef.current = i;
    setFx(i);

    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const target =
        document.getElementById(id) ||
        (id === "inquiry" ? document.getElementById("contact") : null);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        try {
          history.pushState(null, "", href);
        } catch { }
      }
    }

    place(true);

    if (isMobileRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 750);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
      try {
        history.pushState(null, "", "#contact");
      } catch { }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const homeEl = document.getElementById("home");
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: "smooth" });
      try {
        history.pushState(null, "", "#home");
      } catch { }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Keep indicator in sync with active item changes
  useEffect(() => {
    place(true);
  }, [active, place]);

  // Handle breakpoint changes, window resize, and font loading
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      isMobileRef.current = e.matches;
      pLRef.current = null;
      pTRef.current = null;
      setIsOpen(false);
      setTimeout(() => place(false), 50);
    };
    mql.addEventListener("change", onMediaChange);
    isMobileRef.current = mql.matches;

    const onResize = () => {
      place(false);
    };
    window.addEventListener("resize", onResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => place(false));
    }

    requestAnimationFrame(() => place(false));

    return () => {
      mql.removeEventListener("change", onMediaChange);
      window.removeEventListener("resize", onResize);
    };
  }, [place]);

  // Scroll spy to update active item based on viewport position
  useEffect(() => {
    let ticking = false;
    const sectionIds = ITEMS.map((item) => item.href.replace(/^#/, ""));

    const updateScrollSpy = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 90;
      if (isAtBottom) {
        setActive(ITEMS.length - 1);
        activeRef.current = ITEMS.length - 1;
        ticking = false;
        return;
      }

      let currentIndex = 0;
      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i];
        const el =
          document.getElementById(id) ||
          (id === "inquiry" ? document.getElementById("contact") : null);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260) {
            currentIndex = i;
          }
        }
      }

      if (activeRef.current !== currentIndex) {
        setActive(currentIndex);
        activeRef.current = currentIndex;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollSpy);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    if (window.location.hash) {
      const hash = window.location.hash;
      const matchIndex = ITEMS.findIndex((item) => item.href === hash);
      if (matchIndex !== -1) {
        setActive(matchIndex);
        activeRef.current = matchIndex;
        setTimeout(() => place(false), 100);
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [place]);

  // Outside click ignores both .bar and .panel; Escape closes mobile menu
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (
        isOpen &&
        !target?.closest(".sa-nav .bar, .sa-nav .panel")
      ) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sa-nav" role="banner">
      {/* ── Desktop & Mobile Top Bar ── */}
      <div ref={barRef} className="bar">
        {/* Brand Logo Circle (48px badge, 32px image) */}
        <a
          className="logo"
          href="#home"
          aria-label="SocialAssist Home"
          onClick={handleLogoClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="SocialAssist"
            src="/images/socialassist-logo.png"
            width={32}
            height={32}
          />
        </a>

        {/* Desktop Navigation Pill */}
        <nav
          ref={pillRef}
          className="pill desk"
          id="pill"
          aria-label="Main navigation"
          onPointerDown={(e) => createRipple(pillRef.current, e)}
        >
          <span ref={indRef} className="ind" id="ind"></span>
          {ITEMS.map((item, i) => (
            <a
              key={item.name}
              ref={(el) => {
                desktopItemsRef.current[i] = el;
              }}
              href={item.href}
              className="it"
              aria-current={active === i ? "page" : undefined}
              onClick={(e) => handlePick(i, item.href, e)}
            >
              <span
                className="nv-ico"
                data-fx={fx === i ? item.fx : undefined}
                onAnimationEnd={() => setFx(-1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: item.path }}
                />
              </span>
              <span className="lbl">{item.name}</span>
            </a>
          ))}
          <span className="rp"></span>
        </nav>

        {/* Right Actions: Contact CTA & Mobile Burger */}
        <div className="right">
          <a className="cta" href="#contact" onClick={handleContactClick}>
            Contact
          </a>
          <button
            type="button"
            className="burger mob"
            id="bg"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <i></i>
            <i></i>
            <i></i>
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Panel (Sibling outside .bar to allow true backdrop blur) ── */}
      <div
        ref={panelRef}
        className="panel mob"
        id="panel"
        data-open={isOpen ? "true" : "false"}
        onPointerDown={(e) => createRipple(panelRef.current, e)}
      >
        <nav ref={listRef} className="list" id="list">
          <span ref={vdRef} className="vd" id="vd"></span>
          {ITEMS.map((item, i) => (
            <a
              key={item.name}
              ref={(el) => {
                mobileItemsRef.current[i] = el;
              }}
              href={item.href}
              className="row"
              style={{ "--i": i } as React.CSSProperties}
              aria-current={active === i ? "page" : undefined}
              onClick={(e) => handlePick(i, item.href, e)}
            >
              <span
                className="nv-ico"
                data-fx={fx === i ? item.fx : undefined}
                onAnimationEnd={() => setFx(-1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: item.path }}
                />
              </span>
              <span className="lbl">{item.name}</span>
            </a>
          ))}
        </nav>
        <span className="rp"></span>
      </div>
    </header>
  );
}