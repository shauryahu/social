"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh-CN", label: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", label: "繁體中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
];

function applySiteLanguage(code: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("preferred_language", code);
    document.documentElement.lang = code;
  } catch {}

  const gtCode = code === "pt-BR" ? "pt" : code;
  const hostname = window.location.hostname;

  if (code === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;
  } else {
    const val = `/en/${gtCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; domain=.${hostname}; path=/;`;
  }

  const selectEl = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (selectEl) {
    selectEl.value = gtCode;
    selectEl.dispatchEvent(new Event("change"));
  } else {
    window.location.reload();
  }
}

export interface LanguageSelectorProps {
  className?: string;
  menuDirection?: "up" | "down";
}

export const Component = ({
  className,
  menuDirection = "up",
}: LanguageSelectorProps) => {
  const [selected, setSelected] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("preferred_language");
        if (stored) {
          const found = languages.find((l) => l.code === stored);
          if (found) return found;
        }
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match && match[1]) {
          const cookieCode = match[1];
          const found = languages.find(
            (l) => l.code === cookieCode || (l.code === "pt-BR" && cookieCode === "pt")
          );
          if (found) return found;
        }
      } catch {}
    }
    return languages[0];
  });

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (lang: (typeof languages)[0]) => {
    setSelected(lang);
    setOpen(false);
    applySiteLanguage(lang.code);
  };

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="language-selector-trigger"
        data-testid="language-selector-trigger"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select language, current: ${selected.label}`}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
          "bg-white/80 dark:bg-neutral-900/90 backdrop-blur-md shadow-sm",
          "border-gray-200 dark:border-neutral-700",
          "text-gray-800 dark:text-neutral-200",
          "hover:bg-gray-50 dark:hover:bg-neutral-800 hover:shadow-md transition-all cursor-pointer"
        )}
      >
        <span className="text-base leading-none select-none">{selected.flag}</span>
        <span className="font-medium text-xs sm:text-sm">{selected.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-gray-500 dark:text-neutral-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          role="listbox"
          aria-label="Available languages"
          className={cn(
            "absolute left-0 w-52 max-h-72 overflow-y-auto rounded-xl",
            "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl",
            "shadow-xl border border-gray-200 dark:border-neutral-700",
            "animate-fade-in z-50 p-1 divide-y divide-gray-100/70 dark:divide-neutral-800/70",
            menuDirection === "up" ? "bottom-full mb-2" : "mt-2"
          )}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={selected.code === lang.code}
              onClick={() => handleSelectLanguage(lang)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm text-left transition-colors cursor-pointer rounded-lg",
                selected.code === lang.code
                  ? "font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                  : "text-gray-800 dark:text-neutral-200 hover:bg-gray-100/80 dark:hover:bg-neutral-800/80"
              )}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="flex-1 font-medium">{lang.label}</span>
              {selected.code === lang.code && (
                <Check className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const LanguageSelectorDropdown = Component;
export default Component;
