import type { Metadata } from "next";
import Link from "next/link";

import {
  PhoneFrame,
  TodayMock,
  OutcomeHookMock,
  QuickLogMock,
} from "@/components/phone-mockup";

export const metadata: Metadata = {
  title: "SessionReset — know when your AI is back",
  description:
    "5-hour reset alarms for Claude, Codex and AI CLI tools. Log a limit, get a precise countdown, and a heads-up 15 minutes before your window clears. No account, no server, 100% on-device.",
};

const FEATURES = [
  {
    title: "A timeline, not a list",
    body: "Your day plotted against a NOW marker — when each limit was logged, when each window reopens, and when you are clear again.",
  },
  {
    title: "15 minutes' warning",
    body: "A local alarm before the window clears, so you can finish the thought you are in rather than discovering it mid-prompt.",
  },
  {
    title: "Three taps to log",
    body: "Pick the service, say how long ago you hit it, done. The countdown starts from when you actually hit the limit.",
  },
  {
    title: "Nothing leaves the device",
    body: "No account, no server, no telemetry. Timers live in encrypted on-device storage and alarms are scheduled locally.",
  },
];

const STEPS = [
  { n: "01", title: "Hit a limit", body: "Claude or Codex cuts you off mid-flow." },
  { n: "02", title: "Log it", body: "Open SessionReset, tap the service, tap start." },
  { n: "03", title: "Walk away", body: "Get told 15 minutes before you are unblocked." },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6">
      {/* Hero */}
      <section className="flex flex-col items-center pt-20 text-center sm:pt-28">
        <span className="font-mono text-xs uppercase tracking-[0.3em]">
          <span className="text-claude">session</span>
          <span className="bg-gradient-to-r from-claude via-brand to-codex bg-clip-text text-transparent">
            reset
          </span>
        </span>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-[-1.5px] text-fg sm:text-6xl">
          Never lose your flow state to unexpected AI limits.
        </h1>

        <p className="mt-5 max-w-xl font-display text-lg font-medium leading-relaxed text-subtle">
          Instant 5-hour rolling reset alarms for Claude, Codex and AI CLI
          tools. Log the hit, get a precise countdown, stay in the zone.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <span
            className="flex h-12 items-center rounded-[var(--radius-button)] px-6 font-display text-[15px] font-bold"
            style={{
              background: "var(--color-brand-bright)",
              color: "var(--color-on-accent)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Coming to Android
          </span>
          <span className="font-mono text-xs text-dim">
            No account required • 100% on-device
          </span>
        </div>

        {/* Screens */}
        <div className="mt-16 flex w-full items-start justify-center gap-6 overflow-x-auto pb-4 sm:mt-20">
          <PhoneFrame scale={0.62} className="hidden shrink-0 lg:block">
            <OutcomeHookMock />
          </PhoneFrame>
          <PhoneFrame scale={0.72} className="shrink-0">
            <TodayMock />
          </PhoneFrame>
          <PhoneFrame scale={0.62} className="hidden shrink-0 md:block">
            <QuickLogMock />
          </PhoneFrame>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-24 sm:mt-32">
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-[1.4px] text-dim">
          How it works
        </h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-pill)] sm:grid-cols-3"
             style={{ background: "var(--color-line)" }}>
          {STEPS.map((s) => (
            <div key={s.n} className="bg-ink p-7">
              <div className="font-mono text-[11px] font-bold tracking-[1.4px] text-brand-bright">
                {s.n}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-fg">{s.title}</h3>
              <p className="mt-2 font-display text-[15px] font-medium leading-relaxed text-subtle">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-24 sm:mt-32">
        <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-[-0.8px] text-fg sm:text-4xl">
          Everything on. One purchase, for life.
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3.5">
              <span
                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold"
                style={{ background: "#0e1a2b", color: "var(--color-brand-bright)" }}
              >
                ✓
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-fg">{f.title}</h3>
                <p className="mt-1.5 font-display text-[15px] font-medium leading-relaxed text-subtle">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section
        className="mt-24 rounded-[var(--radius-pill)] p-8 sm:mt-32 sm:p-12"
        style={{
          background: "var(--color-elevated)",
          borderLeft: "3px solid var(--color-brand-bright)",
        }}
      >
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.5px] text-fg">
          Your usage is nobody else&apos;s business
        </h2>
        <p className="mt-3 max-w-2xl font-display text-[15px] font-medium leading-relaxed text-subtle">
          SessionReset has no backend and no accounts. Timers are kept in
          encrypted storage on your phone, alarms are scheduled by the operating
          system, and nothing is ever sent anywhere. There is no analytics SDK
          and no telemetry.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[1.4px] text-dim">
          <span>No account</span>
          <span>No server</span>
          <span>No telemetry</span>
          <span>10 languages</span>
        </div>
      </section>

      <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line py-10 font-mono text-xs text-dim sm:mt-32">
        <span>SessionReset</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="transition-colors hover:text-fg">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-fg">
            Terms
          </Link>
        </div>
      </footer>
    </main>
  );
}
