import Image, {type StaticImageData} from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ImageIcon,
  Keyboard,
  Layers3,
  Palette,
  Sparkles,
  Type,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/Footer";

type IconName =
  | "check"
  | "download"
  | "image"
  | "keyboard"
  | "layers"
  | "palette"
  | "sparkles"
  | "type"
  | "upload"
  | "wand";

export interface ToolSeoFeature {
  icon: IconName;
  title: string;
  description: string;
}

export interface ToolSeoFaq {
  question: string;
  answer: string;
}

export interface ToolSeoPageProps {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  editorHref: string;
  preview: StaticImageData;
  previewAlt: string;
  sectionTitle: string;
  sectionDescription: string;
  features: ToolSeoFeature[];
  steps: string[];
  faq: ToolSeoFaq[];
}

const icons: Record<IconName, typeof CheckCircle2> = {
  check: CheckCircle2,
  download: Download,
  image: ImageIcon,
  keyboard: Keyboard,
  layers: Layers3,
  palette: Palette,
  sparkles: Sparkles,
  type: Type,
  upload: UploadCloud,
  wand: WandSparkles,
};

export default function ToolSeoPage({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  editorHref,
  preview,
  previewAlt,
  sectionTitle,
  sectionDescription,
  features,
  steps,
  faq,
}: ToolSeoPageProps) {
  return (
    <div className="min-h-screen bg-[#111010] text-white">
      <Navbar />
      <main>
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-5xl px-5 pb-16 pt-16 text-center sm:pt-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-normal text-white/50">
                {badge}
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-normal text-white sm:text-6xl">
                {title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/58">
                {description}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href={editorHref}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  {primaryCta}
                  <ArrowRight size={17} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-11 items-center rounded-md border border-white/15 px-5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {secondaryCta}
                </a>
              </div>
              <p className="mt-4 text-xs text-white/40">
                100% free | no signup | no watermark
              </p>
            </div>
            <Image
              src={preview}
              alt={previewAlt}
              priority
              sizes="(max-width: 840px) calc(100vw - 40px), 800px"
              className="mx-auto mt-12 h-auto w-full max-w-[800px] rounded-md border border-white/10"
            />
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                {sectionTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-white/55">
                {sectionDescription}
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = icons[feature.icon];

                return (
                  <article
                    key={feature.title}
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-6"
                  >
                    <Icon className="h-5 w-5 text-white/72" aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/20 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-xs font-medium uppercase text-white/45">
                Fast workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Create, polish, export.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="border-t border-white/15 pt-5 text-sm leading-6 text-white/58"
                >
                  <span className="mb-3 block font-mono text-xs text-white/35">
                    0{index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-semibold text-white">FAQ</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {faq.map((item) => (
                <article key={item.question} className="border-t border-white/15 pt-5">
                  <h3 className="text-base font-semibold text-white">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
