// organizerStripeAccountId

import stripe from "../../config/stripe.config";
import { TransactionHistories } from "../TransactionHistory/transaction.model";

// paymentStatus: completed
// payoutStatus: pending | paid
// payoutDate
const payOrganizer = async (transactionId: string) => {
  const transaction = await TransactionHistories.findById(transactionId);

  if (!transaction) throw new Error("Transaction not found");

  if (transaction.payoutStatus === "paid") {
    throw new Error("Already paid");
  }

  await stripe.transfers.create({
    amount: Math.round(transaction.raffleCreatorAmount * 100),
    currency: "usd",
    destination: transaction.organizerStripeAccountId,
  });

  transaction.payoutStatus = "paid";
  transaction.payoutDate = new Date();
  await transaction.save();

  return transaction;
};

export const payoutService = {
  payOrganizer,
};