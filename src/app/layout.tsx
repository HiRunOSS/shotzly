import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/globals.css";
import {
  DEFAULT_OG_IMAGE,
  SITE_CREATOR,
  SITE_CREATOR_URL,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  coreKeywords,
  defaultRobots,
} from "@/utils/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Screenshot & code image studio. | Shotzly",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shotzly is a free online code snippet generator and screenshot editor built for developers who want to create clean, beautiful, and shareable visuals in seconds.",
  keywords: coreKeywords,
  authors: [{ name: SITE_CREATOR, url: SITE_CREATOR_URL }],
  creator: SITE_CREATOR,
  publisher: SITE_CREATOR,
  category: "Developer Tools",
  classification: "Code snippet generator and screenshot editor",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Shotzly - Free Code Snippet Generator & Screenshot Editor",
    description:
      "Generate shareable code screenshots with syntax highlighting, themes, backgrounds, and an online screenshot editor. Free, fast, and built for developers.",
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 4096,
        height: 2304,
        type: "image/jpeg",
        alt: "Shotzly code snippet generator and screenshot editor preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shotzly - Free Code Snippet Generator",
    description:
      "Create code snippet images, keyboard-style code visuals, and polished screenshots for docs and social posts.",
    creator: "@hiarun02",
    site: "@hiarun02",
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: defaultRobots,
};

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} ${jetBrainsMono.variable} min-h-screen overflow-x-hidden overflow-y-auto bg-background text-foreground`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
