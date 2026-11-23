const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(process.cwd(), 'public', 'assets', 'logos');
fs.mkdirSync(dir, { recursive: true });

const svgs = {
  'instagram.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig" cx="20%" cy="105%" r="120%">
        <stop offset="0%" stop-color="#fdf497"/>
        <stop offset="5%" stop-color="#fdf497"/>
        <stop offset="45%" stop-color="#fd5949"/>
        <stop offset="60%" stop-color="#d6249f"/>
        <stop offset="90%" stop-color="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig)"/>
    <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="white" stroke-width="1.8" fill="none"/>
    <circle cx="12" cy="12" r="3.2" stroke="white" stroke-width="1.8" fill="none"/>
    <circle cx="15.8" cy="8.2" r="0.9" fill="white"/>
  </svg>`,

  'facebook.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#1877F2"/>
    <path d="M13.4 21.8v-7.6h2.55l.38-2.96H13.4V9.35c0-.86.24-1.44 1.47-1.44h1.57V5.26c-.27-.04-1.21-.12-2.3-.12-2.28 0-3.84 1.39-3.84 3.95v2.15H7.7v2.96h2.6v7.6a10.04 10.04 0 0 0 3.1 0z" fill="white"/>
  </svg>`,

  'x.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#000000"/>
    <path d="M16.99 5.8h2.22l-4.85 5.54 5.71 7.55h-4.47l-3.5-4.58-4.01 4.58H5.87l5.18-5.93L5.61 5.8h4.58l3.16 4.18L16.99 5.8zm-.78 11.76h1.23L9.58 7.05H8.26l7.95 10.51z" fill="white"/>
  </svg>`,

  'tiktok.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#010101"/>
    <path d="M14.6 5.8a4.6 4.6 0 0 0 2.8 1.9v2.2a6.6 6.6 0 0 1-2.8-.75V15a4.2 4.2 0 1 1-4.2-4.2c.4 0 .78.06 1.14.16v2.24a2.1 2.1 0 1 0 1.06 1.8V4.8h2.0z" fill="#00F2FE" transform="translate(-0.5, -0.5)" opacity="0.9"/>
    <path d="M14.6 5.8a4.6 4.6 0 0 0 2.8 1.9v2.2a6.6 6.6 0 0 1-2.8-.75V15a4.2 4.2 0 1 1-4.2-4.2c.4 0 .78.06 1.14.16v2.24a2.1 2.1 0 1 0 1.06 1.8V4.8h2.0z" fill="#FE0979" transform="translate(0.5, 0.5)" opacity="0.9"/>
    <path d="M14.6 5.8a4.6 4.6 0 0 0 2.8 1.9v2.2a6.6 6.6 0 0 1-2.8-.75V15a4.2 4.2 0 1 1-4.2-4.2c.4 0 .78.06 1.14.16v2.24a2.1 2.1 0 1 0 1.06 1.8V4.8h2.0z" fill="white"/>
  </svg>`,

  'onlyfans.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#00AFF0"/>
    <circle cx="10.8" cy="12" r="5" fill="white"/>
    <circle cx="10.8" cy="12" r="2.8" fill="#00AFF0"/>
    <path d="M17.5 7.5a4.8 4.8 0 0 1 0 7" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  'youtube.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#FF0000"/>
    <path d="M10 8.5v7l6-3.5-6-3.5z" fill="white"/>
  </svg>`,

  'whatsapp.png': `<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#25D366"/>
    <path d="M12 4.5a7.5 7.5 0 0 0-6.4 11.4L4.8 19.2l3.4-.89A7.5 7.5 0 1 0 12 4.5zm0 13.6a6.1 6.1 0 0 1-3.1-.85l-.22-.13-2.3.6.62-2.24-.15-.24A6.13 6.13 0 1 1 12 18.1zm3.36-4.6c-.18-.09-1.08-.53-1.25-.6-.17-.06-.3-.09-.42.09-.13.18-.49.6-.6.72-.11.13-.23.14-.42.05a5.28 5.28 0 0 1-1.57-.97 5.8 5.8 0 0 1-1.08-1.35c-.11-.18-.01-.28.08-.37.08-.08.18-.21.28-.32.09-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.09-.42-1.02-.58-1.4-.15-.37-.31-.32-.42-.32h-.36c-.12 0-.32.05-.49.23-.17.18-.65.64-.65 1.55 0 .92.67 1.8 0.76 1.93.1.12 1.32 2.02 3.2 2.83.45.19.8.31 1.07.4.45.14.86.12 1.18.07.36-.05 1.08-.44 1.23-.87.16-.42.16-.79.11-.87-.04-.08-.17-.13-.35-.22z" fill="white"/>
  </svg>`
};

Promise.all(Object.entries(svgs).map(([name, svg]) => {
  return sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(dir, name));
})).then(() => {
  console.log('Successfully created all 7 official logos in public/assets/logos/!');
});
