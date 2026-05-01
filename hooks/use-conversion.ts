import { useState, useCallback } from 'react';
import { convertVideo } from '@/lib/api-client';
import { useJobStatusPolling } from '@/hooks/use-job-status-polling';

interface ConversionState {
  status: 'idle' | 'processing' | 'completed' | 'failed';
  progress: number;
  error: string | null;
  outputPath: string | null;
}

interface UseConversionReturn extends ConversionState {
  convert: (jobId: string, resolution: string, quality: string, format: string) => Promise<void>;
  reset: () => void;
}

function toFriendlyErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Conversion failed';
  if (message.toLowerCase().includes('job not found')) {
    return 'Session was refreshed and upload state was reset. Please upload the video again, then start conversion.';
  }
  return message;
}

export function useConversion(): UseConversionReturn {
  const [state, setState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    error: null,
    outputPath: null,
  });

  const [jobId, setJobId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const onPollResult = useCallback((result: { status: 'pending' | 'processing' | 'completed' | 'failed'; progress: number; error?: string; outputPath?: string }) => {
    const mappedStatus = result.status === 'pending' ? 'processing' : result.status;
    setState({
      status: mappedStatus,
      progress: result.progress,
      error: result.error || null,
      outputPath: result.outputPath || null,
    });

    if (result.status === 'completed' || result.status === 'failed') {
      setIsPolling(false);
    }

    if (result.status === 'completed' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('conversion:completed', { detail: { jobId } }));
    }
  }, [jobId]);

  const onPollError = useCallback((err: unknown) => {
    setState((prev) => ({
      ...prev,
      error: toFriendlyErrorMessage(err),
      status: 'failed',
    }));
    setIsPolling(false);
  }, []);

  useJobStatusPolling({
    jobId,
    enabled: isPolling,
    intervalMs: 1000,
    onResult: onPollResult,
    onError: onPollError,
  });

  const convert = useCallback(
    async (id: string, resolution: string, quality: string, format: string) => {
      setJobId(id);
      setState({
        status: 'processing',
        progress: 0,
        error: null,
        outputPath: null,
      });
      setIsPolling(true);

      try {
        await convertVideo(id, resolution, quality, format);
      } catch (err) {
        setState({
          status: 'failed',
          progress: 0,
          error: toFriendlyErrorMessage(err),
          outputPath: null,
        });
        setIsPolling(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setJobId(null);
    setIsPolling(false);
    setState({
      status: 'idle',
      progress: 0,
      error: null,
      outputPath: null,
    });
  }, []);

  return {
    ...state,
    convert,
    reset,
  };
}
