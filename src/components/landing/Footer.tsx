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

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://www.scrolllaunch.com/products/shotzly?ref=badge"
              target="_blank"
              rel="noreferrer"
              aria-label="Shotzly - Featured on ScrollLaunch"
            >
              <img
                src="https://www.scrolllaunch.com/api/badge/shotzly?variant=launched&theme=light"
                alt="Shotzly - Featured on ScrollLaunch"
                className="h-6 w-auto"
              />
            </a>

            <a
              href="https://twelve.tools/shotzly"
              target="_blank"
              rel="noreferrer"
              aria-label="Featured on Twelve Tools"
            >
              <img
                src="https://twelve.tools/badge0-white.svg"
                alt="Featured on Twelve Tools"
                width="148"
                height="40"
                className="h-6 w-auto"
              />
            </a>

            <a
              href="https://rankcert.com/product/shotzly"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://rankcert.com/badge/shotzly?style=card&theme=light"
                alt="Shotzly on RankCert"
                width="240"
                height="64"
                className="h-6 w-auto"
              />
            </a>
            <a
              href="https://www.listbulb.com/tools/shotzly"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://www.listbulb.com/featured-on-listbulb-light.svg"
                alt="Featured on ListBulb"
                height="240"
                className="h-6 w-auto"
              />
            </a>
            <a
              href="https://www.tinyshelf.co/?ref=shotzly.com"
              title="Featured on TinyShelf"
            >
              <img
                src="https://www.tinyshelf.co/badge/tinyshelf-badge-dark-f4d1216a.svg"
                alt="Featured on TinyShelf"
                width="216"
                height="64"
                className="h-6 w-auto"
              />
            </a>
            <a
              href="https://findly.tools/shotzly?utm_source=shotzly"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://findly.tools/badges/findly-tools-badge-light.svg"
                alt="Featured on Findly.tools"
                width="175"
                height="55"
                className="h-6 w-auto"
              />
            </a>
            <a
              href="https://codehype.ai/product/shotzly?utm_source=codehype_badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://codehype.ai/badges/shotzly.svg?variant=find-us&v=20"
                alt="Featured on CodeHype"
                width="180"
                height="65"
                loading="lazy"
                decoding="async"
                className="inline-block h-6 w-auto max-w-[180px] border-0"
              />
            </a>
            <a
              href="https://nicklaunches.com/products/shotzly/?utm_source=shotzly.com&utm_medium=badge&utm_campaign=featured"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://nicklaunches.com/badges/featured.png"
                alt="Shotzly on Nick Launches"
                width="244"
                height="56"
                className="h-6 w-auto"
              />
            </a>
            <MakeItLastBadge />
          </div>

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
