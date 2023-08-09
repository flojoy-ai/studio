import { z } from "zod";

export const GalleryApp = z.object({
  title: z.string(),
  description: z.string(),
  appPath: z.string(),
  imagePath: z.string(),
  youtubeLink: z.optional(z.string()),
  relevantNodes: z.array(
    z.object({
      name: z.string(),
      docs: z.string(),
    })
  ),
});

export type GalleryApp = z.infer<typeof GalleryApp>;

export const GalleryData = z.record(z.string(), z.array(GalleryApp));

export type GalleryData = z.infer<typeof GalleryData>;
