import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { ICrowdfunder } from './register.interface';
import { CrowdfunderModel } from './register.model';

const createCowdfounder = async (payload: ICrowdfunder): Promise<ICrowdfunder> => {
    
  const result = await CrowdfunderModel.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create cause');
  }

  return result;
};



export const registerCowdfounderService ={
    createCowdfounder
}