import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import config from '../../../config';
import stripe from '../../config/stripe.config';
import ApiError from '../../../errors/ApiError';
 
const webhookHandler = async (req: Request, res: Response): Promise<void> => {
     console.log('Webhook received');
     const sig = req.headers['stripe-signature'];
     const webhookSecret = config.stripe.stripe_webhook_secret;
 
     if (!webhookSecret) {
          console.error('Stripe webhook secret not set');
          res.status(500).send('Webhook secret not configured');
          return;
     }
 
     let event: Stripe.Event;
 
     try {
          event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
     } catch (err: any) {
          console.error('Webhook signature verification failed:', err.message);
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
     }
 
     console.log('event.type', event.type);
     try {
          switch (event.type) {
               case 'checkout.session.completed':
                    await handlePaymentSucceeded(event.data.object);
                    break;
               case 'transfer.created':
                    await handleTransferCreated(event.data.object);
                    break;
               default:
                    console.log(`Unhandled event type: ${event.type}`);
                    break;
          }
 
          // Responding after handling the event
          res.status(200).json({ received: true });
     } catch (err: any) {
          console.error('Error handling the event:', err);
          res.status(500).send(`Internal Server Error: ${err.message}`);
     }
};
 
export default webhookHandler;
 
// Function for handling a successful payment
const handlePaymentSucceeded = async (session: Stripe.Checkout.Session) => {
     try {
          const { ...metadata }: any = session.metadata;
 
          
          const paymentIntent = session.payment_intent as string;
          console.log('=============================');
          console.log('paymentIntent : 2', paymentIntent);
          
          console.log('isPaymentExist : 3');
          
 
          
 
          console.log('newPayment : 11');
 
          
     } catch (error) {
          console.error('Error in handlePaymentSucceeded:', error);
     }
};
 
// handleTransferCreated
const handleTransferCreated = async (transfer: Stripe.Transfer) => {
     try {
          console.log(`Transfer for user ${transfer.destination} created`);
 
     } catch (error) {
          console.error('Error in handleTransferCreated:', error);
     }
};
 
 