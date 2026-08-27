export type Platform = 'claude' | 'codex';

export interface Timer {
  id: string;
  platform: Platform;
  startTime: number;
  resetTime: number;
  preResetAlert: boolean;
  active: boolean;
}

export interface Settings {
  isPro: boolean;
  proExpiresAt: number | null;
  preResetAlertEnabled: boolean;
}

export interface UsageLog {
  id: string;
  platform: Platform;
  hitAt: number;
  resetAt: number;
}

export interface QuizAnswers {
  services: string[];
  frequency: string | null;
}

export const DEFAULT_SETTINGS: Settings = {
  isPro: true,
  proExpiresAt: null,
  preResetAlertEnabled: true,
};
