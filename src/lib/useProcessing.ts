import { useCallback, useEffect, useRef, useState } from "react";

export type ProcessingState = { message: string; progress: number };

/**
 * Drives a friendly loading overlay around an async task. Most of our long
 * operations (image export, AI planning, file read) expose no real progress,
 * so we ease a faux bar toward ~90% while the task runs, then snap to 100% and
 * hold briefly so the completion reads as a deliberate, cheerful beat.
 *
 * On error the overlay hides immediately (no celebratory 100%) and the error
 * propagates to the caller.
 */
export function useProcessing() {
  const [processing, setProcessing] = useState<ProcessingState | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const run = useCallback(
    async <T>(message: string, task: () => Promise<T>): Promise<T> => {
      stopTimer();
      let progress = 0;
      setProcessing({ message, progress });
      timerRef.current = setInterval(() => {
        // Ease toward 90%: fast at first, slowing as it approaches the cap.
        progress = Math.min(90, progress + (90 - progress) * 0.12 + 1.5);
        if (mounted.current) setProcessing({ message, progress });
      }, 120);

      try {
        const result = await task();
        stopTimer();
        if (mounted.current) {
          setProcessing({ message, progress: 100 });
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
        return result;
      } finally {
        stopTimer();
        if (mounted.current) setProcessing(null);
      }
    },
    [stopTimer],
  );

  return { processing, run };
}
