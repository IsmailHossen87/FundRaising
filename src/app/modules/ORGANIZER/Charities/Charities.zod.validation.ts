import { z } from 'zod';

// ✅ Create Cause Validation

export const createCauseZodSchema = z.object({
  body: z.object({
    causeName: z.string({ required_error: 'Cause name is required' }),
    type: z.enum(['Charity', 'cowdFounder']),
    registrationNumber: z.string().optional(),
    category: z.enum(['School', 'Club', 'Charity'], {
      required_error: 'Category is required',
    }),
    bankDetails: z.string({ required_error: 'Bank details are required' }),
    date: z.coerce.date({ required_error: 'Date is required' }),
    addressLine1: z.string({ required_error: 'Address line 1 is required' }),
    addressLine2: z.string().optional(),
    town: z.string({ required_error: 'Town is required' }),
    country: z.string({ required_error: 'Country is required' }),
    charityEmail: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    charityPhone: z.string({ required_error: 'Phone number is required' }),
    description: z.string().optional(),
    contractInfo: z.object({
      ContractName: z.string({ required_error: 'Contract name is required' }),
      ContractNumber: z.string({ required_error: 'Phone number is required' }),
      ContractEmail: z.string({
        required_error: ' Contract email is required',
      }),
    }),
  }),
});

// ✅ Update Cause Validation
export const updateCauseZodSchema = z.object({
  body: z.object({
    causeName: z.string().optional(),
    registrationNumber: z.string().optional(),
    category: z.enum(['School', 'Club', 'Charity']).optional(),
    campaignId: z.string().optional(),
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

export const createCrowdfunderZodSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    pageTitle: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    goalAmount: z.coerce.number().positive(),
    type: z.enum(['Charity', 'cowdFounder']),
    beneficiaryFor: z.enum(['self', 'family', 'friend', 'charity', 'other']),
    description: z.string().min(20),
    referralSource: z
      .enum([
        'google',
        'facebook',
        'youtube',
        'tiktok',
        'twitter',
        'friend',
        'event',
        'blog',
        'other',
      ])
      .optional(),
    phoneCountryCode: z.string().min(1),
    phone: z.string().min(6),
    termsAccepted: z.literal(true),
  }),
});
