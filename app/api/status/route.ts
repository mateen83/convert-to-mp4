import { NextRequest, NextResponse } from 'next/server';
import { jobStore } from '@/lib/job-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const job = jobStore.get(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: job.status,
        progress: job.progress,
        error: job.error,
        outputPath: job.outputPath,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Status check failed',
      },
      { status: 500 },
    );
  }
}
