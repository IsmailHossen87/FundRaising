import { payoutService } from "../Payout/payout.service";
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';



const payOrganizer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { transactionId } = req.params;

    const result = await payoutService.payOrganizer(transactionId);

    res.status(200).json({
        success: true,
        message: "Payout completed",
        data: result,
    });
});

export const PayoutController = {
    payOrganizer,
};
