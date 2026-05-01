import { z } from 'zod';

export const uploadFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 500 * 1024 * 1024, {
      message: 'File size must be less than 500MB',
    })
    .refine(
      (file) =>
        ['video/mp4', 'video/webm', 'video/avi', 'video/quicktime', 'video/x-matroska', 'video/ogg'].includes(
          file.type,
        ),
      {
        message: 'File must be a valid video format (MP4, WebM, AVI, MOV, MKV, OGG)',
      },
    ),
});

export const convertFormSchema = z.object({
  resolution: z.enum(['720', '1080', '2160'], {
    errorMap: () => ({ message: 'Please select a valid resolution' }),
  }),
  quality: z.enum(['medium', 'high', 'very_high'], {
    errorMap: () => ({ message: 'Please select a valid quality' }),
  }),
  format: z.enum(['mp4', 'webm'], {
    errorMap: () => ({ message: 'Please select a valid format' }),
  }),
});

export type UploadFormData = z.infer<typeof uploadFormSchema>;
export type ConvertFormData = z.infer<typeof convertFormSchema>;
