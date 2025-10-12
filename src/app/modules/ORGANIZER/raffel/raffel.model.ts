import { Schema, model } from 'mongoose';
import { IRaffle, RaffleModel } from './raffel.interface';


const raffleSchema = new Schema<IRaffle, RaffleModel>(
  { 
    userId: {
        type:Schema.Types.ObjectId,ref:"User",required:true
    },
    raffleName: {
      type: String,
      required: true,
      trim: true,
    },
    sold: {
      type: Number,
      required: true,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default:Date.now
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true, versionKey: false }
);

export const Raffle = model<IRaffle, RaffleModel>('Raffle', raffleSchema);
