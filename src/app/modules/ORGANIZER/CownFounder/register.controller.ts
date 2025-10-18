// REGISTER COFUNDER
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { registerCowdfounderService } from './register.service';

const createCrowdfunder = async (req: Request, res: Response) => {
  const userId = req.user.id;

  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.image = `${process.env.IMAGE_URL}/image/${req.files.image[0].filename}`;
  }

  req.body.userId = userId;

  const created = await registerCowdfounderService.createCowdfounder(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Crowdfunder created Successfully',
    data: created,
  });
};

export const registerCowdfounderController = {
  createCrowdfunder,
};
