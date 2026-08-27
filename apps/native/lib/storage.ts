import { createMMKV } from 'react-native-mmkv';
import { Timer, Settings, UsageLog, DEFAULT_SETTINGS } from './types';

const mmkv = createMMKV();

const STORAGE_KEYS = {
  timers: 'timers.active',
  settings: 'settings',
  usageLog: 'usage_log',
  onboardingComplete: 'onboarding_complete',
} as const;

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

export const storage = {
  timers: {
    get: (): Timer[] => getJson<Timer[]>(STORAGE_KEYS.timers, []),
    set: (timers: Timer[]): void => setJson(STORAGE_KEYS.timers, timers),
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