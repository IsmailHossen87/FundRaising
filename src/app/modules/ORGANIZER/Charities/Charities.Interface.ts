import { Document, Types } from 'mongoose';

export type FundraiserType = 'crowdfunder' | 'personal';
export type BeneficiaryFor = 'self' | 'family' | 'friend' | 'charity' | 'other';
export type ReferralSource =
  | 'google'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'twitter'
  | 'friend'
  | 'event'
  | 'blog'
  | 'other';
export type CampaignStatus = 'Active' | 'Pending' | 'Rejected';

export interface ICause extends Document {
  // Common
  userId: Types.ObjectId;
  donner: Types.ObjectId[];
  fundRaiser: Types.ObjectId[];
  raffleId: Types.ObjectId[];
  status: CampaignStatus;
  coverImage?: string;
  description?: string;

  // Crowdfunder fields
  // firstName?: string;
  // lastName?: string;
  // email?: string;
  // password?: string;

  pageTitle?: string;
  pageSlug?: string;
  type: 'crowdfunder' | 'Charity';
  goalAmount?: number;
  fundraiserType?: FundraiserType;
  beneficiaryFor?: BeneficiaryFor;
  referralSource?: ReferralSource;
  phoneCountryCode?: string;
  phone?: string;
  termsAccepted?: boolean;
  Totalcollection?: number;

  role: 'ORGANIZER';

  // Cause fields
  causeName?: string;
  registrationNumber?: string;
  category?: 'School' | 'Club' | 'Charity';
  bankDetails?: string;
  addressLine1?: string;
  addressLine2?: string;
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
