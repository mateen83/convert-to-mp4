'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { VideoCard } from '@/components/video-card';
import { Card } from '@/components/ui/card';
import { getFiles, deleteFile } from '@/lib/api-client';
import { Loader } from 'lucide-react';

interface FileEntry {
  filename: string;
  size: number;
  uploaded: string;
  jobId: string;
  status: 'uploaded' | 'completed';
  outputPath?: string;
}

export default function LibraryPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const fetchFiles = useCallback(async () => {
    try {
      setError(null);
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFiles();

    const handleConversionCompleted = () => {
      void fetchFiles();
    };

    window.addEventListener('conversion:completed', handleConversionCompleted);
    return () => {
      window.removeEventListener('conversion:completed', handleConversionCompleted);
    };
  }, [fetchFiles]);

  const handleDelete = async (jobId: string) => {
    setDeletingIds((prev) => new Set([...prev, jobId]));

    try {
      await deleteFile(jobId);
      setFiles((prev) => prev.filter((f) => f.jobId !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Your Library</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage and download your converted videos
          </p>
        </div>

        {isLoading ? (
          <Card className="p-12 border border-border flex flex-col items-center justify-center">
            <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your videos...</p>
          </Card>
        ) : error ? (
          <Card className="p-6 border border-destructive bg-destructive/5">
            <p className="text-destructive">{error}</p>
          </Card>
        ) : files.length === 0 ? (
          <Card className="p-12 border border-border text-center">
            <p className="text-muted-foreground mb-4">No videos yet</p>
            <a
              href="/"
              className="inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Upload Your First Video
            </a>
          </Card>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <VideoCard
                key={file.jobId}
                filename={file.filename}
                status={file.status}
                outputPath={file.outputPath}
                uploaded={file.uploaded}
                onDelete={() => handleDelete(file.jobId)}
                isDeleting={deletingIds.has(file.jobId)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
