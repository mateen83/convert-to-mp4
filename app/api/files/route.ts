import { NextRequest, NextResponse } from 'next/server';
import { jobStore } from '@/lib/job-store';
import { deleteFile, getAbsolutePathFromPublicPath } from '@/lib/storage';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const files = Array.from(jobStore.values()).map((job) => ({
      filename: job.filename,
      size: 0,
      uploaded: job.uploaded,
      jobId: job.jobId,
      status: job.status === 'completed' ? 'completed' : 'uploaded',
      outputPath: job.outputPath,
    }));

    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    console.error('Files error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch files',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const job = jobStore.get(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Delete files
    await deleteFile(job.originalPath);
    if (job.outputPath) {
      const outputFullPath = getAbsolutePathFromPublicPath(job.outputPath);
      if (existsSync(outputFullPath)) {
        await deleteFile(outputFullPath);
      }
    }

    // Remove from store
    jobStore.delete(jobId);

    return NextResponse.json(
      {
        message: 'File deleted successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Delete failed',
      },
      { status: 500 },
    );
  }
}
