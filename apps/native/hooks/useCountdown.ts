import { useState, useEffect, useRef, useCallback } from "react";
import { Timer } from "@/lib/types";
import { getTimeRemaining, getProgress, isExpired } from "@/lib/timer-engine";

interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isExpired: boolean;
  timeString: string;
  isWarning: boolean; // < 15 min
  isUrgent: boolean; // < 1 min
}

export function useCountdown(timer: Timer): CountdownResult {
  const [state, setState] = useState<CountdownResult>(() => compute(timer));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => {
      if (isExpired(timer)) {
        setState({
          hours: 0,
          minutes: 0,
          seconds: 0,
          progress: 100,
          isExpired: true,
          timeString: "00:00:00",
          isWarning: false,
          isUrgent: false,
        });
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      setState(compute(timer));
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer.id, timer.resetTime]);

  return state;
}

function compute(timer: Timer): CountdownResult {
  const { hours, minutes, seconds, totalMs } = getTimeRemaining(timer);
  const progress = getProgress(timer);
  const expired = totalMs <= 0;
  const totalMin = totalMs / 60000;

  return {
    hours,
    minutes,
    seconds,
    progress,
    isExpired: expired,
    timeString: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    isWarning: !expired && totalMin < 15,
    isUrgent: !expired && totalMin < 1,
  };
}
