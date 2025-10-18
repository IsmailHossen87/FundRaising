import { Schema, model } from "mongoose";
import { ICause } from "./Charities.Interface";


const causeSchema = new Schema<ICause>(
  { 
    cownfounderId:{type:Schema.Types.ObjectId,ref:"Crowdfunder",required:true},
    causeName: { type: String, required: true, trim: true },
    registrationNumber: { type: String },
    category: {
      type: String,
      enum: ["School", "Club", "Charity"],
      required: true,
    },
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
    charityEmail: { type: String, required: true },
    charityPhone: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
    contractInfo:{
      ContractName:{type:String ,default:""},
      ContractEmail:{type:String ,default:""},
      ContractNumber:{type:String ,default:""}
    }

  },
  { timestamps: true, versionKey: false }
);

export const Cause = model<ICause>("Charities", causeSchema);
