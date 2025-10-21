import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { Funding } from './fundRaise.Model';
import { IfundRaise } from './fundRaise.interface';


const createFundRaise = async (payload: IfundRaise): Promise<IfundRaise> => {
    
  const result = await Funding.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};

const getAllFundRaiser = async () => {
  const result = await Funding.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};



export const fundRaiseService ={
    createFundRaise,getAllFundRaiser
}