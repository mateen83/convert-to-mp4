import { useState } from 'react';
import { uploadVideo } from '@/lib/api-client';

interface UseVideoUploadReturn {
  isUploading: boolean;
  error: string | null;
  upload: (file: File) => Promise<{ jobId: string; filename: string }>;
}

export function useVideoUpload(): UseVideoUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadVideo(file);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    error,
    upload,
  };
}
