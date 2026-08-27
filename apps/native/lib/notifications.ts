import * as Notifications from 'expo-notifications';
import { Timer } from './types';
import { FIFTEEN_MINUTES_MS } from './timer-engine';
import { storage } from './storage';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior),
});

// T10: Permission request flow
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return 'granted';
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted' ? 'granted' : 'denied';
}

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return 'granted';
  if (status === 'undetermined') return 'undetermined';
  return 'denied';
}

// T11: Schedule notifications for a timer
export async function scheduleTimerNotifications(timer: Timer): Promise<{ resetId: string; preResetId: string | null }> {
  const settings = storage.settings.get();
  const soundName = settings.notificationSound === 'chime'
    ? 'chime.wav'
    : settings.notificationSound === 'radar'
      ? 'radar.wav'
      : 'subtle-ping.wav';

  // Schedule reset notification (fires at resetTime)
  const resetId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${timer.platform === 'claude' ? 'Claude' : 'Codex'} Window Reset! 🚀`,
      body: `Your 5-hour ${timer.platform === 'claude' ? 'Claude' : 'Codex'} context window limit has cleared.`,
      sound: soundName,
      data: { timerId: timer.id, type: 'reset' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(timer.resetTime),
    },
  });

  // Schedule pre-reset alert (15 minutes before reset)
  let preResetId: string | null = null;
  if (timer.preResetAlert) {
    const preResetTime = timer.resetTime - FIFTEEN_MINUTES_MS;
    // Only schedule if pre-reset time is in the future
    if (preResetTime > Date.now()) {
      preResetId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⚡ ${timer.platform === 'claude' ? 'Claude' : 'Codex'} Reset in 15 Minutes`,
          body: `Finish your current task—your 5-hour context window is about to clear.`,
          sound: soundName,
          data: { timerId: timer.id, type: 'pre-reset' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(preResetTime),
        },
      });
    }
  }

  return { resetId, preResetId };
}

// T12: Cancel notifications for a timer
export async function cancelTimerNotifications(timerId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter(
    (n) => n.content.data?.timerId === timerId
  );
  for (const notification of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
}

// T13: Reconcile missed notifications on app launch
export async function reconcileMissedNotifications(): Promise<number> {
  const timers = storage.timers.get();
  const now = Date.now();
  let firedCount = 0;

  for (const timer of timers) {
    if (!timer.active) continue;

    // If timer has expired while app was closed
    if (timer.resetTime <= now) {
      // Fire the reset notification immediately
      const settings = storage.settings.get();
      const soundName = settings.notificationSound === 'chime'
        ? 'chime.wav'
        : settings.notificationSound === 'radar'
          ? 'radar.wav'
          : 'subtle-ping.wav';

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${timer.platform === 'claude' ? 'Claude' : 'Codex'} Window Reset! 🚀`,
          body: `Your 5-hour ${timer.platform === 'claude' ? 'Claude' : 'Codex'} context window limit has cleared.`,
          sound: soundName,
          data: { timerId: timer.id, type: 'reset' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(now + 1000), // Fire in 1 second
        },
      });

      // Mark timer as expired
      timer.active = false;
      firedCount++;
    }
  }

  // Update storage if any timers were marked expired
  if (firedCount > 0) {
    storage.timers.set(timers);
  }

  return firedCount;
}

// Helper: Cancel all notifications
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
