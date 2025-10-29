import { Schema, model } from "mongoose";
import { Document, Types } from "mongoose";

export interface IDooner extends Document {
  _id:string,
  firstName: string;
  surName: string;
  email: string;
  message?: string;
  totalAmount: number;
  paymentStatus: "pending" | "success" | "failed";
  causeId: Types.ObjectId;
  stripeCustomerId?: string;   
  stripeSessionId?: string;   
  paymentIntentId?: string;  
  SessionCreateParams?:string  
}




const doonerSchema = new Schema<IDooner>(
  {
    causeId: {
      type: Schema.Types.ObjectId,
      ref: "Charities",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    surName: {
      type: String,
      required: true,
    },

    message: {type:String},
    email: {type:String , requred:true},
    totalAmount: {type:Number,default:0},
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentIntentId: String,
    stripeSessionId: String,
  },
  { timestamps: true, versionKey: false }
);

export const Dooner = model("Dooner", doonerSchema);