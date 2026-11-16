import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Instagram: Authentic official gradient rounded camera
export function InstagramIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ig-rg" cx="20%" cy="105%" r="120%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-rg)" />
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
      />
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="3.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

// 2. Facebook: Authentic Meta brand blue badge with correct 'f' geometry
export function FacebookIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        d="M13.4 21.8v-7.6h2.55l.38-2.96H13.4V9.35c0-.86.24-1.44 1.47-1.44h1.57V5.26c-.27-.04-1.21-.12-2.3-.12-2.28 0-3.84 1.39-3.84 3.95v2.15H7.7v2.96h2.6v7.6a10.04 10.04 0 0 0 3.1 0z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 3. WhatsApp: Authentic speech bubble with notch and phone receiver
export function WhatsAppIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path
        d="M12 4.5a7.5 7.5 0 0 0-6.4 11.4L4.8 19.2l3.4-.89A7.5 7.5 0 1 0 12 4.5zm0 13.6a6.1 6.1 0 0 1-3.1-.85l-.22-.13-2.3.6.62-2.24-.15-.24A6.13 6.13 0 1 1 12 18.1zm3.36-4.6c-.18-.09-1.08-.53-1.25-.6-.17-.06-.3-.09-.42.09-.13.18-.49.6-.6.72-.11.13-.23.14-.42.05a5.28 5.28 0 0 1-1.57-.97 5.8 5.8 0 0 1-1.08-1.35c-.11-.18-.01-.28.08-.37.08-.08.18-.21.28-.32.09-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.09-.42-1.02-.58-1.4-.15-.37-.31-.32-.42-.32h-.36c-.12 0-.32.05-.49.23-.17.18-.65.64-.65 1.55 0 .92.67 1.8 0.76 1.93.1.12 1.32 2.02 3.2 2.83.45.19.8.31 1.07.4.45.14.86.12 1.18.07.36-.05 1.08-.44 1.23-.87.16-.42.16-.79.11-.87-.04-.08-.17-.13-.35-.22z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 4. TikTok: Authentic musical note with Cyan & Pink/Red chromatic aberration
export function TikTokIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#010101" />
      {/* Cyan shadow */}
      <path
        d="M14.6 5.8a4.6 4.6 0 0 0 2.8 1.9v2.2a6.6 6.6 0 0 1-2.8-.75V15a4.2 4.2 0 1 1-4.2-4.2c.4 0 .78.06 1.14.16v2.24a2.1 2.1 0 1 0 1.06 1.8V4.8h2.0z"
        fill="#00F2FE"
        transform="translate(-0.6, -0.6)"
        opacity="0.9"
      />
      {/* Red shadow */}
      <path
        d="M14.6 5.8a4.6 4.6 0 0 0 2.8 1.9v2.2a6.6 6.6 0 0 1-2.8-.75V15a4.2 4.2 0 1 1-4.2-4.2c.4 0 .78.06 1.14.16v2.24a2.1 2.1 0 1 0 1.06 1.8V4.8h2.0z"
        fill="#FE0979"
        transform="translate(0.6, 0.6)"
        opacity="0.9"
      />
      {/* Crisp White core */}
      <path
        d="M14.6 5.8a4.6 4.6 0 0 0 2.8 1.9v2.2a6.6 6.6 0 0 1-2.8-.75V15a4.2 4.2 0 1 1-4.2-4.2c.4 0 .78.06 1.14.16v2.24a2.1 2.1 0 1 0 1.06 1.8V4.8h2.0z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 5. X (Twitter): Official X brand geometry
export function XIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#000000" />
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <path
        d="M16.99 5.8h2.22l-4.85 5.54 5.71 7.55h-4.47l-3.5-4.58-4.01 4.58H5.87l5.18-5.93L5.61 5.8h4.58l3.16 4.18L16.99 5.8zm-.78 11.76h1.23L9.58 7.05H8.26l7.95 10.51z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 6. Telegram: Authentic blue circle with paper plane
