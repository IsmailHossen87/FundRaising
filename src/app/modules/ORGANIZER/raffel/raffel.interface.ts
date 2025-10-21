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
  status: 'active' | 'closed';
  image: string;
  raffleDescription: string;
  prizes: string;
  creator:Types.ObjectId;
  sold: number;
  amount: number;
};
