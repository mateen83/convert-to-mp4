export interface ConversionJob {
  jobId: string;
  filename: string;
  originalPath: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputPath?: string;
  error?: string;
  uploaded: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __conversionJobStore: Map<string, ConversionJob> | undefined;
}

export const jobStore: Map<string, ConversionJob> =
  globalThis.__conversionJobStore ?? new Map<string, ConversionJob>();

if (!globalThis.__conversionJobStore) {
  globalThis.__conversionJobStore = jobStore;
}
