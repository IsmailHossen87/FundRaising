import { z } from 'zod';

export const NotificationValidation = {
  createNotificationSchema: z.object({
    // userId: z.string().nonempty(),
    type: z.string().nonempty(),
    title: z.string().nonempty(),
    recipientGroup: z.string().nonempty(),
    dateSent: z.date(),
    status: z.enum(['Sent', 'Draft']),
    recipientType: z.enum(['Active', 'Closed', 'Winner Announced']),
  }),

  updateNotificationSchema: z.object({
    type: z.string().optional(),
    title: z.string().optional(),
    recipientGroup: z.string().optional(),
    dateSent: z.date().optional(),
    status: z.enum(['Sent', 'Draft']).optional(),
    recipientType: z.enum(['Active', 'Closed', 'Winner Announced']).optional(),
  }),
};
