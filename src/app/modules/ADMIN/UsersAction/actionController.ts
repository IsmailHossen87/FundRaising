
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { actionService } from './actionService';

//Get All Raffle
const getAllCharitits = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await actionService.getAllCharitits(user)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Get all Charitist successfully',
      data: result,
    });
  }
);

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
//update Charitist
const charitistStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const charitistId = req.params.id 

    const result = await actionService.charitistStatus(user,charitistId)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);


export const actionController ={statusChange,getAllCharitits,charitistStatus}