// import { Stripe } from './../../../../node_modules/stripe/types/index.d';
// import { User } from "../user/user.model";
// import stripe from "../../config/stripe.config";
// import ApiError from "../../../errors/ApiError";
// import { StatusCodes } from "http-status-codes";
// import config from '../../../config';

// const createPaymentIntent = async (event: string, userId: string) => {
//   const isExistEvent = await Event.findById(event);
//   if (!isExistEvent) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Event not found!');
//   }
//   const thisCustomer = await User.findById(userId);
//   const stripeCustomer = await stripe.customers.create({
//     name: thisCustomer?.name,
//     email: thisCustomer?.email,
//   });

//   const userUpdate = await User.updateOne(
//     { _id: thisCustomer?._id },
//     { $set: { 'stripeAccountInfo.stripeCustomerId': stripeCustomer.id } }
//   );
//   const stripeSessionData: any = {
//     payment_method_types: ['card'],
//     mode: 'payment',
//     customer: stripeCustomer.id,
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: { name: 'Booking Payment' },
//           unit_amount: isExistEvent.price * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     metadata: {
//       user: userId.toString(),
//       event: isExistEvent._id.toString(),
//       amount: isExistEvent.price,
//       creator: isExistEvent.creator.toString(),
//     },
//     success_url: `${config.stripe.success_url}`,
//     cancel_url: config.stripe.cancel_url,
//   };

//   const stripeSession = await Stripe.checkout.sessions.create(
//     stripeSessionData
//   );
//   return { message: 'Redirect to payment', url: stripeSession.url };
// };


// export const createPaymentService ={createPaymentIntent}



import { User } from "../user/user.model";
import stripe from "../../config/stripe.config";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const createPaymentIntent = async (userId: string) => {
  // ✅ শুধু user থেকে customer তৈরি 
  const thisCustomer = await User.findById(userId);
  if (!thisCustomer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // ✅ Stripe customer তৈরি
  const stripeCustomer = await stripe.customers.create({
    name: thisCustomer.name,
    email: thisCustomer.email,
  });

  // ✅ User এর stripe info update
  await User.updateOne(
    { _id: thisCustomer._id },
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
          product_data: { name: "Test Payment" },
          unit_amount: 1000, 
        },
        quantity: 1,
      },
    ],
    metadata: {
      user: userId.toString(),
      purpose: "test-payment",
    },
    success_url: config.stripe.success_url,
    cancel_url: config.stripe.cancel_url,
  });

  return { message: "Redirect to payment", url: stripeSession.url };
};

export const createPaymentService = { createPaymentIntent };
