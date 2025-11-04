import { StatusCodes } from "http-status-codes";
import Raffle from "../ORGANIZER/raffel/raffel.model";
import stripe from "../../config/stripe.config";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import { Charities } from "../ORGANIZER/Charities/Charities.Model";
import mongoose from "mongoose";

interface RaffleUserData {
  userId: string;
  message?: string;
}

interface CharityUserData {
  firstName: string;
  surName?: string;
  email: string;
  message?: string;
}


export const createRafflePaymentIntent = async (
  raffleId: string,
  ticketCount: number,
  userData: RaffleUserData
) => {
  const raffle = await Raffle.findById(raffleId);

  if (!raffle) throw new ApiError(StatusCodes.NOT_FOUND, "Raffle not found!");
  if (raffle.status === "suspended")
    throw new ApiError(StatusCodes.BAD_REQUEST, "The Raffle is Suspended!");


  const currentDate = new Date();
  if (raffle.ticketSaleEndDate && currentDate > new Date(raffle.ticketSaleEndDate)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Ticket sale period is over. You can no longer purchase tickets for this raffle."
    );
  }


  const user = await User.findById(userData.userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");

  const totalAmount = Number(raffle.ticketAmount) * ticketCount;
  const productName = `Raffle Tickets - ${raffle.raffleName}`;

  // Stripe Customer
  const stripeCustomer = await stripe.customers.create({
    name: `${user.name}`,
    email: user.email,
  });

  // Metadata
  const metadata = {
    type: "raffle",
    raffleId: raffle._id.toString(),
    ticketCount: String(ticketCount),
    totalAmount: String(totalAmount),
    userId: user._id.toString(),
    message: userData.message || "",
  };

  // Stripe Checkout Session
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer: stripeCustomer.id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${config.stripe.success_url}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.cancel_url}`,
  });

  return {
    url: stripeSession.url,
    sessionId: stripeSession.id,
  };
};



export const createCharityPaymentIntent = async (
  charityId: string,
  totalAmount: number,
  userData: CharityUserData
) => {
  const charity = await Charities.findById(charityId);
  if (!charity) throw new ApiError(StatusCodes.NOT_FOUND, "Charity not found!");

  if (isNaN(totalAmount) || totalAmount <= 0)
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid donation amount");

  const productName = `Donation for - ${charity.pageTitle}`;

  // Stripe Customer
  const stripeCustomer = await stripe.customers.create({
    name: `${userData.firstName} ${userData.surName || ""}`,
    email: userData.email,
  });

  // Metadata
  const metadata = {
    type: "charity",
    causeId: (charity._id as mongoose.Types.ObjectId).toString(),
    amount: String(totalAmount),
    firstName: userData.firstName,
    surName: userData.surName || "",
    email: userData.email,
    message: userData.message || "",
  };

  // Stripe Checkout Session
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer: stripeCustomer.id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${config.stripe.success_url}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.cancel_url}`,
  });

  return {
    url: stripeSession.url,
    sessionId: stripeSession.id,
  };
};
