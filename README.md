# VideoConvert - Fast Video Converter

A full-stack video converter built with **Next.js 16**, **Tailwind CSS**, and **FFmpeg**. Convert your videos to multiple formats and resolutions with an intuitive, modern UI.

## Features

✨ **Key Features:**
- **Drag & Drop Upload** - Intuitive file upload interface
- **Multiple Formats** - Convert to MP4 (H.264) or WebM (VP9)
- **Custom Resolution** - Choose 720p, 1080p, or 4K (2160p)
- **Quality Settings** - Select conversion quality (Medium, High, Very High)
- **Real-time Progress** - Live progress tracking with status updates
- **File Management** - View, download, and delete converted videos
- **Client Validation** - Zod-based form validation
- **Responsive Design** - Mobile-first design that works on all devices
- **Brand Orange Theme** - Custom #f87941 primary color

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide Icons** - Beautiful SVG icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Node.js Built-ins** - File system operations
- **fluent-ffmpeg** - FFmpeg command builder
- **UUID** - Unique job ID generation

## Project Structure

```
app/
├── api/
│   ├── upload/route.ts      # Handle file uploads
│   ├── convert/route.ts     # Start video conversion
│   ├── status/route.ts      # Poll conversion progress
│   └── files/route.ts       # List and delete files
├── page.tsx                 # Home converter page
├── library/
│   └── page.tsx            # Video library page
└── layout.tsx              # Root layout with metadata

components/
├── navbar.tsx              # Navigation bar
├── file-uploader.tsx       # Drag & drop upload
├── conversion-form.tsx     # Configuration form
├── progress-bar.tsx        # Progress tracking
└── video-card.tsx          # File card in library

hooks/
├── use-video-upload.ts     # Upload logic
└── use-conversion.ts       # Conversion tracking

lib/
├── api-client.ts           # API helper functions
├── ffmpeg.ts               # FFmpeg wrapper
├── storage.ts              # File storage utilities
└── validation.ts           # Zod schemas
```

## API Routes

### POST `/api/upload`
Upload a video file for conversion.

**Request:**
```
FormData with 'file' field
```

**Response:**
```json
{
  "jobId": "uuid",
  "filename": "original_name.mp4"
}
```

### POST `/api/convert`
Start video conversion with specified settings.

**Request:**
```json
{
  "jobId": "uuid",
  "resolution": "1080",
  "quality": "high",
  "format": "mp4"
}
```

**Response:**
```json
{
  "message": "Conversion started"
}
```

### GET `/api/status?jobId=uuid`
Check conversion progress.

**Response:**
```json
{
  "status": "processing|completed|failed",
  "progress": 75,
  "error": null,
  "outputPath": "/converted/output.mp4"
}
```

### GET `/api/files`
Get list of all uploaded and converted files.

**Response:**
```json
[
  {
    "filename": "video.mp4",
    "jobId": "uuid",
    "status": "completed",
    "uploaded": "2026-05-01T...",
    "outputPath": "/converted/output.mp4"
  }
]
```

### DELETE `/api/files`
Delete a file and its conversion.

**Request:**
```json
{
  "jobId": "uuid"
}
```

## Getting Started

### Installation

```bash
# Clone or download the project
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Environment Setup

No additional environment variables required for development. The app uses:
- Local file storage in `public/uploads` and `public/converted` (dev)
- Temporary directory `/tmp` in production

## FFmpeg Fallback

The app includes a graceful FFmpeg fallback. If FFmpeg is not available on your system:
1. The app detects this automatically
2. Conversions run in **simulation mode**
3. Files are copied instead of re-encoded
4. Progress is simulated with realistic timing

To use actual FFmpeg conversion, install FFmpeg on your system:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
choco install ffmpeg
```

## Validation & Security

✅ **File Upload Validation:**
- File size limit: 500MB
- Supported formats: MP4, WebM, AVI, MOV, MKV, OGG
- MIME type verification

✅ **Filename Sanitization:**
- Removes special characters
- UUID prefix for uniqueness
- Prevents directory traversal

✅ **Error Handling:**
- User-friendly error messages
- Graceful degradation
- Automatic cleanup on failures

## Components

### FileUploader
- Drag & drop interface
- Click to browse
- Real-time validation
- Error display

### ConversionForm
- Select resolution (720p, 1080p, 4K)
- Choose quality (Medium, High, Very High)
- Pick format (MP4, WebM)
- Disabled state during upload

### ProgressBar
- Real-time progress percentage
- Status indicators
- Error messages
- Download link on completion

### VideoCard
- File information display
- Upload date/time
- Download button
- Delete functionality

## Styling

**Color Scheme:**
- **Primary:** #f87941 (Brand Orange)
- **Background:** oklch(1 0 0) / oklch(0.145 0 0) dark
- **Foreground:** oklch(0.145 0 0) / oklch(0.985 0 0) dark
- **Border:** oklch(0.922 0 0)
- **Accent:** Complementary neutrals

**Design Principles:**
- Mobile-first responsive design
- Accessibility (WCAG 2.1)
- Semantic HTML
- Tailwind utility classes

## Performance Optimizations

- Server-side validation
- Async conversion processing
- Progress polling optimization
- File size limits
- Automatic cleanup

## Future Enhancements

- [ ] Database persistence (Supabase, Neon)
- [ ] File storage integration (Vercel Blob)
- [ ] Job queue system (Bull, BullMQ)
- [ ] Advanced FFmpeg options
- [ ] Batch conversion
- [ ] Video preview thumbnails
- [ ] Advanced analytics
- [ ] User authentication

## Troubleshooting

**Issue: "FFmpeg error"**
→ FFmpeg is not installed. Install it or the app will use simulation mode.

**Issue: "File too large"**
→ Maximum file size is 500MB. Reduce your video size.

**Issue: Conversion stuck**
→ Check the console logs. The API will timeout after ~30 minutes.

## License

MIT License - Feel free to use this for any project!

---

Built with ❤️ using Next.js 16 and Tailwind CSS
