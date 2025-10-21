import { StatusCodes } from 'http-status-codes';
import { ICause } from './Charities.Interface';
import { Charities } from './Charities.Model';
import ApiError from '../../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../../enums/user';

const createCause = async (payload: ICause): Promise<ICause> => {
  const lastCause = await Charities.findOne()
    .sort({ createdAt: -1 })
    .select('campaignId');

  let newNumber = 1;
  if (lastCause && lastCause.campaignId) {
    const lastNumber = parseInt(lastCause.campaignId.split('-')[1]);
    if (!isNaN(lastNumber)) {
      newNumber = lastNumber + 1;
    }
  }

  const newCampaignId = `#A-${newNumber}`;
  payload.campaignId = newCampaignId;

  const result = await Charities.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};


const createCowdfounder = async (payload: ICause): Promise<ICause> => {
  const lastCause = await Charities.findOne()
    .sort({ createdAt: -1 })
    .select('campaignId');

  let newNumber = 1;
  if (lastCause && lastCause.campaignId) {
    const lastNumber = parseInt(lastCause.campaignId.split('-')[1]);
    if (!isNaN(lastNumber)) {
      newNumber = lastNumber + 1;
    }
  }
  const newCampaignId = `#A-${newNumber}`;
  payload.campaignId = newCampaignId;
  const result = Charities.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};

export const causeService = {
  createCause,
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
