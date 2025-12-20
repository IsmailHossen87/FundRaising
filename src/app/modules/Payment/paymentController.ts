import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { createCharityPaymentIntent, createRafflePaymentIntent } from "./PaymentService";

// ---------------- Raffle ----------------
const createPaymentIntentRaffle = catchAsync(
  async (req: Request, res: Response) => {
    const raffleId = req.params.id;
    const message = req.body.message

    if (!req.user)
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "You must be logged in to buy raffle"
      );

    const ticketCount = Number(req.body.ticket);
    if (!ticketCount || ticketCount <= 0)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Ticket count must be greater than 0"
      );

    const paymentSession = await createRafflePaymentIntent(
      raffleId,
      ticketCount,
      { userId: req.user?.id, message }
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Redirect to payment",
      data: paymentSession,
    });
  }
);

// ---------------- Charity ----------------
const createPaymentIntentCause = catchAsync(
  async (req: Request, res: Response) => {
    const causeId = req.params.id;
    const { firstName, surName, email, message, totalAmount } = req.body;

    if (!firstName || !email || !totalAmount)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "First name, email and donation amount are required"
      );

    const paymentSession = await createCharityPaymentIntent(
      causeId,
      Number(totalAmount),
      { firstName, surName, email, message }
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Redirect to Donation",
      data: paymentSession,
    });
  }
);

export const PaymentController = {
  createPaymentIntentRaffle,
  createPaymentIntentCause,
};
