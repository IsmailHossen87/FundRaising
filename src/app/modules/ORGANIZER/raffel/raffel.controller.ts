import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import { RaffleService } from './raffel.server';
import sendResponse from '../../../../shared/sendResponse';

const createRaffle = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  // handle image upload
  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.image = `$/image/${req.files.image[0].filename}`;
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


const monthlyRaffle = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  req.body.userId = userId;

  const result = await RaffleService.createMonthlyRaffleToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Monthly Raffle created successfully',
    data: result,
  });
});

const allMonthlyRaffle = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const query = req.query
  const result = await RaffleService.allMonthlyRaffle(userId as string, query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Monthly Raffle retrived successfully',
    data: { ...result },
  });
});


// Get all raffles
const getAllRaffles = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await RaffleService.getAllRafflesFromDB(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Raffles fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});


// // Get raffle by ID
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
  const userId = req.user?.id as string;
  const query = req.query
  const result = await RaffleService.getMyRaffle(userId, query as Record<string, string>);
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
// All Participant
const allParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await RaffleService.allParticipant();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All User retrived successfully',
    data: result,
  });
});

// ®️Randon Winner
const getRandomWinner = catchAsync(async (req: Request, res: Response) => {
  const raffleId = req.params.id;
  const winner = await RaffleService.getRandomWinner(raffleId, 1);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Random winner selected successfully',
    data: winner,
  });
});

const getRandomWinnerMultiple = catchAsync(
  async (req: Request, res: Response) => {
    const raffleId = req.params.id;
    const totalWinner = req.body.totalWinner

    const winner = await RaffleService.getRandomWinner(raffleId, Number(totalWinner));

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Random winner selected successfully',
      data: winner,
    });
  }
);
// All Winner
const allWinner = catchAsync(async (req: Request, res: Response) => {
  const raffleId = req.params.id;
  const winner = await RaffleService.allWinner(raffleId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Winner retrived successfully',
    data: winner,
  });
});

export const RaffleController = {
  createRaffle,
  monthlyRaffle,
  getAllRaffles,
  allMonthlyRaffle,
  getRaffleById,
  updateRaffle,
  deleteRaffle,
  getMyRaffle,
  allParticipant,
  getRandomWinner,
  getRandomWinnerMultiple,
  allWinner,
};
