export async function uploadVideo(file: File): Promise<{ jobId: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

export async function convertVideo(
  jobId: string,
  resolution: string,
  quality: string,
  format: string,
): Promise<{ message: string }> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId,
      resolution,
      quality,
      format,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Conversion failed');
  }

  return response.json();
}

export async function getConversionStatus(
  jobId: string,
  options?: { signal?: AbortSignal },
): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  outputPath?: string;
}> {
  const response = await fetch(`/api/status?jobId=${jobId}`, { signal: options?.signal });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Status check failed');
  }

  return response.json();
}

export async function getFiles(): Promise<
  Array<{
    filename: string;
    size: number;
    uploaded: string;
    jobId: string;
    status: 'uploaded' | 'completed';
    outputPath?: string;
  }>
> {
  const response = await fetch('/api/files');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch files');
  }

  return response.json();
}

export async function deleteFile(jobId: string): Promise<{ message: string }> {
  const response = await fetch('/api/files', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Delete failed');
  }

  return response.json();
}
