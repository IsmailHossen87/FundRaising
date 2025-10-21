import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createPaymentService } from "./PaymentService";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const paramsId = req.params.id
  const result = await createPaymentService.createPaymentIntent(paramsId,req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});


export const PaymentController ={createPaymentIntent}