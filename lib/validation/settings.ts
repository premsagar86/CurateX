import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
});

export const notificationPrefsSchema = z.object({
  milestoneApproval: z.boolean(),
  invoiceDue: z.boolean(),
  projectComments: z.boolean(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type NotificationPrefsInput = z.infer<typeof notificationPrefsSchema>;
