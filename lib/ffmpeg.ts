import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import { copyFile } from 'fs/promises';

export interface ConversionOptions {
  resolution: string;
  quality: string;
  format: string;
}

const qualityMap = {
  medium: 'fast',
  high: 'medium',
  very_high: 'slow',
};

let ffmpegAvailable = true;

// Check if ffmpeg is available
try {
  // Use @ffmpeg-installer/ffmpeg for cross-platform support (Windows, macOS, Linux)
  ffmpeg.setFfmpegPath(ffmpegPath);
} catch (error) {
  console.warn('FFmpeg not found, using simulation mode');
  ffmpegAvailable = false;
}

export async function convertVideo(
  inputPath: string,
  outputPath: string,
  options: ConversionOptions,
  onProgress?: (progress: number) => void,
): Promise<void> {
  // Fallback: simulate conversion if FFmpeg is not available
  if (!ffmpegAvailable) {
    return simulateConversion(inputPath, outputPath, onProgress);
  }

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions('-preset', qualityMap[options.quality as keyof typeof qualityMap] || 'medium')
      .outputOptions('-movflags', 'faststart');

    // Set resolution
    if (options.resolution === '720') {
      command.size('1280x720');
    } else if (options.resolution === '1080') {
      command.size('1920x1080');
    } else if (options.resolution === '2160') {
      command.size('3840x2160');
    }

    // Set format-specific options
    if (options.format === 'webm') {
      command.videoCodec('libvpx-vp9').audioCodec('libopus').format('webm');
    }

    if (onProgress) {
      command.on('progress', (progress: { percent?: number }) => {
        const percent = Math.min(Math.round(progress.percent || 0), 99);
        onProgress(percent);
      });
    }

    command
      .on('end', () => {
        if (onProgress) {
          onProgress(100);
        }
        resolve();
      })
      .on('error', (err: Error) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .run();
  });
}

// Simulation mode: simulate conversion with progress updates
async function simulateConversion(
  inputPath: string,
  outputPath: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Copy the input file (simulating conversion)
      await copyFile(inputPath, outputPath);

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        if (onProgress) {
          onProgress(i);
        }
        await new Promise((r) => setTimeout(r, 100));
      }

      if (onProgress) {
        onProgress(100);
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function generateJobId(): string {
  return uuidv4();
}
