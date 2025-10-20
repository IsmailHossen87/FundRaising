import { Router } from 'express';
import { fundRaiseController } from './fundRaise.Controller';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import { parseFormDataMiddleware } from '../../../middlewares/ParseFormData';

const router = Router();
router.post(
  '/:id',
  fileUploadHandler(),
  parseFormDataMiddleware,
  fundRaiseController.createFundRaise
);

export const fundRiaseRouter = router;
