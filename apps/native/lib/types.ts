export type Platform = 'claude' | 'codex';

export type NotificationSound = 'chime' | 'radar' | 'subtle-ping';

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
  notificationSound: NotificationSound;
  preResetAlertEnabled: boolean;
}

export interface UsageLog {
  id: string;
  platform: Platform;
  hitAt: number;
  resetAt: number;
}

export const DEFAULT_SETTINGS: Settings = {
  isPro: false,
  proExpiresAt: null,
  notificationSound: 'chime',
  preResetAlertEnabled: true,
};
