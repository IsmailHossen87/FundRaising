import { RafflePurchase } from './../app/modules/ORGANIZER/raffel/RafflePurchase/purchase.model';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import crypto from 'crypto';
import Raffle, {
  Allticket,
} from '../app/modules/ORGANIZER/raffel/raffel.model';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { Dooner } from '../app/modules/ORGANIZER/Charities/Donner.model';
import { Charities } from '../app/modules/ORGANIZER/Charities/Charities.Model';
import { emailTemplate } from '../shared/emailTemplate';
import { emailHelper } from '../helpers/emailHelper';
import mongoose from 'mongoose';

const paymentSuccess = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Payment completed successfully',
  });
};
export const paymentCancel = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Payment completed successfully',
  });
};

// GENERATE ticket COde
const generateTicketCode = (userId: string, raffleId: string): string => {
  const base = userId + raffleId + Math.random().toString();
  const hash = crypto.createHash('sha256').update(base).digest('hex');
  return hash.substring(0, 6).toUpperCase();
};

// RAFFLE
const handleRaffleBuy = async (session: Stripe.Checkout.Session) => {
  try {
    const {
      raffleId,
      ticketCount,
      totalAmount,
      firstName,
      surName,
      email,
      message,
    }: any = session.metadata;

    const raffle = await Raffle.findById(raffleId);
    if (!raffle) throw new ApiError(StatusCodes.NOT_FOUND, "Raffle not found!");

    const ticket = Number(ticketCount);
    const TotalAmount = Number(totalAmount);

    // ✅ Create verified buyer only after payment success
    const buyer = await RafflePurchase.create({
      raffleId: [raffle._id],
      firstName,
      surName,
      email,
      message,
      ticket,
      totalAmount: TotalAmount,
      paymentStatus: "completed",
      verified: true, 
      stripeSessionId: session.id,
    });

    // 🎯 Update raffle info
    await Raffle.findByIdAndUpdate(raffleId, {
      $inc: { sold: ticket, amount: TotalAmount },
      $addToSet: { ticketBuyers: buyer._id },
    });

    // 🎟️ Generate tickets
    const generatedTickets = Array.from({ length: ticket }, () =>
      generateTicketCode(buyer._id.toString(), raffle._id.toString())
    );

    await Allticket.insertMany(
      generatedTickets.map((code) => ({
        userId: buyer._id,
        raffleId: raffle._id,
        uniqueCode: code,
        drawDate: raffle.drawDate,
      }))
    );

    // ✉️ Send confirmation email
    const value = {
      name: buyer.firstName,
      email: buyer.email,
      totalTicket: ticketCount,
      TotalTaka: TotalAmount,
      ticketCodes: generatedTickets,
    };
    const CongratulationEmail = emailTemplate.raffleConfirmation(value);
    await emailHelper.sendEmail(CongratulationEmail);

    console.log("✅ Buyer created & verified after payment!");
  } catch (error) {
    console.error("❌ Error in handleRaffleBuy:", error);
    throw new ApiError(StatusCodes.BAD_REQUEST, "Raffle purchase failed");
  }
};


// DONATE - Payment Success Handler
const handleDonate = async (session: Stripe.Checkout.Session) => {
  const {
    causeId,
    amount,
    firstName,
    surName,
    email,
    message,
  }: any = session.metadata;

  try {
    // ✅ 1. Create verified donor after payment success
    const donor = await Dooner.create({
      firstName,
      surName,
      email,
      message,
      totalAmount: Number(amount),
      paymentStatus: "completed",
      verified: true,
      causeId: new mongoose.Types.ObjectId(causeId),
      stripeSessionId: session.id,
      paymentIntentId: session.payment_intent,
    });

    // ✅ 2. Update Charity collection
    const charity = await Charities.findByIdAndUpdate(
      causeId,
      {
        $inc: { Totalcollection: Number(amount) },
        $addToSet: { donner: donor._id },
      },
      { new: true }
    );

    if (!charity) throw new ApiError(StatusCodes.NOT_FOUND, "Charity not found");

    // ✅ 3. Send confirmation email
    const values = {
      name: `${donor.firstName} ${donor.surName}`,
      email: donor.email,
      amount: donor.totalAmount,
      causeName: charity.pageTitle || charity.causeName,
      causeImage: charity.coverImage,
    };

    const CongratulationEmail = emailTemplate.donationConfirmation(values);
    await emailHelper.sendEmail(CongratulationEmail);

    console.log("✅ Donation successful, donor created & verified!");
  } catch (error) {
    console.error("❌ Error in handleDonate:", error);
    throw new ApiError(StatusCodes.BAD_REQUEST, "Donation processing failed");
  }
};


export const handlePayment = {
  paymentSuccess,
  paymentCancel,
  handleRaffleBuy,
  handleDonate,
};
