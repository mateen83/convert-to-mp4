'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertFormSchema, ConvertFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Zap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ConversionFormProps {
  onSubmit: (data: ConvertFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  canConvert?: boolean;
}

export function ConversionForm({ onSubmit, isLoading = false, error, canConvert = true }: ConversionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvertFormData>({
    resolver: zodResolver(convertFormSchema),
    defaultValues: {
      resolution: '',
      quality: '',
      format: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resolution */}
        <div>
          <label htmlFor="resolution" className="block text-sm font-medium text-foreground mb-2">
            Resolution
          </label>
          <Controller
            name="resolution"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger
                  id="resolution"
                  className="h-11 w-full rounded-xl border-border/70 bg-background shadow-sm transition-all duration-200 hover:border-primary/40 focus:ring-primary/20"
                >
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/70 shadow-lg">
                  <SelectItem value="720">720p HD</SelectItem>
                  <SelectItem value="1080">1080p Full HD</SelectItem>
                  <SelectItem value="2160">2160p 4K</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.resolution && (
            <p className="mt-1 text-sm text-destructive">{errors.resolution.message}</p>
          )}
        </div>

        {/* Quality */}
        <div>
          <label htmlFor="quality" className="block text-sm font-medium text-foreground mb-2">
            Quality
          </label>
          <Controller
            name="quality"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger
                  id="quality"
                  className="h-11 w-full rounded-xl border-border/70 bg-background shadow-sm transition-all duration-200 hover:border-primary/40 focus:ring-primary/20"
                >
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/70 shadow-lg">
                  <SelectItem value="medium">Medium (Fast)</SelectItem>
                  <SelectItem value="high">High (Balanced)</SelectItem>
                  <SelectItem value="very_high">Very High (Slow)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.quality && <p className="mt-1 text-sm text-destructive">{errors.quality.message}</p>}
        </div>

        {/* Format */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-foreground mb-2">
            Format
          </label>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger
                  id="format"
                  className="h-11 w-full rounded-xl border-border/70 bg-background shadow-sm transition-all duration-200 hover:border-primary/40 focus:ring-primary/20"
                >
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/70 shadow-lg">
                  <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                  <SelectItem value="webm">WebM (VP9)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
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
