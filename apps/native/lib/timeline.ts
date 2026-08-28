import { Timer } from './types';

/**
 * One row on the Today timeline (design screen 07).
 *
 * The screen plots the day against a NOW marker: when each limit was logged
 * sits above it, when each window reopens sits below it, and a closing row
 * says when the user is clear again.
 */
export type TimelineEntry =
  | { kind: 'logged'; id: string; at: number; timer: Timer }
  | { kind: 'now'; id: 'now'; at: number }
  | { kind: 'reset'; id: string; at: number; timer: Timer }
  | { kind: 'clear'; id: 'clear'; at: number };

/** Ordering for entries that land on the same timestamp. */
const TIE_BREAK: Record<TimelineEntry['kind'], number> = {
  logged: 0,
  now: 1,
  reset: 2,
  clear: 3,
};

export function buildTimeline(timers: Timer[], now: number = Date.now()): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const timer of timers) {
    entries.push({ kind: 'logged', id: `logged-${timer.id}`, at: timer.startTime, timer });
    entries.push({ kind: 'reset', id: `reset-${timer.id}`, at: timer.resetTime, timer });
  }

  entries.push({ kind: 'now', id: 'now', at: now });

  if (timers.length > 0) {
    // "All clear from here" sits at the last window to reopen — past that
    // point nothing is still counting down.
    const lastReset = Math.max(...timers.map((t) => t.resetTime));
    entries.push({ kind: 'clear', id: 'clear', at: lastReset });
  }

  return entries.sort((a, b) => a.at - b.at || TIE_BREAK[a.kind] - TIE_BREAK[b.kind]);
}

/** Clock label for a timeline row, in the app's current language. */
export function formatClockTime(timestamp: number, locale: string): string {
  return new Date(timestamp).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
