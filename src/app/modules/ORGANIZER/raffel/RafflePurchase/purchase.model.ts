import { Schema, model } from 'mongoose';


const rafflePurchaseSchema = new Schema(
  {
    raffleId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Raffle',
        required: true,
      },
    ],
    firstName: {
      type: String,
      required: true,
    },
    surName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    verified: { type: Boolean, default: false },
    message: String,
    ticket: {
      type: Number,
      required: true,
    },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
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

export const RafflePurchase = model('RafflePurchase', rafflePurchaseSchema);
