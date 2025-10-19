import { model, Schema, Types } from "mongoose";
import { IfundRaise } from "./fundRaise.interface";

const fundRaiseSchema = new Schema<IfundRaise>({
  charityId: { type: Schema.Types.ObjectId, ref: "Charities" },
  title: { type: String, default: "" },
  type: {
    type: String,
    enum: ["simple", "event", "memorial", "celebration"],
    required: true
  },
  targetAmount: { type: Number, required: true },
  image: { type: String },
  memoryOf: { type: String }, 
  celebrationFor: { type: String }, 
  celebrationDate: { type: Date }, 
}, {
  timestamps: true,
  versionKey: false
});

export const Funding = model<IfundRaise>("Funding", fundRaiseSchema);
