import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <meta name="theme-color" content="#08080C" />
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
      </head>
      <body className="min-h-screen bg-[#08080C] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
