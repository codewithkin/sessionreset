import { requireOptionalNativeModule } from "expo";

export interface LiveTimerOptions {
  /** Timer id — also keys the notification, so re-posting updates in place. */
  id: string;
  title: string;
  body: string;
  /** Epoch ms the window reopens; the countdown targets this. */
  endsAt: number;
  /** `#RRGGBB` used to tint the small icon and app name. */
  color?: string;
  channelName?: string;
  channelDescription?: string;
}

interface LiveTimerNative {
  isAvailable(): boolean;
  start(options: LiveTimerOptions): void;
  stop(id: string): void;
  stopAll(): void;
}

/**
 * Android-only live countdown notification.
 *
 * `requireOptionalNativeModule` rather than `requireNativeModule`: this has no
 * iOS implementation and is absent from Expo Go, and a missing live countdown
 * should degrade to the scheduled notifications the app already has rather
 * than crash on import.
 */
const native = requireOptionalNativeModule<LiveTimerNative>("LiveTimer");

export const isLiveTimerAvailable = native != null;

export function startLiveTimer(options: LiveTimerOptions): void {
  native?.start(options);
}

export function stopLiveTimer(id: string): void {
  native?.stop(id);
}

export function stopAllLiveTimers(): void {
  native?.stopAll();
}
