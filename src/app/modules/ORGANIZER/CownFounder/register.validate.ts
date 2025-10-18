import { z } from "zod"

export const createCrowdfunderZodSchema = z.object({
body: z.object({
firstName: z.string().min(1),
lastName: z.string().min(1),
pageTitle: z.string().min(3),
email: z.string().email(),
password: z.string().min(6),
goalAmount: z.coerce.number().positive(),
fundraiserType: z.enum(["crowdfunder", "personal"]),
beneficiaryFor: z.enum(["self", "family", "friend", "charity", "other"]),
description: z.string().min(20),
referralSource: z.enum(["google", "facebook", "youtube", "tiktok", "twitter", "friend", "event", "blog", "other"]).optional(),
eircode: z.string().optional(),
phoneCountryCode: z.string().min(1),
phone: z.string().min(6),
termsAccepted: z.literal(true)
})
})