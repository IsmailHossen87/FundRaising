import { z } from 'zod';

// Create Raffle Validation
export const createRaffleZodSchema = z.object({
  body: z.object({
    raffleName: z.string({ required_error: 'Raffle name is required' }),
    sold: z.number().min(0, { message: 'Sold must be 0 or higher' }),
    amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
    date: z.date().optional(),
    status: z.enum(['active', 'closed']).optional(),
  }),
});

// Update Raffle Validation
export const updateRaffleZodSchema = z.object({
  body: z.object({
    raffleName: z.string().optional(),
    sold: z.number().min(0).optional(),
    amount: z.number().min(1).optional(),
    date: z.date().optional(),
    status: z.enum(['active', 'closed']).optional(),
  }),
});
