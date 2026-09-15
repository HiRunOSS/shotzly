"use client";

import Link from "next/link";
import {FaArrowRight, FaStar} from "react-icons/fa";
import {useEffect, useState} from "react";

import {Button} from "@/components/ui/button";

export default function Hero() {
  const [stars, setStars] = useState<number | null>(null);
  const [displayStars, setDisplayStars] = useState(0);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/HiRunOSS/shotzly",
        );
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }
        const data = await res.json();
        if (typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch stars", error);
      }
    };

    fetchStars();
  }, []);

  useEffect(() => {
    if (stars === null) return;
    let current = 0;
    const target = stars;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayStars(current);
      if (current >= target) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [stars]);

  return (
    <section
      id="hero"
      className="bg-white pb-14 pt-20 dark:bg-[#111010] sm:pb-12"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 text-center">
        <div className="space-y-4 sm:max-w-3xl">
          {/* badge */}
          <div>
            <span className="mb-5 inline-block rounded-full bg-gray-100/60 px-3 py-1 text-sm font-medium dark:bg-amber-200/20 dark:text-amber-300">
              Version 2.0.0
            </span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl">
            Shotzly: Code & Screenshot to Stunning Visuals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Transform your code and screenshots into stunning visuals with
            Shotzly.
          </p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Button
            size="lg"
            className="w-full justify-center px-6 sm:w-auto"
            asChild
          >
            <Link href="/editor">
              Open Editor <FaArrowRight />{" "}
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-center sm:w-auto"
            asChild
          >
            <Link
              href="https://github.com/HiRunOSS/shotzly"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              Star on GitHub <FaStar className="text-yellow-500" />
              {stars === null ? (
                <span
                  className="inline-block ml-1 h-3 w-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin dark:border-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {displayStars.toLocaleString()}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
