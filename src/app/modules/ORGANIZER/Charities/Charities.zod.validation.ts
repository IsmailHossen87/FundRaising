import { z } from 'zod';

// ✅ Create Cause Validation
export const createCauseZodSchema = z.object({
  body: z.object({
    causeName: z.string({ required_error: 'Cause name is required' }),
    registrationNumber: z.string().optional(),
    category: z.enum(['School', 'Club', 'Charity'], {
      required_error: 'Category is required',
    }),
    campaignId: z.string().optional(),
    status: z.enum(['Active', 'Pending', 'Rejected'], {
      required_error: 'Status is required',
    }),
    bankDetails: z.string({ required_error: 'Bank details are required' }),
    date: z.coerce.date({ required_error: 'Date is required' }),
    addressLine1: z.string({ required_error: 'Address line 1 is required' }),
    addressLine2: z.string().optional(),
    town: z.string({ required_error: 'Town is required' }),
    country: z.string({ required_error: 'Country is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    phone: z.string({ required_error: 'Phone number is required' }),
    description: z.string().optional(),
  }),
});

// ✅ Update Cause Validation
export const updateCauseZodSchema = z.object({
  body: z.object({
    causeName: z.string().optional(),
    registrationNumber: z.string().optional(),
    category: z.enum(['School', 'Club', 'Charity']).optional(),
    campaignId: z.string().optional(),
    status: z.enum(['Active', 'Pending', 'Rejected']).optional(),
    bankDetails: z.string().optional(),
    date: z.coerce.date().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    town: z.string().optional(),
    country: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
  }),
});
