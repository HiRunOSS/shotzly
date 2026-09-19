import type {Metadata} from "next";
import {ArrowUpRight} from "lucide-react";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Shotzly creator, report a bug, or ask a question.",
  alternates: {canonical: "/contact"},
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact"
      intro="Questions, feedback, and bug reports are welcome. Choose the channel that fits your message."
    >
      <section>
        <h2 className="text-xl font-semibold">Product feedback and bugs</h2>
        <p className="mt-3 leading-7 text-white/65">
          Open a GitHub issue with what happened and, if useful, a screenshot or steps to reproduce it. GitHub issues are public, so leave out private information.
        </p>
        <a href="https://github.com/HiRunOSS/shotzly/issues/new" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/10">
          Open an issue <ArrowUpRight size={16} />
        </a>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Other questions</h2>
        <p className="mt-3 leading-7 text-white/65">
          Reach out to Shotzly&apos;s creator, Arun Kumar, on X. You can also browse the source and existing discussions on GitHub.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="https://x.com/hiarun02" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/10">
            @hiarun02 on X <ArrowUpRight size={16} />
          </a>
          <a href="https://github.com/HiRunOSS/shotzly" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/10">
            GitHub repository <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </InfoPage>
  );
}
