import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Session Reset",
  description:
    "5-hour reset alarms for Claude, Codex and AI CLI tools. Know exactly when your context window resets.",
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-6">
      <span className="font-mono text-xs uppercase tracking-[0.3em]">
        <span className="text-claude">session</span>
        <span className="bg-gradient-to-r from-claude via-brand to-codex bg-clip-text text-transparent">
          reset
        </span>
      </span>

      <h1 className="mt-6 font-display text-4xl tracking-tight text-fg sm:text-5xl">
        Know when your AI is back.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-subtle">
        5-hour reset alarms for Claude, Codex and AI CLI tools. Never lose your
        flow state to unexpected rate limits.
      </p>

      <div className="mt-10 flex gap-5 font-mono text-xs text-subtle">
        <Link href="/privacy" className="hover:text-fg">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-fg">
          Terms
        </Link>
      </div>
    </main>
  );
}
