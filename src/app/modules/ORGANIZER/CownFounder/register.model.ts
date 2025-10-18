import { Model, model, Schema } from "mongoose"
import { ICrowdfunder } from "./register.interface"
import ApiError from "../../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import config from "../../../../config";

function slugify(input: string) {
return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

const CrowdfunderSchema = new Schema<ICrowdfunder>(
{
userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
firstName: { type: String, required: true, trim: true },
lastName: { type: String, required: true, trim: true },
pageTitle: { type: String, required: true, trim: true },
pageSlug: { type: String, required: true, unique: true, index: true },
email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
password: { type: String, required: true },
goalAmount: { type: Number, required: true, min: 1 },
fundraiserType: { type: String, enum: ["crowdfunder", "personal"], required: true },
beneficiaryFor: { type: String, enum: ["self", "family", "friend", "charity", "other"], required: true },
coverImage: { type: String },
description: { type: String, required: true },
referralSource: { type: String, enum: ["google", "facebook", "youtube", "tiktok", "twitter", "friend", "event", "blog", "other"] },
eircode: { type: String },
phoneCountryCode: { type: String, required: true },
phone: { type: String, required: true },
status: { type: String, enum: ["Active", "Pending", "Rejected"], default: "Pending" },
termsAccepted: { type: Boolean, required: true, default: true }
},
{ timestamps: true,versionKey:false }
)



// Create Slug
CrowdfunderSchema.pre("validate", async function (next) {
  if (!this.pageSlug && this.pageTitle) {
    const base = slugify(this.pageTitle);
    let candidate = base;
    let i = 0;
    const CrowdfunderModelTemp = this.constructor as Model<ICrowdfunder>;
    while (await CrowdfunderModelTemp.exists({ pageSlug: candidate })) {
      i += 1;
      candidate = `${base}-${i}`;
    }
    this.pageSlug = candidate;
  }
  next();
});

// match password
CrowdfunderSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

// pre-save hook
CrowdfunderSchema.pre('save', async function (next) {
  const isExist = await CrowdfunderModel.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists!');
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const CrowdfunderModel = model<ICrowdfunder>("Crowdfunder", CrowdfunderSchema)