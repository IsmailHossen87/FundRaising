import { Schema, model } from "mongoose";
import { ICause } from "./Charities.Interface";


const causeSchema = new Schema<ICause>(
  { 
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    causeName: { type: String, required: true, trim: true },
    registrationNumber: { type: String },
    category: {
      type: String,
      enum: ["School", "Club", "Charity"],
      required: true,
    },
    campaignId:{type:String,default:""},
    status: {
      type: String,
      enum: ["Active","Pending" , "Rejected"],
      default:"Pending",
    },
    date: { type: Date, default:Date.now },
    bankDetails: { type: String, required: true },
    addressLine1: { type: String, default:"" },
    addressLine2: { type: String,default:""},
    town: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Cause = model<ICause>("Charities", causeSchema);
