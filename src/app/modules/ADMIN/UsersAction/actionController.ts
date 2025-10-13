
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { actionService } from './actionService';

//update profile
const statusChange = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const userId = req.params.id 

    const result = await actionService.statusChange(user,userId)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);


export const actionController ={statusChange}