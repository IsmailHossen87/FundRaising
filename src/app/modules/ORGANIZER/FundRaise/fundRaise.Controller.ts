// REGISTER COFUNDER
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fundRaiseService } from './fundRaise.Service';

const createFundRaise = async (req: Request, res: Response) => {
  const charityId = req.params.id;

  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.image = `${process.env.IMAGE_URL}/image/${req.files.image[0].filename}`;
  }
  req.body.charityId = charityId;
  const created = await fundRaiseService.createFundRaise(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Crowdfunder created Successfully',
    data: created,
  });
};

export const fundRaiseController = {
  createFundRaise,
};
