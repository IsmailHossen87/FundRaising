import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export interface IAuthProvider {
  provider: 'google' | 'credentials';
  providerId: string;
}

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  image?: string;
  bio?: string;
  status: 'Active' | 'Blocked';
  verified: boolean;

  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
  };
  // for raffle
  ticket?: number;
  raffleId: Types.ObjectId[];
  auths: IAuthProvider[];
  totalAmount: Number;

  address?: {
    country?: string;
    city?: string;
    postalCode?: string;
    street?: string;
  };
  // StripeAccountInfo
  stripeAccountInfo?: {
    stripeCustomerId?: string;
    loginUrl?: string;
  } | null;
  location?: string;
  joinedDate: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number | null;
    expireAt: Date | null;
  };
  paymentIntentId: String;
  stripeSessionId: String;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
