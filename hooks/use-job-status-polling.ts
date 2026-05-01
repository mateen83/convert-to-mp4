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
  onResult: (result: PollingResult) => void;
  onError: (error: unknown) => void;
}

export function useJobStatusPolling({
  jobId,
  enabled,
  intervalMs = 1000,
  onResult,
  onError,
}: UseJobStatusPollingOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRequestInFlightRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isRequestInFlightRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled || !jobId) {
      stopPolling();
      return;
    }

    const pollOnce = async () => {
      if (isRequestInFlightRef.current) {
        return;
      }

      isRequestInFlightRef.current = true;
      try {
        const result = await getConversionStatus(jobId);
        onResult(result);

        if (result.status === 'completed' || result.status === 'failed') {
          stopPolling();
        }
      } catch (error) {
        onError(error);
        stopPolling();
      } finally {
        isRequestInFlightRef.current = false;
      }
    };

    void pollOnce();
    intervalRef.current = setInterval(() => {
      void pollOnce();
    }, intervalMs);

    return stopPolling;
  }, [enabled, intervalMs, jobId, onError, onResult, stopPolling]);

  return { stopPolling };
}
