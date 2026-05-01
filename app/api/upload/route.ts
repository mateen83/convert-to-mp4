import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/storage';
import { generateJobId } from '@/lib/ffmpeg';
import { jobStore } from '@/lib/job-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/quicktime', 'video/x-matroska', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 500MB)' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const jobId = generateJobId();

    // Sanitize filename
    const originalName = file.name.replace(/[^a-z0-9._-]/gi, '_');
    const filename = `${jobId}-${originalName}`;

    const filepath = await saveUploadedFile(Buffer.from(buffer), filename);

    // Store job info
    jobStore.set(jobId, {
      jobId,
      filename: originalName,
      originalPath: filepath,
      status: 'uploaded',
      progress: 0,
      uploaded: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        jobId,
        filename: originalName,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 },
    );
  }
}

