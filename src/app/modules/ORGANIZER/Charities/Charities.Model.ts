import { Schema, model } from 'mongoose';
import { ICause } from './Charities.Interface';
import { boolean } from 'zod';

const causeSchema = new Schema<ICause>(
  {
    // Common fields
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fundRaiser: [{ type: Schema.Types.ObjectId, ref: 'Funding' }],
    donner: [{ type: Schema.Types.ObjectId, ref: 'Dooner' }],
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Rejected'],
      default: 'Pending',
    },
    coverImage: { type: String },
    description: { type: String },

    pageTitle: { type: String },
    pageSlug: { type: String },
    type: {
      type: String,
      enum: ['cowdFounder', 'Charity'],
      required: true,
    },

    Totalcollection: { type: Number, default: 0 },

    goalAmount: { type: Number },
    fundraiserType: {
      type: String,
      enum: ['crowdfunder', 'personal'],
    },
    beneficiaryFor: {
      type: String,
      enum: ['self', 'family', 'friend', 'charity', 'other'],
    },
    referralSource: {
      type: String,
      enum: [
        'google',
        'facebook',
        'youtube',
        'tiktok',
        'twitter',
        'friend',
        'event',
        'blog',
        'other',
      ],
    },
    phoneCountryCode: { type: String },
    phone: { type: String },
    termsAccepted: { type: Boolean, default: true },

    // Cause fields
    causeName: { type: String },
    registrationNumber: { type: String },
    category: {
      type: String,
      enum: ['School', 'Club', 'Charity'],
    },
    bankDetails: { type: String },
    date: { type: Date, default: Date.now },
    addressLine1: { type: String },
    addressLine2: { type: String },
    town: { type: String },
    country: { type: String },
    charityEmail: { type: String },
    charityPhone: { type: String },
    contractInfo: {
      ContractName: { type: String },
      ContractNumber: { type: String },
      ContractEmail: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Charities = model<ICause>('Charities', causeSchema);
