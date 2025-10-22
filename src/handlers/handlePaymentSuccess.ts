import { Request, Response } from 'express';
import Stripe from 'stripe';

// Payment success controller
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

// MAIN
const handleRaffleBuy = async (session: Stripe.Checkout.Session) => {
  try {
    const { user, raffleId, amount }: any = session.metadata;
    const paymentIntent = session.payment_intent as string;
    console.log('=============================');

    console.log([user, raffleId, amount]);
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error);
  }
};

export const handlePayment ={paymentSuccess,paymentCancel,handleRaffleBuy}






