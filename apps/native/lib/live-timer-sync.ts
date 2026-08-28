import i18n, { getAppLanguage } from './i18n';
import { colors } from './tokens';
import { formatClockTime } from './timeline';
import { Timer } from './types';
import { startLiveTimer, stopLiveTimer, isLiveTimerAvailable } from '../modules/live-timer';

/**
 * Bridges timers to the Android live-countdown notification.
 *
 * Kept out of TimerContext so the context stays about state, and so this is
 * one place to look when asking "what does the shade currently show".
 *
 * No-ops where the native module is absent (iOS, Expo Go) — the scheduled
 * reset and pre-reset notifications still fire there.
 */

/** Brand colour tints the notification's icon and app name in the shade. */
function tintFor(timer: Timer): string {
  return timer.platform === 'claude' ? colors.light.claude : colors.light.codex;
}

export function showLiveTimer(timer: Timer): void {
  if (!isLiveTimerAvailable || !timer.active) return;

  const locale = getAppLanguage();
  startLiveTimer({
    id: timer.id,
    title: i18n.t(`dashboard.timer.${timer.platform}`),
    body: i18n.t('liveTimer.body', { time: formatClockTime(timer.resetTime, locale) }),
    endsAt: timer.resetTime,
    color: tintFor(timer),
    channelName: i18n.t('liveTimer.channelName'),
    channelDescription: i18n.t('liveTimer.channelDescription'),
  });
}

export function hideLiveTimer(id: string): void {
  if (!isLiveTimerAvailable) return;
  stopLiveTimer(id);
}

/**
 * Re-post every active window's countdown.
 *
 * Needed on launch because the system clears notifications on reboot, and
 * after a language change so the shade is not left in the previous language.
 */
export function syncLiveTimers(timers: Timer[]): void {
  if (!isLiveTimerAvailable) return;
  timers.filter((t) => t.active).forEach(showLiveTimer);
}
