import { Schema, model, Types } from 'mongoose';

const raffleSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    raffleName: {
      type: String,
      required: true,
    },
    organizer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    causeId: {
      type: Schema.Types.ObjectId,ref:"Charities" ,
      required: true,
    },
    ticketSaleEndDate: {
      type: Date,
      required: true,
    },
    drawDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    image: {
      type: String, 
      required: true,
    },
    raffleDescription: {
      type: String,
      required: true,
    },
    prizes: {
      type: String,
      required: true,
    },
     creator: {
      type: Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    sold: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    ticketBuyers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true, versionKey:false
  }
);

const Raffle = model('Raffle', raffleSchema);

export default Raffle;
