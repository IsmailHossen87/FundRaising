import { Document, Types } from "mongoose";

export interface ICause extends Document { 
  userId:Types.ObjectId,
  causeName: string;
  registrationNumber?: string;
  category: "School" | "Club" | "Charity";
  bankDetails: string;
  addressLine1: string;
  addressLine2?: string;
  town: string;
  country: string;
  email: string;
  phone: string;
  coverImage?: string;
  description?: string;
}
