import { z } from 'zod';

// Create Raffle Validation
export const createRaffleZodSchema = z.object({
  body: z.object({
    raffleName: z.string({ required_error: 'Raffle name is required' }),
    organizer: z.object({
      name: z.string({ required_error: 'Organizer name is required' }),
      email: z.string().email({ message: 'Invalid email format' }),
      phoneNumber: z.string({
        required_error: 'Organizer phone number is required',
      }),
    }),
    targetAmount: z
      .number()
      .min(1, { message: 'Target amount must be greater than 0' }),
    causeId: z.string({ required_error: 'Cause is required' }),
    ticketSaleEndDate: z.coerce.date(),
    drawDate: z.coerce.date(),
    status: z.enum(['active', 'closed']).default('active'),
    raffleDescription: z.string().optional(),
    prizes: z.string({ required_error: 'Prizes list is required' }),
    sold: z.number().min(0, { message: 'Sold must be 0 or higher' }),
    amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
  }),
});

// Update Raffle Validation
export const updateRaffleZodSchema = z.object({
  body: z.object({
    raffleName: z.string().optional(),
    organizer: z
      .object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().optional(),
      })
      .optional(),
    targetAmount: z.number().min(1).optional(),
    causeId: z.string().optional(),
    ticketSaleEndDate: z.coerce.date().optional(),
    drawDate: z.coerce.date().optional(),
    status: z.enum(['active', 'closed']).optional(),
    image: z.string().url().optional(),
    raffleDescription: z.string().optional(),
    prizes: z.string().optional(),
    sold: z.number().min(0).optional(),
    amount: z.number().min(1).optional(),
  }),
});
