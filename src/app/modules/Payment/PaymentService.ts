import { User } from "../user/user.model";
import stripe from "../../config/stripe.config";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import Raffle from "../ORGANIZER/raffel/raffel.model";

const createPaymentIntent = async ( paramsId:string,userId: string) => { 

  const user = await User.findById(userId);
  const raffle = await Raffle.findById(paramsId) 

                                                                                           

  if (!raffle) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Raffle not found!");
  }
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // ✅ Stripe customer তৈরি
  const stripeCustomer = await stripe.customers.create({
    name: user.name,
    email: user.email,
  });

  // ✅ User এর stripe info update
  await User.updateOne(
    { _id: user._id },
    { $set: { "stripeAccountInfo.stripeCustomerId": stripeCustomer.id } }
  );

  // ✅ Test data দিয়ে checkout session তৈরি
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer: stripeCustomer.id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Raffle Payment" },
          unit_amount: Number(raffle.amount) * 100 , 
        },
        quantity: 1,
      },
    ],
    metadata: {
      user: userId.toString(),
      raffleId:raffle._id.toString(),
      amount:raffle.amount,
      // creator: raffle.creator.toString(),
    },
   
    success_url: config.stripe.success_url,
    cancel_url: config.stripe.cancel_url,
  });

  return { message: "Redirect to payment", url: stripeSession.url };
};

export const createPaymentService = { createPaymentIntent };
