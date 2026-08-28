import { Timer, Platform } from './types';
import { createId } from './id';

export const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export function createTimer(platform: Platform, startTime = Date.now(), preResetAlert = true): Timer {
  return {
    id: createId(),
    platform,
    startTime,
    resetTime: startTime + FIVE_HOURS_MS,
    preResetAlert,
    active: true,
  };
}

export function getTimeRemaining(timer: Timer): { hours: number; minutes: number; seconds: number; totalMs: number } {
  const now = Date.now();
  const remaining = timer.resetTime - now;
  if (remaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, totalMs: remaining };
}

export function getTimeRemainingString(timer: Timer): string {
  const { hours, minutes, seconds } = getTimeRemaining(timer);
  return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
}

export function getProgress(timer: Timer): number {
  const now = Date.now();
  const elapsed = now - timer.startTime;
  const progress = (elapsed / FIVE_HOURS_MS) * 100;
  return Math.max(0, Math.min(100, progress));
}

export function isExpired(timer: Timer): boolean {
  return Date.now() >= timer.resetTime;
}

export function getPreResetTime(timer: Timer): number {
  return timer.resetTime - FIFTEEN_MINUTES_MS;
}

export function shouldShowPreResetAlert(timer: Timer): boolean {
  const now = Date.now();
  return timer.preResetAlert && now >= getPreResetTime(timer) && now < timer.resetTime;
}

export function getResetTimeString(timer: Timer): string {
  const date = new Date(timer.resetTime);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}