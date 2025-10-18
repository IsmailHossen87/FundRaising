import { Document, Types } from "mongoose"

export type FundraiserType = "crowdfunder" | "personal"
export type BeneficiaryFor = "self" | "family" | "friend" | "charity" | "other"
export type ReferralSource = "google" | "facebook" | "youtube" | "tiktok" | "twitter" | "friend" | "event" | "blog" | "other"
export type CampaignStatus = "Active" | "Pending" | "Rejected"

export interface ICrowdfunder extends Document {
userId: Types.ObjectId
firstName: string
lastName: string
pageTitle: string
pageSlug: string
email: string
password: string
goalAmount: number
fundraiserType: FundraiserType
beneficiaryFor: BeneficiaryFor
coverImage?: string
description: string
referralSource?: ReferralSource
eircode?: string
phoneCountryCode: string
phone: string
status: CampaignStatus
termsAccepted: boolean
}