import { StatusCodes } from 'http-status-codes';
import { Raffle } from './raffel.model';
import { IRaffle } from './raffel.interface';
import ApiError from '../../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';


// Create raffle
const createRaffleToDB = async ( user:JwtPayload,payload: IRaffle) => {
  const isExist = await Raffle.findOne({ raffleName: payload.raffleName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Raffle name already exists');
  }
  const userId = user.id 

  const result = await Raffle.create({...payload,userId});
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
};
