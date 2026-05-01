'use client';

import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string | null;
  outputPath?: string | null;
  isUploading?: boolean;
}

export function ProgressBar({ progress, status, error, outputPath, isUploading = false }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const remaining = Math.max(0, 100 - safeProgress);

  const getProcessingLabel = () => {
    if (isUploading) return 'Uploading';
    if (safeProgress < 90) return 'Processing';
    return 'Finalizing';
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Conversion Progress</p>
          <p className="text-sm font-semibold text-foreground">{safeProgress}% completed</p>
        </div>
        <p className="text-xs text-muted-foreground">{remaining}% remaining</p>
      </div>

      <div className="w-full rounded-full bg-[#eceef1] p-1">
        <div
          className="h-2.5 rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${safeProgress}%`, backgroundColor: '#f87941' }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'processing' && (
            <>
              <Loader className="h-5 w-5 animate-spin" style={{ color: '#f87941' }} />
              <span className="text-sm font-medium text-foreground">{getProcessingLabel()}</span>
            </>
          )}
          {status === 'completed' && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Completed</span>
            </>
          )}
          {status === 'failed' && (
            <>
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">Failed</span>
            </>
          )}
        </div>
        {status === 'processing' && <span className="text-xs text-muted-foreground">Live updates every 1s</span>}
      </div>

      {error && (
        <div className="rounded-xl border border-destructive bg-destructive/5 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {status === 'completed' && outputPath && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'rgba(248, 121, 65, 0.08)', borderColor: '#f87941' }}>
          <p className="text-sm text-foreground mb-3">Your video is ready to download</p>
          <a
            href={outputPath}
            download
            className="inline-flex items-center rounded-lg px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#f87941' }}
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
