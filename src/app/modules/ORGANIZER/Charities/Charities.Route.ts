import express from 'express';
import { charitiesController } from './Charities.Contoller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import { parseFormDataMiddleware } from '../../../middlewares/ParseFormData';
import validateRequest from '../../../middlewares/validateRequest';
import { createCauseZodSchema } from './Charities.zod.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ORGANIZER),
  fileUploadHandler(),
  parseFormDataMiddleware,
  validateRequest(createCauseZodSchema),
  charitiesController.createCause
);

router.get('/', charitiesController.getAllCauses);
router.get('/:id', charitiesController.getSingleCause);
router.delete('/:id', charitiesController.deleteCause);

export const CharitiesRoutes = router;
