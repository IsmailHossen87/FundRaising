import mongoose, { Schema, Types } from "mongoose";

type ObjectId = string;

// Enum for payment status
enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

// Enum for payment method
enum PaymentMethod {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer'
}

// Interface for the payment/raffle entry
interface IRafflePayment {
    _id: ObjectId;
    type: 'charity' | 'raffle';
    charityId: Types.ObjectId;
    charityUserId: Types.ObjectId;
    buyerId: Types.ObjectId;
    raffleId: Types.ObjectId;
    totalPaidAmount: number;
    charityOwnerAmount: number;
    platformAdminAmount: number;
    raffleCreatorAmount: number;
    platformFee: number;
    paymentMethod: PaymentMethod;
    paymentStatus: "pending" | "completed" | "failed";
    transactionId: string;
    totalTicket: number;
    organizerStripeAccountId: string;
    payoutStatus: "pending" | "paid";
    payoutDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<IRafflePayment>({
    charityId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['charity', 'raffle'] },
    charityUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User' },
    raffleId: { type: Schema.Types.ObjectId, ref: 'Raffle' },
    totalPaidAmount: Number,
    charityOwnerAmount: Number,
    platformAdminAmount: Number,
    raffleCreatorAmount: Number,
    platformFee: Number,
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.STRIPE },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    transactionId: String,
    totalTicket: Number,
    createdAt: Date,
    updatedAt: Date,
});

export const TransactionHistories = mongoose.model<IRafflePayment>('TransactionHistories', TransactionSchema);