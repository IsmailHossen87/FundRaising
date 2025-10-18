import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import { RaffleService } from './raffel.server';
import sendResponse from '../../../../shared/sendResponse';

const createRaffle = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  // handle image upload
  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.image = `${process.env.IMAGE_URL}/image/${req.files.image[0].filename}`;
  }

  // attach user ID
  req.body.userId = userId;

  const result = await RaffleService.createRaffleToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Raffle created successfully',
    data: result,
  });
});

// Get all raffles
const getAllRaffles = catchAsync(async (req: Request, res: Response) => {
  const result = await RaffleService.getAllRafflesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Raffles fetched successfully',
    data: result,
  });
});

// Get raffle by ID
const getRaffleById = catchAsync(async (req: Request, res: Response) => {
  const result = await RaffleService.getRaffleByIdFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Raffle fetched successfully',
    data: result,
  });
});
// Get my raffle
const getMyRaffle = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await RaffleService.getMyRaffle(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Raffle fetched successfully',
    data: result,
  });
});

// Update raffle
const updateRaffle = catchAsync(async (req: Request, res: Response) => {
  const result = await RaffleService.updateRaffleInDB(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Raffle updated successfully',
    data: result,
  });
});

// Delete raffle
const deleteRaffle = catchAsync(async (req: Request, res: Response) => {
  await RaffleService.deleteRaffleFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Raffle deleted successfully',
  });
});

export const RaffleController = {
  createRaffle,
  getAllRaffles,
  getRaffleById,
  updateRaffle,
  deleteRaffle,
  getMyRaffle,
};
