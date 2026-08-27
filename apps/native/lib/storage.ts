import { createMMKV } from 'react-native-mmkv';
import { Timer, Settings, UsageLog, DEFAULT_SETTINGS } from './types';

const mmkv = createMMKV();

const STORAGE_KEYS = {
  timers: 'timers.active',
  settings: 'settings',
  usageLog: 'usage_log',
  onboardingComplete: 'onboarding_complete',
} as const;

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;

function getJson<T>(key: string, fallback: T): T {
  const value = mmkv.getString(key);
  if (value === undefined) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function setJson(key: string, value: unknown): void {
  mmkv.set(key, JSON.stringify(value));
}

function sortByResetTime(timers: Timer[]): Timer[] {
  return [...timers].sort((a, b) => a.resetTime - b.resetTime);
}

export const storage = {
  timers: {
    get: (): Timer[] => getJson<Timer[]>(STORAGE_KEYS.timers, []),
    set: (timers: Timer[]): void => setJson(STORAGE_KEYS.timers, timers),
    getActive: (): Timer[] => {
      const all = getJson<Timer[]>(STORAGE_KEYS.timers, []);
      return sortByResetTime(all.filter(t => t.active));
    },
    add: (timer: Timer): void => {
      const existing = getJson<Timer[]>(STORAGE_KEYS.timers, []);
      const filtered = existing.filter(t => t.platform !== timer.platform || !t.active);
      const updated = sortByResetTime([...filtered, timer]);
      setJson(STORAGE_KEYS.timers, updated);
    },
    remove: (id: string): void => {
      const existing = getJson<Timer[]>(STORAGE_KEYS.timers, []);
      const filtered = existing.filter(t => t.id !== id);
      setJson(STORAGE_KEYS.timers, filtered);
    },
    markExpired: (): number => {
      const now = Date.now();
      const existing = getJson<Timer[]>(STORAGE_KEYS.timers, []);
      let changed = 0;
      const updated = existing.map(t => {
        if (t.active && t.resetTime <= now) {
          changed++;
          return { ...t, active: false };
        }
        return t;
      });
      if (changed > 0) setJson(STORAGE_KEYS.timers, updated);
      return changed;
    },
  },
  settings: {
    get: (): Settings => getJson<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
    set: (settings: Settings): void => setJson(STORAGE_KEYS.settings, settings),
  },
  usageLog: {
    get: (): UsageLog[] => getJson<UsageLog[]>(STORAGE_KEYS.usageLog, []),
    set: (logs: UsageLog[]): void => setJson(STORAGE_KEYS.usageLog, logs),
  },
  onboarding: {
    isComplete: (): boolean => mmkv.getBoolean(STORAGE_KEYS.onboardingComplete) ?? false,
    markComplete: (): void => mmkv.set(STORAGE_KEYS.onboardingComplete, true),
  },
};