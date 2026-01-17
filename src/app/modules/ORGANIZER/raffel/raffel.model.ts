import { Schema, model, Types } from 'mongoose';
import { string } from 'zod';

const packageSchema = new Schema({
  ticketType: { type: String, enum: ['Premium', 'Standard', 'Basic'] },
  ticketQuantity: { type: Number },
  ticketAmount: { type: Number },
}, { _id: false })

const raffleSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', },
    raffleName: { type: String },
    monthName: { type: String },
    package: { type: packageSchema },
    organizer: {
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
    ticketAmount: { type: Number },
    causeId: { type: Schema.Types.ObjectId, ref: 'Charities', },
    ticketSaleStartDate: { type: Date },
    ticketSaleEndDate: { type: Date },
    drawDate: { type: Date },
    status: { type: String, enum: ['active', 'suspended', "closed"], default: 'active', },
    image: { type: String, },
    raffleDescription: { type: String, },
    prizes: { type: String, },
    targetsold: { type: Number, default: 0 },
    buyerMessage: [{ type: String }],
    amount: { type: Number, default: 0, },
    draw: { type: String, enum: ['pending', 'successs'], default: "pending" },
    sold: { type: Number, default: 0 },
    ticketBuyers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Raffle = model('Raffle', raffleSchema);





const AllTicket = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    raffleId: { type: Types.ObjectId, ref: 'Raffle', required: true },
    uniqueCode: { type: String, },
    winner: { type: Boolean, default: false },
    drawDate: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export const Allticket = model('Allticket', AllTicket);

export default Raffle;
