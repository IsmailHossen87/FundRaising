import { Document, Types } from "mongoose";

export type FundraiserType = "crowdfunder" | "personal";
export type BeneficiaryFor = "self" | "family" | "friend" | "charity" | "other";
export type ReferralSource =
  | "google"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "friend"
  | "event"
  | "blog"
  | "other";
export type CampaignStatus = "Active" | "Pending" | "Rejected";

export interface ICause extends Document {
  // Common
  userId: Types.ObjectId;
  status: CampaignStatus;
  coverImage?: string;
  description?: string;

  // Crowdfunder fields
  firstName?: string;
  lastName?: string;
  pageTitle?: string;
  pageSlug?: string;
  type:"cowdFounder" | "Charity",
  email?: string;
  password?: string;
  goalAmount?: number;
  fundraiserType?: FundraiserType;
  beneficiaryFor?: BeneficiaryFor;
  referralSource?: ReferralSource;
  eircode?: string;
  phoneCountryCode?: string;
  phone?: string;
  termsAccepted?: boolean;

  // Cause fields
  causeName?: string;
  registrationNumber?: string;
  category?: "School" | "Club" | "Charity";
  bankDetails?: string;
  date?: Date;
  addressLine1?: string;
  addressLine2?: string;
  campaignId?: string;
  town?: string;
  country?: string;
  charityEmail?: string;
  charityPhone?: string;
  contractInfo?: {
    ContractName: string;
    ContractNumber: string;
    ContractEmail: string;
  };
}
