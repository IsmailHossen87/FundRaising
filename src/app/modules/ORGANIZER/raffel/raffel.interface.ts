import { Date, Types } from 'mongoose';

interface IPackage {
  ticketType?: "Premium" | "Standard" | "Basic",
  ticketQuantity?: number,
  ticketAmount?: number,
}

export type IRaffle = {
  userId: Types.ObjectId;
  monthName?: string,
  package?: IPackage,
  raffleName: string;
  organizer?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  targetAmount: number;
  causeId?: Types.ObjectId;
  ticketSaleStartDate: Date;
  ticketSaleEndDate: Date;
  drawDate: Date;
  status: 'active' | 'suspended' | "closed";
  buyerMessage: String[],
  image: string;
  draw: "pending" | "success"
  raffleDescription: string;
  prizes: string;
  ticketAmount: number;
  amount: number;
  sold: number,
  ticketBuyers: Types.ObjectId[];
};

