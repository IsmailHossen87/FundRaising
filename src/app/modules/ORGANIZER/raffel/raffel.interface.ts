import { Date, Model, Types } from 'mongoose';

export type IRaffle = {
  userId:Types.ObjectId
  raffleName: string;
  sold: number;
  amount: number;
  date: Date;
  status: 'active' | 'closed';
};

export type RaffleModel = Model<IRaffle>;
