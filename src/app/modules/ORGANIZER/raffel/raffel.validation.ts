import { z } from 'zod';

// Update Raffle Validation
export const updateRaffleZodSchema = z.object({
  body: z.object({
    raffleName: z.string().optional(),
    monthName: z.string().optional(),
    package: z
      .object({
        ticketType: z.enum(['Premium', 'Standard', 'Basic']).optional(),
        ticketQuantity: z.number().optional(),
        ticketAmount: z.number().optional(),
      })
      .optional(),
    organizer: z
      .object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().optional(),
      })
      .optional(),
    ticketAmount: z.number().min(1).optional(),
    causeId: z.string().optional(),
    ticketSaleStartDate: z.coerce.date().optional(),
    ticketSaleEndDate: z.coerce.date().optional(),
    drawDate: z.coerce.date().optional(),
    status: z.enum(['active', 'closed']).optional(),
    image: z.string().url().optional(),
    raffleDescription: z.string().optional(),
    prizes: z.string().optional(),
    targetsold: z.number().min(0).optional(),
    amount: z.number().min(1).optional(),
  }),
});
