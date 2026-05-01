import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Use /tmp for conversions in production environments
const isProduction = process.env.NODE_ENV === 'production';
const UPLOAD_DIR = isProduction 
  ? path.join('/tmp', 'uploads')
  : path.join(process.cwd(), 'public', 'uploads');
const CONVERTED_DIR = isProduction
  ? path.join('/tmp', 'converted')
  : path.join(process.cwd(), 'public', 'converted');

// Ensure directories exist
export async function ensureDirectories() {
  try {
    for (const dir of [UPLOAD_DIR, CONVERTED_DIR]) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
  } catch (error) {
    console.error('Failed to ensure directories:', error);
  }
}

export async function saveUploadedFile(buffer: Buffer, filename: string): Promise<string> {
  await ensureDirectories();
  const sanitized = filename.replace(/[^a-z0-9._-]/gi, '_');
  const filepath = path.join(UPLOAD_DIR, sanitized);
  await writeFile(filepath, buffer);
  return filepath;
}

export async function saveConvertedFile(buffer: Buffer, filename: string): Promise<string> {
  await ensureDirectories();
  const sanitized = filename.replace(/[^a-z0-9._-]/gi, '_');
  const filepath = path.join(CONVERTED_DIR, sanitized);
  await writeFile(filepath, buffer);
  return filepath;
}

export async function deleteFile(filepath: string): Promise<void> {
  try {
    await unlink(filepath);
  } catch (error) {
    console.error(`Failed to delete file ${filepath}:`, error);
  }
}

export function getPublicPath(filepath: string): string {
  // Convert absolute filesystem paths to browser-safe URLs.
  // Example: C:\app\public\converted\a.mp4 -> /converted/a.mp4
  const normalizedPath = path.normalize(filepath);
  const publicRoot = path.join(process.cwd(), 'public');

  let relativeToPublic = path.relative(publicRoot, normalizedPath);
  if (relativeToPublic.startsWith('..')) {
    relativeToPublic = path.basename(normalizedPath);
  }

  return `/${relativeToPublic.split(path.sep).join('/')}`;
}

export function getAbsolutePathFromPublicPath(publicPath: string): string {
  const normalizedPublicPath = publicPath.replace(/\\/g, '/').replace(/^\/+/, '');
  return path.join(process.cwd(), 'public', normalizedPublicPath);
}
