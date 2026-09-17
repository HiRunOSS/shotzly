import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight, Github} from "lucide-react";

export default function Navbar() {
  return <header className="bg-[#111010] text-white"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 border-b border-white/10 px-5">
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold"><Image src="/icon.svg" alt="" width={28} height={28} />Shotzly<span className="ml-1 text-[10px] font-normal text-white/40">STUDIO</span></Link>
    <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm"><a href="#examples" className="hidden text-white/60 hover:text-white sm:block">Examples</a><a href="https://github.com/HiRunOSS/shotzly" target="_blank" rel="noreferrer" aria-label="Shotzly on GitHub" className="text-white/60 hover:text-white"><Github size={18} /></a><Link href="/editor" className="flex items-center gap-2 text-white hover:text-white/70">Create <ArrowUpRight size={16} /></Link></nav>
  </div></header>;
}
