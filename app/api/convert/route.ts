import { NextRequest, NextResponse } from 'next/server';
import { convertVideo, ConversionOptions } from '@/lib/ffmpeg';
import { deleteFile, getPublicPath, ensureDirectories } from '@/lib/storage';
import { jobStore } from '@/lib/job-store';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();
    const body = await request.json();
    const { jobId, resolution, quality, format } = body;

    if (!jobId || !resolution || !quality || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = jobStore.get(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status === 'processing') {
      return NextResponse.json({ error: 'Conversion already in progress' }, { status: 400 });
    }

    // Update job status
    job.status = 'processing';
    job.progress = 0;

    // Run conversion in background
    const conversionOptions: ConversionOptions = { resolution, quality, format };
    const outputExtension = format === 'webm' ? 'webm' : 'mp4';
    const outputFilename = `${jobId}-converted.${outputExtension}`;
    const outputPath = path.join(process.cwd(), 'public', 'converted', outputFilename);

    // Async conversion without awaiting
    convertVideo(job.originalPath, outputPath, conversionOptions, (progress) => {
      job.progress = progress;
    })
      .then(() => {
        job.status = 'completed';
        job.progress = 100;
        job.outputPath = getPublicPath(outputPath);
      })
      .catch((error) => {
        job.status = 'failed';
        job.error = error.message;
        deleteFile(outputPath);
      });

    return NextResponse.json(
      {
        message: 'Conversion started',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Convert error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Conversion failed',
      },
      { status: 500 },
    );
  }
}
