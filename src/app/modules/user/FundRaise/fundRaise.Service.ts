import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { Funding } from './fundRaise.Model';
import { IfundRaise } from './fundRaise.interface';
import { Charities } from '../../ORGANIZER/Charities/Charities.Model';

const createFundRaise = async (payload: IfundRaise) => {
  const charity = await Charities.findById(payload.charityId);

  if (!charity) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Charity are not available');
  }

  if(charity.status === "Pending"){
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Charity Status Pending');
  }

  const result = await Funding.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  const charityId = result.charityId.toString();
  await Charities.findByIdAndUpdate(charityId, {
    fundRaiser: result._id,
  });

  return result;
};

const getAllFundRaiser = async () => {
  const result = await Funding.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};

export const fundRaiseService = {
  createFundRaise,
  getAllFundRaiser,
};
