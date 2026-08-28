import type { ReactNode } from "react";

/**
 * Device frame at the design file's own dimensions (390 x 844, 42px radius),
 * scaled down with a CSS transform so the mockups stay pixel-faithful to
 * designs/extracted/all-screens-template.html rather than being re-guessed at
 * a smaller size.
 */
export function PhoneFrame({
  children,
  scale = 0.72,
  className = "",
}: {
  children: ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ width: 390 * scale, height: 844 * scale }}
      aria-hidden="true"
    >
      <div
        className="flex flex-col overflow-hidden bg-ink"
        style={{
          width: 390,
          height: 844,
          borderRadius: "var(--radius-frame)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-frame)",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <StatusBar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <HomeIndicator />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-[52px] shrink-0 items-end justify-between px-7 pb-1.5">
      <span className="font-display text-[15px] font-bold text-fg">9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="h-2.5 w-[17px] rounded-sm bg-fg" />
        <div className="h-3 w-6 rounded-[3.5px] border-[1.5px] border-fg p-[2px]">
          <div className="h-full w-full rounded-[1.5px] bg-fg" />
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="flex h-[26px] shrink-0 items-center justify-center">
      <div className="h-[5px] w-[134px] rounded-[3px] bg-fg/60" />
    </div>
  );
}

/* ── Today ──────────────────────────────────────────────────────────────── */

/** Design screen 07: the day plotted against a NOW marker. */
export function TodayMock() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pt-2">
      <div className="flex h-[52px] shrink-0 flex-col justify-center gap-0.5">
        <div className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-fg">
          Today
        </div>
        <div className="font-display text-xs font-medium text-subtle">
          Thu, Aug 28 · 2 windows open
        </div>
      </div>

      <div className="mt-5 flex flex-col">
        <TimelineNote time="9:26 AM" title="Codex limit logged" sub="Window runs 5h from here" />
        <NowRow time="1:58 PM" />
        <TimelineCard
          time="2:26 PM"
          dot="var(--color-codex)"
          name="OpenAI Codex"
          badge="15m"
          badgeAccent
          countdown="00:11:47"
          countdownColor="var(--color-warn)"
          progress={96}
          progressColor="var(--color-warn)"
        />
        <TimelineCard
          time="4:15 PM"
          dot="var(--color-claude)"
          name="Claude 3.5 Sonnet"
          badge="OFF"
          countdown="02:14:08"
          progress={55}
          progressColor="var(--color-brand-bright)"
        />
        <TimelineNote
          time="4:15 PM"
          title="All clear from here"
          sub="Good slot for a long refactor"
          last
        />
      </div>
    </div>
  );
}

function TimeCol({ children, accent, strong }: { children: ReactNode; accent?: boolean; strong?: boolean }) {
  return (
    <div
      className="w-[54px] shrink-0 text-right font-mono text-xs"
      style={{
        color: accent ? "var(--color-brand-bright)" : strong ? "var(--color-fg)" : "var(--color-dim)",
        fontWeight: accent || strong ? 700 : 500,
      }}
    >
      {children}
    </div>
  );
}

function TimelineNote({
  time,
  title,
  sub,
  last,
}: {
  time: string;
  title: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <TimeCol>{time}</TimeCol>
      <div className="flex w-4 shrink-0 flex-col items-center">
        <div
          className="mt-4 h-2 w-2 rounded-full border-2 bg-ink"
          style={{ borderColor: "var(--color-faint)" }}
        />
        {!last && <div className="w-0.5 flex-1" style={{ background: "var(--color-line)" }} />}
      </div>
      <div className={last ? "pt-2.5" : "pb-[22px] pt-3"}>
        <div className="font-display text-sm font-semibold text-subtle">{title}</div>
        <div className="mt-[3px] font-display text-xs font-medium text-dim">{sub}</div>
      </div>
    </div>
  );
}

