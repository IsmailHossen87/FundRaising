import { Date, Model, Types } from 'mongoose';

export type IRaffle = {
  userId: Types.ObjectId;
  raffleName: string;
  organizer: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  targetAmount: number;
  causeId: Types.ObjectId;
  ticketSaleEndDate: Date;
  drawDate: Date;
  status: 'active' | 'suspended' | "closed";
  buyerMessage:String[],
  image: string;
  draw:"pending" | "success"
  raffleDescription: string;
  prizes: string;
  targetsold: number;
  amount: number;
  sold:number,
  ticketBuyers: Types.ObjectId[];
};
