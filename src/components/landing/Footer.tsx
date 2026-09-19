"use client";

import Link from "next/link";

export function MakeItLastBadge() {
  return (
    <a href="https://www.makeitla.st/" title="Featured on MakeItLast">
      <img src="https://www.makeitla.st/badge/makeitlast-badge-light.svg?v=3"
        alt="Featured on MakeItLast" width={252} height={76} className="h-6 w-auto" />
    </a>
  );
}

export default function LandingFooter() {
  const badges = [
    { href: "https://www.scrolllaunch.com/products/shotzly?ref=badge", src: "https://www.scrolllaunch.com/api/badge/shotzly?variant=launched&theme=light", alt: "Shotzly - Featured on ScrollLaunch" },
    { href: "https://twelve.tools/shotzly", src: "https://twelve.tools/badge0-white.svg", alt: "Featured on Twelve Tools", width: 148, height: 40 },
    { href: "https://rankcert.com/product/shotzly", src: "https://rankcert.com/badge/shotzly?style=card&theme=light", alt: "Shotzly on RankCert", width: 240, height: 64 },
    { href: "https://www.listbulb.com/tools/shotzly", src: "https://www.listbulb.com/featured-on-listbulb-light.svg", alt: "Featured on ListBulb", height: 240 },
    { href: "https://www.tinyshelf.co/?ref=shotzly.com", src: "https://www.tinyshelf.co/badge/tinyshelf-badge-dark-f4d1216a.svg", alt: "Featured on TinyShelf", width: 216, height: 64 },
    { href: "https://findly.tools/shotzly?utm_source=shotzly", src: "https://findly.tools/badges/findly-tools-badge-light.svg", alt: "Featured on Findly.tools", width: 175, height: 55 },
    { href: "https://codehype.ai/product/shotzly?utm_source=codehype_badge", src: "https://codehype.ai/badges/shotzly.svg?variant=find-us&v=20", alt: "Featured on CodeHype", width: 180, height: 65 },
    { href: "https://nicklaunches.com/products/shotzly/?utm_source=shotzly.com&utm_medium=badge&utm_campaign=featured", src: "https://nicklaunches.com/badges/featured.png", alt: "Shotzly on Nick Launches", width: 244, height: 56 },
    { href: "https://www.makeitla.st/", src: "https://www.makeitla.st/badge/makeitlast-badge-light.svg?v=3", alt: "Featured on MakeItLast", width: 252, height: 76 },
  ];
  const footerLinks = [
    {label: "Privacy", href: "/privacy"},
    {label: "Terms", href: "/terms"},
    {label: "Contact", href: "/contact"},
    {
      label: "Contributing",
      href: "https://github.com/HiRunOSS/shotzly/blob/main/CONTRIBUTING.md",
    },

    {
      label: "Report Issue",
      href: "https://github.com/HiRunOSS/shotzly/issues",
    },
    { label: "GitHub", href: "https://github.com/HiRunOSS/shotzly" },
  ];

  return (
    <footer className="bg-white/10 dark:bg-[#111010]/80 border-t border-white/20 dark:border-white/10 backdrop-blur-2xl">
      <div className="border-y border-white/20 bg-black py-6 text-center">
        <p className="mb-4 text-xs font-medium uppercase text-white/60">
          As featured on
        </p>
        <div className="group overflow-x-auto scrollbar-hide">
          <div className="flex w-max min-w-full items-center justify-center gap-3 px-6 animate-[badge-marquee_30s_ease-in-out_infinite_alternate] motion-reduce:animate-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            {badges.map((badge) => (
              <a key={badge.href} href={badge.href} target="_blank" rel="noopener noreferrer" title={badge.alt} className="flex h-10 shrink-0 items-center rounded border border-white/30 bg-white px-2">
                <img src={badge.src} alt={badge.alt} width={badge.width} height={badge.height} className="h-6 w-auto" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Shotzly
            </span>{" "}
            © 2026
          </div>

          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
          >
            {footerLinks.map((link) => {
              const isExternal = link.href.startsWith("http");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="text-gray-700 underline-offset-4 transition hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Built by{" "}
            <Link
              href="https://x.com/hiarun02"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 transition hover:text-gray-700 hover:underline dark:hover:text-gray-200"
            >
              @hiarun02
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
