'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { ConversionForm } from '@/components/conversion-form';
import { ProgressBar } from '@/components/progress-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useVideoUpload } from '@/hooks/use-video-upload';
import { useConversion } from '@/hooks/use-conversion';
import { ConvertFormData } from '@/lib/validation';

export default function Home() {
  const { isUploading, error: uploadError, upload } = useVideoUpload();
  const { status, progress, error: conversionError, outputPath, convert, reset } = useConversion();
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const isConverting = status === 'processing';

  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      const result = await upload(file);
      setCurrentFilename(result.filename);
      setCurrentJobId(result.jobId);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleConvert = async (data: ConvertFormData) => {
    if (!currentJobId) return;

    try {
      await convert(currentJobId, data.resolution, data.quality, data.format);
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  };

  const handleReset = () => {
    reset();
    setCurrentFilename(null);
    setCurrentJobId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground text-balance text-center">
            Convert Your Videos with Ease
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-center">
            Transform your videos to any resolution and format. Fast, reliable, and completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Upload Section */}
<div className="space-y-6 h-full">
  <div className="h-full flex flex-col">
    <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
      Step 1: Upload Video
    </h2>

    <Card className="flex-1 rounded-2xl border border-border/70 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <FileUploader onFileSelect={handleFileSelect} isLoading={isUploading} />

      {currentFilename && (
        <p className="mt-4 text-sm text-green-600">
          ✓ Uploaded: <span className="font-medium">{currentFilename}</span>
        </p>
      )}
    </Card>
  </div>
</div>

{/* Conversion Section */}
<div className="space-y-6 h-full">
  <div className="h-full flex flex-col">
    <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
      Step 2: Configure & Convert
    </h2>

    <Card className="flex-1 rounded-2xl border border-border/70 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {status === 'idle' ? (
        <>
          <ConversionForm
            onSubmit={handleConvert}
            isLoading={isUploading || isConverting}
            error={uploadError || conversionError}
            canConvert={Boolean(currentJobId)}
          />

          {!currentFilename && (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Upload a video first to start conversion
            </p>
          )}
        </>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <ProgressBar
            progress={progress}
            status={status}
            error={conversionError}
            outputPath={outputPath}
            isUploading={isUploading}
          />

          {status === 'completed' && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium text-sm"
            >
              Convert Another Video
            </button>
          )}
        </div>
      )}
    </Card>
  </div>
</div>
</div>

 <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card className="p-4 border border-brand-muted/30 bg-white rounded-xl shadow-soft hover:shadow-md transition-all">
    <div className="space-y-2">
      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
        <div className="w-3 h-3 bg-brand-primary rounded-sm" />
      </div>

      <h3 className="text-sm font-semibold text-brand-dark">
        Fast Conversion
      </h3>

      <p className="text-xs text-brand-muted leading-snug">
        Optimized FFmpeg processing for quick, high-quality results.
      </p>
    </div>
  </Card>

  <Card className="p-4 border border-brand-muted/30 bg-white rounded-xl shadow-soft hover:shadow-md transition-all">
    <div className="space-y-2">
      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
        <div className="w-3 h-3 bg-brand-primary rounded-sm" />
      </div>

      <h3 className="text-sm font-semibold text-brand-dark">
        Multiple Formats
      </h3>

      <p className="text-xs text-brand-muted leading-snug">
        Convert to MP4, WebM, and more with flexible settings.
      </p>
    </div>
  </Card>

  <Card className="p-4 border border-brand-muted/30 bg-white rounded-xl shadow-soft hover:shadow-md transition-all">
    <div className="space-y-2">
      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
        <div className="w-3 h-3 bg-brand-primary rounded-sm" />
      </div>

      <h3 className="text-sm font-semibold text-brand-dark">
        Secure & Private
      </h3>

      <p className="text-xs text-brand-muted leading-snug">
        Files are processed locally and removed after conversion.
      </p>
    </div>
  </Card>
</div>
      </main>
      <Footer />
    </div>

    
  );
}
