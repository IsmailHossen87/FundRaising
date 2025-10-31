import { RafflePurchase } from './../ORGANIZER/raffel/RafflePurchase/purchase.model';
import stripe from '../../config/stripe.config';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import Raffle from '../ORGANIZER/raffel/raffel.model';
import { Charities } from '../ORGANIZER/Charities/Charities.Model';


// const createPaymentIntent = async (
//   raffleId: string,
//   ticket: string,
//   userData: {
//     firstName: string;
//     surName: string;
//     email: string;
//     message?: string;
//   }
// ) => {
//   const raffle = await Raffle.findById(raffleId);
//   if (!raffle) throw new ApiError(StatusCodes.NOT_FOUND, "Raffle not found!");

//   const ticketCount = Number(ticket);
//   const totalAmount = Number(raffle.targetAmount) * ticketCount;

//   const stripeCustomer = await stripe.customers.create({
//     name: `${userData.firstName} ${userData.surName}`,
//     email: userData.email,
//   });

//   const stripeSession = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     customer: stripeCustomer.id,
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: `Raffle Tickets - ${raffle.raffleName}`,
//             description: `${ticketCount} ticket(s) @ $${raffle.amount} each`,
//           },
//           unit_amount: totalAmount * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     metadata: {
//       raffleId,
//       ticketCount: String(ticketCount),
//       totalAmount: String(totalAmount),
//       firstName: userData.firstName,
//       surName: userData.surName,
//       email: userData.email,
//       message: userData.message || "",
//     },
//     success_url: `${config.stripe.success_url}?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${config.stripe.cancel_url}`,
//   });

//   return { url: stripeSession.url, sessionId: stripeSession.id };
// };

// // CHARITY - Create Payment Intent
// const createPaymentIntentCarity = async (
//   causeId: string,
//   amount: string,
//   userData: {
//     firstName: string;
//     surName: string;
//     email: string;
//     message?: string;
//   }
// ) => {
//   const charity = await Charities.findById(causeId);
//   if (!charity) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "Charity not found!");
//   }

//   const DonateAmount = Number(amount);
//   if (isNaN(DonateAmount) || DonateAmount <= 0) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid donation amount");
//   }

//   // ✅ Create Stripe customer only (no DB entry yet)
//   const stripeCustomer = await stripe.customers.create({
//     name: `${userData.firstName} ${userData.surName}`,
//     email: userData.email,
//   });

//   // ✅ Create Stripe Checkout Session
//   const stripeSession = await stripe.checkout.sessions.create({
//     mode: "payment",
//     payment_method_types: ["card"],
//     customer: stripeCustomer.id,
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: `Donation for - ${charity.pageTitle}`,
//           },
//           unit_amount: Math.round(DonateAmount * 100),
//         },
//         quantity: 1,
//       },
//     ],
//     metadata: {
//       causeId: causeId,
//       amount: DonateAmount.toString(),
//       firstName: userData.firstName,
//       surName: userData.surName,
//       email: userData.email,
//       message: userData.message || "",
//     },
//     success_url: `${config.stripe.success_url}?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${config.stripe.cancel_url}`,
//   });

//   return {
//     url: stripeSession.url,
//     sessionId: stripeSession.id,
//   };
// };


// export const createPaymentService = {
//   createPaymentIntent,
//   createPaymentIntentCarity,
// };


interface UserData {
  firstName: string;
  surName: string;
  email: string;
  message?: string;
}

export const createPaymentIntentUnified = async (
  type: "raffle" | "charity",
  id: string,
  amountOrTicket: string,
  userData: UserData
) => {
  let productName = "";
  let totalAmount = 0;
  let metadata: Record<string, string> = {};

  // ✅ Handle Raffle Payment
  if (type === "raffle") {
    const raffle = await Raffle.findById(id);
    if (!raffle)
      throw new ApiError(StatusCodes.NOT_FOUND, "Raffle not found!");

    const ticketCount = Number(amountOrTicket);
    totalAmount = Number(raffle.targetAmount) * ticketCount;

    productName = `Raffle Tickets - ${raffle.raffleName}`;

    metadata = {
      type,
      raffleId: id,
      ticketCount: String(ticketCount),
      totalAmount: String(totalAmount),
      firstName: userData.firstName,
      surName: userData.surName,
      email: userData.email,
      message: userData.message || "",
    };
  }
  // ✅ Handle Charity Payment
  else if (type === "charity") {
    const charity = await Charities.findById(id);
    if (!charity)
      throw new ApiError(StatusCodes.NOT_FOUND, "Charity not found!");

    const DonateAmount = Number(amountOrTicket);
    if (isNaN(DonateAmount) || DonateAmount <= 0)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid donation amount");

    totalAmount = DonateAmount;
    productName = `Donation for - ${charity.pageTitle}`;

    metadata = {
      type,
      causeId: id,
      amount: String(totalAmount),
      firstName: userData.firstName,
      surName: userData.surName,
      email: userData.email,
      message: userData.message || "",
    };
  }


  // ✅ Create Stripe Customer
  const stripeCustomer = await stripe.customers.create({
    name: `${userData.firstName} ${userData.surName}`,
    email: userData.email,
  });

  // ✅ Create Stripe Checkout Session☑️☑️☑️☑️☑️☑️☑️☑️☑️
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
