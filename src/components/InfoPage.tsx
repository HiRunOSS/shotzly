import type {ReactNode} from "react";
import Navbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/Footer";

export default function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111010] text-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-14 sm:pt-20">
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">{intro}</p>
        <div className="mt-12 space-y-10 border-t border-white/10 pt-10">
          {children}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
