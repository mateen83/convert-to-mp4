'use client';

import { Download, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoCardProps {
  filename: string;
  status: 'uploaded' | 'completed';
  outputPath?: string;
  uploaded: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function VideoCard({
  filename,
  status,
  outputPath,
  uploaded,
  onDelete,
  isDeleting = false,
}: VideoCardProps) {
  const uploadedDate = new Date(uploaded).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-foreground truncate">{filename}</p>
          <p className="text-sm text-muted-foreground mt-1">{uploadedDate}</p>

          {status === 'completed' && (
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-green-600">Conversion Complete</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {status === 'completed' && outputPath && (
            <a href={outputPath} download>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </a>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
