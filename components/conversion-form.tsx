'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertFormSchema, ConvertFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Zap } from 'lucide-react';

interface ConversionFormProps {
  onSubmit: (data: ConvertFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  canConvert?: boolean;
}

export function ConversionForm({ onSubmit, isLoading = false, error, canConvert = true }: ConversionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvertFormData>({
    resolver: zodResolver(convertFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resolution */}
        <div>
          <label htmlFor="resolution" className="block text-sm font-medium text-foreground mb-2">
            Resolution
          </label>
          <select
            id="resolution"
            {...register('resolution')}
            className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select resolution</option>
            <option value="720">720p HD</option>
            <option value="1080">1080p Full HD</option>
            <option value="2160">2160p 4K</option>
          </select>
          {errors.resolution && (
            <p className="mt-1 text-sm text-destructive">{errors.resolution.message}</p>
          )}
        </div>

        {/* Quality */}
        <div>
          <label htmlFor="quality" className="block text-sm font-medium text-foreground mb-2">
            Quality
          </label>
          <select
            id="quality"
            {...register('quality')}
            className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select quality</option>
            <option value="medium">Medium (Fast)</option>
            <option value="high">High (Balanced)</option>
            <option value="very_high">Very High (Slow)</option>
          </select>
          {errors.quality && <p className="mt-1 text-sm text-destructive">{errors.quality.message}</p>}
        </div>

        {/* Format */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-foreground mb-2">
            Format
          </label>
          <select
            id="format"
            {...register('format')}
            className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select format</option>
            <option value="mp4">MP4 (H.264)</option>
            <option value="webm">WebM (VP9)</option>
          </select>
          {errors.format && <p className="mt-1 text-sm text-destructive">{errors.format.message}</p>}
        </div>
      </div>

      {error && (
        <div className="flex gap-3 rounded-lg border border-destructive bg-destructive/5 p-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !canConvert}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Zap className="mr-2 h-4 w-4" />
        {isLoading ? 'Converting...' : canConvert ? 'Start Conversion' : 'Upload video to continue'}
      </Button>
    </form>
  );
}
