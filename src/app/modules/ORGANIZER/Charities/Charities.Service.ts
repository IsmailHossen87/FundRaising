import { StatusCodes } from 'http-status-codes';
import { ICause } from './Charities.Interface';
import { Cause } from './Charities.Model';
import ApiError from '../../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../../enums/user';

const createCause = async (payload: ICause): Promise<ICause> => {

  const lastCause = await Cause.findOne().sort({ createdAt: -1 }).select('campaignId');


  let newNumber = 1;
  if (lastCause && lastCause.campaignId) {
    const lastNumber = parseInt(lastCause.campaignId.split('-')[1]);
    if (!isNaN(lastNumber)) {
      newNumber = lastNumber + 1;
    }
  }

  const newCampaignId = `#A-${newNumber}`;
  payload.campaignId = newCampaignId; 

  const result = await Cause.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};

export const causeService = {
  createCause,
};

const getAllCauses = async (): Promise<ICause[]> => {
  return await Cause.find().sort({ createdAt: -1 });
};

const getSingleCause = async (id: string): Promise<ICause | null> => {
  const cause = await Cause.findById(id);
  if (!cause) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cause not found');
  }
  return cause;
};

const deleteCause = async (id: string): Promise<ICause | null> => {
  const cause = await Cause.findByIdAndDelete(id);
  if (!cause) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cause not found');
  }
  return cause;
};

export const charitiesService = {
  createCause,
  getAllCauses,
  getSingleCause,
  deleteCause,
};
