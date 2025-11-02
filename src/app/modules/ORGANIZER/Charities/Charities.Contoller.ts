import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { charitiesService } from './Charities.Service';
import catchAsync from '../../../../shared/catchAsync';
import { Charities } from './Charities.Model';
import sendResponse from '../../../../shared/sendResponse';

// CREATECAUSE
const createCause = async (req: Request, res: Response) => {
  const userId = req.user.id;
  req.body.userId = userId; 
  console.log(req.body);

  if (req.body.data) {
    const parsedData = JSON.parse(req.body.data);
    req.body = { ...parsedData, userId };
  }

  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.coverImage = `/image/${req.files.image[0].filename}`;
  }

  const data = { ...req.body }; 
  console.log(data);

  const result = await charitiesService.createCause(data);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Cause created successfully',
    data: result,
  });
};
// FOR CROWFOUNDER
const createCrowdfunder = async (req: Request, res: Response) => { 
  const userId = req.user.id;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.image = `${process.env.IMAGE_URL}/image/${req.files.image[0].filename}`;
  }
  req.body.userId = userId;
  const created = await charitiesService.createCowdfounder(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Crowdfunder created Successfully',
    data: created,
  });
};

const getAllCauses = async (req: Request, res: Response) => {
  const result = await charitiesService.getAllCauses();
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'All causes fetched successfully',
    data: result,
  });
};
const getCharitiesByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const charities = await Charities.find();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User charities fetched successfully",
    data: charities,
  });
});

const getSingleCause = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await charitiesService.getSingleCause(id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cause details fetched successfully',
    data: result,
  });
};

const deleteCause = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await charitiesService.deleteCause(id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cause deleted successfully',
    data: result,
  });
};

export const charitiesController = {
  createCause,
  createCrowdfunder,
  getAllCauses,
  getCharitiesByUser,
  getSingleCause,
  deleteCause,
};