function NowRow({ time }: { time: string }) {
  return (
    <div className="my-2.5 mt-0.5 flex items-center gap-3">
      <TimeCol accent>{time}</TimeCol>
      <div className="relative flex w-4 shrink-0 items-center justify-center">
        <div
          className="sr-pulse absolute h-5 w-5 rounded-full"
          style={{ background: "var(--color-brand-bright)" }}
        />
        <div
          className="relative h-3 w-3 rounded-full"
          style={{ background: "var(--color-brand-bright)" }}
        />
      </div>
      <div className="flex flex-1 items-center gap-2.5">
        <div className="h-0.5 flex-1" style={{ background: "var(--color-brand-bright)" }} />
        <span
          className="font-mono text-[10px] font-bold tracking-[1.4px]"
          style={{ color: "var(--color-brand-bright)" }}
        >
          NOW
        </span>
      </div>
    </div>
  );
}

function TimelineCard({
  time,
  dot,
  name,
  badge,
  badgeAccent,
  countdown,
  countdownColor,
  progress,
  progressColor,
}: {
  time: string;
  dot: string;
  name: string;
  badge: string;
  badgeAccent?: boolean;
  countdown: string;
  countdownColor?: string;
  progress: number;
  progressColor: string;
}) {
  return (
    <div className="flex gap-3">
      <TimeCol strong>
        <span className="inline-block pt-5">{time}</span>
      </TimeCol>
      <div className="flex w-4 shrink-0 flex-col items-center">
        <div className="mt-[22px] h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
        <div className="w-0.5 flex-1" style={{ background: "var(--color-line)" }} />
      </div>
      <div className="flex-1 pb-5">
        <div
          className="p-[18px]"
          style={{ background: "var(--color-elevated)", borderRadius: "var(--radius-timer)" }}
        >
          <div className="flex items-center justify-between">
            <div className="font-display text-[15px] font-bold text-fg">{name}</div>
            <div
              className="font-mono text-[11px] font-bold"
              style={{ color: badgeAccent ? "var(--color-brand-bright)" : "var(--color-dim)" }}
            >
              {badge}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div
              className="font-mono text-[28px] font-bold leading-none tracking-[-1.4px]"
              style={{ color: countdownColor ?? "var(--color-fg)" }}
            >
              {countdown}
            </div>
            <div className="font-display text-xs font-medium text-subtle">left</div>
          </div>
          <div
            className="mt-3.5 h-1 overflow-hidden rounded-sm"
            style={{ background: "var(--color-line)" }}
          >
            <div
              className="h-full rounded-sm"
              style={{ width: `${progress}%`, background: progressColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Onboarding hook ────────────────────────────────────────────────────── */

/** Design screen 01: the status rail that sells the outcome. */
export function OutcomeHookMock() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-7 pt-7">
      <div className="flex flex-col">
        <RailRow dot="var(--color-danger)">
          <div
            className="rounded-xl px-4 py-3 font-display text-sm font-bold"
            style={{ background: "var(--color-danger-bg)", color: "var(--color-danger)" }}
          >
            Rate Limit Hit
          </div>
        </RailRow>
        <RailLine>
          <div className="py-[18px] font-mono text-[44px] font-bold leading-none tracking-[-2px] text-fg">
            05:00:00
          </div>
        </RailLine>
        <RailLine>
          <div
            className="pb-[18px] font-mono text-[44px] font-bold leading-none tracking-[-2px]"
            style={{ color: "var(--color-faint)" }}
          >
            00:00:00
          </div>
        </RailLine>
        <RailRow dot="var(--color-ok)" last>
          <div
            className="rounded-xl px-4 py-3 font-display text-sm font-bold"
            style={{ background: "var(--color-ok)", color: "#04120d" }}
          >
            Back to Code
          </div>
        </RailRow>
      </div>

      <div className="mt-14 font-display text-[30px] font-extrabold leading-[1.2] tracking-[-1px] text-fg">
        Never lose your flow state to unexpected AI limits.
      </div>
      <div className="mt-4 font-display text-base font-medium leading-[1.55] text-subtle">
        Instant 5-hour rolling reset alarms for Claude, Codex, and AI CLI tools.
      </div>

      <div className="min-h-6 flex-1" />
      <div
        className="flex h-14 shrink-0 items-center justify-center font-display text-base font-bold"
        style={{
          borderRadius: "var(--radius-button)",
          background: "var(--color-brand-bright)",
          color: "var(--color-on-accent)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        Get Started →
      </div>
      <div className="mb-3 mt-[18px] text-center font-display text-xs font-medium text-dim">
        No account required • 100% On-Device Data
      </div>
    </div>
  );
}

function RailRow({ dot, children, last }: { dot: string; children: ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex w-3 shrink-0 justify-center">
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
      </div>
      {children}
    </div>
  );
}

function RailLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <div className="flex w-3 shrink-0 justify-center">
        <div className="w-0.5 flex-1" style={{ background: "var(--color-line)" }} />
      </div>
      {children}
    </div>
  );
}

/* ── Quick-log sheet ────────────────────────────────────────────────────── */

/** Design screen 08: three taps to log a limit. */
export function QuickLogMock() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex-1 px-5 pt-2 opacity-40">
        <div className="flex h-[52px] flex-col justify-center gap-0.5">
          <div className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-fg">
            Today
          </div>
          <div className="font-display text-xs font-medium text-subtle">
            Thu, Aug 28 · 1 window open
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/70" />

      <div
        className="absolute inset-x-0 bottom-0 px-6 pt-3"
        style={{
          background: "var(--color-elevated)",
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
        }}
      >
        <div className="flex justify-center">
          <div className="h-1 w-10 rounded-sm" style={{ background: "#3a3a3a" }} />
        </div>
        <div className="mt-[18px] font-display text-[19px] font-extrabold tracking-[-0.3px] text-fg">
          Log limit hit
        </div>

        <div className="mt-5 flex gap-3">
          <div
            className="flex flex-1 flex-col gap-2.5 p-4"
            style={{ border: "2px solid var(--color-line)", borderRadius: "var(--radius-button)" }}
          >
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-claude)" }} />
            <div className="font-display text-[15px] font-bold text-subtle">Claude</div>
          </div>
          <div
            className="flex flex-1 flex-col gap-2.5 p-4"
            style={{
              border: "2px solid var(--color-codex)",
              background: "var(--color-codex)",
              borderRadius: "var(--radius-button)",
            }}
          >
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#04120d" }} />
            <div className="font-display text-[15px] font-bold" style={{ color: "#04120d" }}>
              Codex
            </div>
          </div>
        </div>

        <div className="mt-6 font-display text-[13px] font-bold text-subtle">
          When did you hit the limit?
        </div>
        <div className="mt-3 flex gap-2">
          <div
            className="flex-1 rounded-full py-[11px] text-center font-display text-[13px] font-bold"
            style={{ background: "var(--color-brand-bright)", color: "var(--color-on-accent)" }}
          >
            Just Now
          </div>
          {["5m", "15m", "30m"].map((v) => (
            <div
              key={v}
              className="flex-1 rounded-full py-2.5 text-center font-mono text-[13px] font-bold text-subtle"
              style={{ border: "1.5px solid var(--color-line)" }}
            >
              {v}
            </div>
          ))}
        </div>

        <div
          className="mt-[22px] flex items-center justify-between px-[18px] py-4"
          style={{ background: "var(--color-elevated-alt)", borderRadius: "var(--radius-button)" }}
        >
          <div className="flex flex-col gap-[3px]">
            <div className="font-display text-sm font-bold text-fg">Remind me 15m before reset</div>
            <div className="font-display text-xs font-medium text-subtle">Local alarm at 2:11 PM</div>
          </div>
          <div
            className="flex h-7 w-[46px] shrink-0 justify-end rounded-full p-[3px]"
            style={{ background: "var(--color-brand-bright)" }}
          >
            <div className="h-[22px] w-[22px] rounded-full" style={{ background: "var(--color-on-accent)" }} />
          </div>
        </div>

        <div
          className="mt-[22px] flex h-14 items-center justify-center font-display text-base font-bold"
          style={{
            borderRadius: "var(--radius-button)",
            background: "var(--color-brand-bright)",
            color: "var(--color-on-accent)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          Start 5-Hour Timer
        </div>
        <div className="mt-2 flex h-[26px] items-center justify-center">
          <div className="h-[5px] w-[134px] rounded-[3px] bg-fg/60" />
        </div>
      </div>
    </div>
  );
}
