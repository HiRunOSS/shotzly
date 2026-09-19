"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

const GITHUB_REPO_URL = "https://github.com/HiRunOSS/shotzly";

export default function Navbar() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/HiRunOSS/shotzly")
      .then((response) => response.json())
      .then((data) => {
        if (typeof data?.stargazers_count === "number") setStars(data.stargazers_count);
      })
      .catch(() => undefined);
  }, []);

  return <header className="bg-[#111010] text-white"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 border-b border-white/10 px-5">
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold"><Image src="/icon.svg" alt="" width={28} height={28} />Shotzly</Link>
    <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm"><a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" aria-label="Star Shotzly on GitHub" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-semibold leading-none tabular-nums text-white/70 hover:bg-white/10 hover:text-white"><FaGithub className="h-3.5 w-3.5 text-white/55" />{stars === null ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/45 border-t-transparent" aria-hidden="true" /> : <span>{stars.toLocaleString()}</span>}</a><Link href="/editor" className="flex items-center gap-2 text-white hover:text-white/70">Create <ArrowUpRight size={16} /></Link></nav>
  </div></header>;
}
