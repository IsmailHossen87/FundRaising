import { Document, Types } from "mongoose";

export interface ICause extends Document { 
  cownfounderId:Types.ObjectId,
  causeName: string;
  registrationNumber?: string;
  category: "School" | "Club" | "Charity";
  status:"Active"| "Pending" | "Rejected",
  bankDetails: string;
  date:Date,
  addressLine1: string;
  addressLine2?: string;
  town: string;
  country: string;
  charityEmail: string;
  charityPhone: string;
  coverImage: string;
  description?: string;
  contractInfo:{
    ContractName:string,
    ContractNumber:string,
    ContractEmail:string
  }
}