export function TelegramIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="tg-g" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2AABEE" />
          <stop offset="1" stopColor="#229ED9" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#tg-g)" />
      <path
        d="M6.3 11.8l9.6-3.7c.45-.16.86.12.72.76l-1.63 7.7c-.12.55-.45.68-.9.43l-2.48-1.83-1.2 1.15c-.13.13-.24.24-.5.24l.18-2.52 4.59-4.14c.2-.18-.04-.28-.31-.1l-5.67 3.57-2.45-.76c-.53-.17-.54-.53.11-.79z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 7. Discord: Official Clyde controller geometry in #5865F2
export function DiscordIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#5865F2" />
      <path
        d="M17.4 7.6a13.3 13.3 0 0 0-3.3-1 .06.06 0 0 0-.06.03c-.14.25-.3.59-.41.85a12.3 12.3 0 0 0-3.66 0c-.12-.26-.27-.6-.42-.85a.06.06 0 0 0-.06-.03c-1.16.2-2.28.54-3.3 1a.06.06 0 0 0-.03.02C4.1 11.1 3.5 14.5 3.8 17.8a.07.07 0 0 0 .03.05 13.4 13.4 0 0 0 4.04 2.04.06.06 0 0 0 .07-.02c.31-.42.59-.87.82-1.34a.06.06 0 0 0-.03-.08 8.8 8.8 0 0 1-1.26-.6.06.06 0 0 1 0-.1c.08-.06.17-.13.25-.2a.06.06 0 0 1 .06 0c2.65 1.2 5.51 1.2 8.12 0a.06.06 0 0 1 .06 0c.08.07.17.14.25.2a.06.06 0 0 1 0 .1 8.7 8.7 0 0 1-1.26.6.06.06 0 0 0-.03.08c.24.47.52.92.83 1.34a.06.06 0 0 0 .07.02 13.4 13.4 0 0 0 4.05-2.04.06.06 0 0 0 .03-.05c.4-3.8-.7-7.2-2.7-10.2a.06.06 0 0 0-.03-.02zM8.9 14.9c-.8 0-1.46-.74-1.46-1.64 0-.9.64-1.64 1.46-1.64.82 0 1.48.74 1.46 1.64 0 .9-.64 1.64-1.46 1.64zm6.2 0c-.8 0-1.46-.74-1.46-1.64 0-.9.64-1.64 1.46-1.64.82 0 1.48.74 1.46 1.64 0 .9-.64 1.64-1.46 1.64z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 8. Reddit: Official Snoo alien silhouette in #FF4500
export function RedditIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#FF4500" />
      <path
        d="M19.1 11.2a1.6 1.6 0 0 0-2.65-1.22 7.7 7.7 0 0 0-4.04-1.16l.82-3.85 2.68.57a1.14 1.14 0 1 0 1.15-.95 1.14 1.14 0 0 0-1.1.84l-3-.64a.27.27 0 0 0-.32.2l-.98 4.6a7.74 7.74 0 0 0-4.14 1.16 1.6 1.6 0 1 0-1.74 2.62c-.03.17-.04.35-.04.53 0 2.67 3.03 4.83 6.77 4.83s6.77-2.16 6.77-4.83c0-.18-.01-.36-.04-.53a1.6 1.6 0 0 0-.1-2.17zM8.86 12.8a1.05 1.05 0 1 1 1.05-1.05 1.05 1.05 0 0 1-1.05 1.05zm6.34 2.76c-.8.8-2.09.85-3.2.85-1.12 0-2.42-.06-3.21-.85a.25.25 0 0 1 .36-.36c.6.6 1.66.69 2.85.69 1.19 0 2.24-.09 2.84-.69a.25.25 0 1 1 .36.36zm-.06-1.71a1.05 1.05 0 1 1 1.05-1.05 1.05 1.05 0 0 1-1.05 1.05z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 9. OnlyFans: Authentic cyan brand lock icon
export function OnlyFansIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#00AFF0" />
      <circle cx="10.8" cy="12" r="5" fill="#FFFFFF" />
      <circle cx="10.8" cy="12" r="2.8" fill="#00AFF0" />
      <path
        d="M17.5 7.5a4.8 4.8 0 0 1 0 7"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 10. YouTube: Official red brand rectangle with white triangle
export function YouTubeIcon({ className = "w-6 h-6", size }: IconProps) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={s}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="4" width="20" height="16" rx="4.5" fill="#FF0000" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5V8.5z" fill="#FFFFFF" />
    </svg>
  );
}
