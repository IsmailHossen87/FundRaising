import { z } from 'zod';

// 🌱 Draft Notification Schema (all optional except isDraft)
export const DraftNotificationZodSchema = z.object({
  body: z.object({
    title: z.string(),
    isDraft: z.boolean().optional(),
    DeliveryMethod: z.enum(['email', 'notification']).optional(),
    recipientType: z.enum(['active', 'closed', 'Winner ']).optional(),
    message: z.string().optional(),
  }),
});

// 🌟 Full Notification Schema (required fields)
export const FullNotificationZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    isDraft: z.boolean().optional(),
    DeliveryMethod: z.enum(['email', 'notification']),
    recipientType: z.enum(['active', 'closed', 'Winner']),
    message: z.string({ required_error: 'Message is required' }),
  }),
});

// ✅ Export together
export const NotificationValidation = {
  DraftNotificationZodSchema,
  FullNotificationZodSchema,
};
