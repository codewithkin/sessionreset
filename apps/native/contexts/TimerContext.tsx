import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Timer, Platform } from "@/lib/types";
import { storage } from "@/lib/storage";
import { createTimer, isExpired } from "@/lib/timer-engine";
import {
  scheduleTimerNotifications,
  cancelTimerNotifications,
} from "@/lib/notifications";

interface TimerContextValue {
  timers: Timer[];
  addTimer: (platform: Platform, preResetAlert?: boolean) => Promise<void>;
  removeTimer: (id: string) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  refreshTimers: () => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>(() => storage.timers.getActive());

  const refreshTimers = useCallback(() => {
    setTimers(storage.timers.getActive());
  }, []);

  const addTimer = useCallback(
    async (platform: Platform, preResetAlert = true) => {
      const timer = createTimer(platform, Date.now(), preResetAlert);
      storage.timers.add(timer);
      await scheduleTimerNotifications(timer);
      refreshTimers();
    },
    [refreshTimers]
  );

  const removeTimer = useCallback(
    async (id: string) => {
      await cancelTimerNotifications(id);
      storage.timers.remove(id);
      refreshTimers();
    },
    [refreshTimers]
  );

  const toggleAlert = useCallback(
    async (id: string) => {
      const all = storage.timers.get();
      const timer = all.find((t) => t.id === id);
      if (!timer) return;

      const updated = { ...timer, preResetAlert: !timer.preResetAlert };
      const newAll = all.map((t) => (t.id === id ? updated : t));
      storage.timers.set(newAll);

      // Reschedule or cancel pre-reset notification
      await cancelTimerNotifications(id);
      if (updated.preResetAlert && updated.active) {
        await scheduleTimerNotifications(updated);
      }

      refreshTimers();
    },
    [refreshTimers]
  );

  // Auto-remove expired timers on mount and periodically
  useEffect(() => {
    const check = () => {
      const active = storage.timers.getActive();
      const expired = active.filter(isExpired);
      if (expired.length > 0) {
        expired.forEach((t) => {
          cancelTimerNotifications(t.id);
        });
        const stillActive = active.filter((t) => !isExpired(t));
        // Keep expired ones in history but mark inactive
        const all = storage.timers.get();
        const updated = all.map((t) =>
          expired.some((e) => e.id === t.id) ? { ...t, active: false } : t
        );
        storage.timers.set(updated);
        setTimers(stillActive);
      }
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider
      value={{ timers, addTimer, removeTimer, toggleAlert, refreshTimers }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimers() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimers must be used within TimerProvider");
  return ctx;
}
