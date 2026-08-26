import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  serviceType: z.enum(["WEBSITE", "UI_UX_DESIGN", "BRANDING", "GRAPHIC_DESIGN", "SOCIAL_MEDIA", "CONTENT_CREATION", "SEO", "ECOMMERCE"]),
  packageTier: z.enum(["STARTER", "GROWTH", "PREMIUM", "CUSTOM"]),
  founderOwnerId: z.string().min(1),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
