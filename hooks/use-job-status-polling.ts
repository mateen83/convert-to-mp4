import { useCallback, useEffect, useRef } from 'react';
import { getConversionStatus } from '@/lib/api-client';

interface PollingResult {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  outputPath?: string;
}

interface UseJobStatusPollingOptions {
  jobId: string | null;
  enabled: boolean;
  intervalMs?: number;
  maxIntervalMs?: number;
  onResult: (result: PollingResult) => void;
  onError: (error: unknown) => void;
}

export function useJobStatusPolling({
  jobId,
  enabled,
  intervalMs = 3000,
  maxIntervalMs = 5000,
  onResult,
  onError,
}: UseJobStatusPollingOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isRunningRef = useRef(false);
  const nextDelayRef = useRef(intervalMs);

  const stopPolling = useCallback(() => {
    isRunningRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !jobId) {
      stopPolling();
      return;
    }

    isRunningRef.current = true;
    nextDelayRef.current = intervalMs;

    const scheduleNext = (delay: number) => {
      if (!isRunningRef.current) {
        return;
      }
      timeoutRef.current = setTimeout(() => {
        void pollOnce();
      }, delay);
    };

    const pollOnce = async () => {
      if (!isRunningRef.current) return;

      abortControllerRef.current = new AbortController();
      try {
        const result = await getConversionStatus(jobId, { signal: abortControllerRef.current.signal });
        onResult(result);
        nextDelayRef.current = intervalMs;

        if (result.status === 'completed' || result.status === 'failed') {
          stopPolling();
          return;
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        onError(error);
        nextDelayRef.current = Math.min(nextDelayRef.current + 1000, maxIntervalMs);
      } finally {
        abortControllerRef.current = null;
        scheduleNext(nextDelayRef.current);
      }
    };

    void pollOnce();
    return stopPolling;
  }, [enabled, intervalMs, jobId, maxIntervalMs, onError, onResult, stopPolling]);

  return { stopPolling };
}
