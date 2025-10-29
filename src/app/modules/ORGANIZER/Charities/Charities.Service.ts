import { StatusCodes } from 'http-status-codes';
import { ICause } from './Charities.Interface';
import { Charities } from './Charities.Model';
import ApiError from '../../../../errors/ApiError';

const createCause = async (payload: ICause): Promise<ICause> => {
  const result = await Charities.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};

const createCowdfounder = async (payload: ICause): Promise<ICause> => {
  const result = Charities.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};

const getAllCauses = async (): Promise<ICause[]> => {
  return await Charities.find().sort({ createdAt: -1 });
};

const getSingleCause = async (id: string): Promise<ICause | null> => {
  const cause = await Charities.findById(id);
  if (!cause) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cause not found');
  }
  return cause;
};

const deleteCause = async (id: string): Promise<ICause | null> => {
  const cause = await Charities.findByIdAndDelete(id);
  if (!cause) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cause not found');
  }
  return cause;
};

export const charitiesService = {
  createCause,
  createCowdfounder,
  getAllCauses,
  getSingleCause,
  deleteCause,
};
