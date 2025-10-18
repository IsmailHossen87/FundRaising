import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IRaffle } from './raffel.interface';
import Raffle from './raffel.model';

// Create raffle
const createRaffleToDB = async ( payload: IRaffle) => {
  const isExist = await Raffle.findOne({ raffleName: payload.raffleName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Raffle name already exists');
  }


  const result = await Raffle.create(payload );
  return result;
};

// Get all raffles
const getAllRafflesFromDB = async () => {
  const raffles = await Raffle.find().sort({ createdAt: -1 });
  return raffles;
};

// Get single raffle
const getRaffleByIdFromDB = async (id: string) => {
  const raffle = await Raffle.findById(id);
  if (!raffle) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }
  return raffle;
};

// Get my raffle
const getMyRaffle = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user ID format");
  }
  const objectId = new mongoose.Types.ObjectId(id);

  const raffle = await Raffle.find({ userId: objectId });

  if (!raffle || raffle.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Raffle not found");
  }

  return raffle;
};

// Update raffle
const updateRaffleInDB = async (id: string, payload: Partial<IRaffle>) => {
  const updated = await Raffle.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }
  return updated;
};

// Delete raffle
const deleteRaffleFromDB = async (id: string) => {
  const deleted = await Raffle.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Raffle not found');
  }
  return deleted;
};

export const RaffleService = {
  createRaffleToDB,
  getAllRafflesFromDB,
  getRaffleByIdFromDB,
  updateRaffleInDB,
  deleteRaffleFromDB,
  getMyRaffle,
};
