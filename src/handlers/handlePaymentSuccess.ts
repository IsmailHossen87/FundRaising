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
    const { raffleId, purchaseId, ticketCount, totalAmount }: any =
      session.metadata;

    const ticket = Number(ticketCount);
    const TotalAmount = Number(totalAmount);

    // 🛒 Update purchase
    const updatedPurchase = await RafflePurchase.findByIdAndUpdate(
      purchaseId,
      {
        paymentStatus: 'completed',
        paymentIntentId: session.payment_intent,
        ticket,
      },
      { new: true }
    );

    if (!updatedPurchase) {
      console.warn('❌ Purchase not found, skipping update', { purchaseId });
      return;
    }

    // 🎯 Update raffle info
    const updatedRaffle = await Raffle.findByIdAndUpdate(
      raffleId,
      {
        $inc: { sold: ticket, amount: TotalAmount },
        $addToSet: { ticketBuyers: updatedPurchase._id },
      },
      { new: true }
    );

    if (!updatedRaffle) {
      console.warn('❌ Raffle not found, skipping update', { raffleId });
      return;
    }

    // 🎟️ Generate tickets
    const generatedTickets = Array.from({ length: ticket }, () =>
      generateTicketCode(
        updatedPurchase._id.toString(),
        updatedRaffle._id.toString()
      )
    );
    // 🎫 Create multiple ticket entries
    const ticketsToInsert = generatedTickets.map(code => ({
      userId: purchaseId,
      raffleId: raffleId,
      uniqueCode: code,
      drawDate: updatedRaffle.drawDate,
    }));

    await Allticket.insertMany(ticketsToInsert);

    // ✉️ Send confirmation email
    const taka = TotalAmount.toString();
    const value = {
      name: updatedPurchase.firstName,
      email: updatedPurchase.email,
      totalTicket: ticketCount,
      TotalTaka: taka,
       ticketCodes: generatedTickets,
    };

    const CongratulationEmail = emailTemplate.raffleConfirmation(value);
    await emailHelper.sendEmail(CongratulationEmail);

    console.log('✅ Raffle purchase completed successfully!');
  } catch (error) {
    console.error('❌ Error in handleRaffleBuy:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Raffle purchase failed');
  }
};

// DONATE
const handleDonate = async (session: Stripe.Checkout.Session) => {
  const { causeId, doonerId, totalAmount }: any = session.metadata;

  try {
    const updateDonnerInfo = await Dooner.findByIdAndUpdate(
      doonerId,
      {
        paymentStatus: 'completed',
        paymentIntentId: session.payment_intent,
        totalAmount: Number(totalAmount),
      },
      { new: true }
    );

    if (!updateDonnerInfo) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Donner not Available');
    }

    const charity = await Charities.findByIdAndUpdate(causeId, {
      $inc: { Totalcollection: Number(totalAmount) },
      $addToSet: { donner: updateDonnerInfo._id },
    });
    if (!charity) {
      throw new Error('Charity not found');
    }

    const values = {
      name: updateDonnerInfo.surName,
      email: updateDonnerInfo.email,
      amount: updateDonnerInfo.totalAmount,
      causeName: charity.causeName,
      causeImage: charity.coverImage,
    };
    const CongratulationEmail = emailTemplate.donationConfirmation(values);
    await emailHelper.sendEmail(CongratulationEmail);
  } catch (error) {
    console.error(error);
  }
};

export const handlePayment = {
  paymentSuccess,
  paymentCancel,
  handleRaffleBuy,
  handleDonate,
};
