import express from 'express';
import { charitiesController } from './Charities.Contoller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import { parseFormDataMiddleware } from '../../../middlewares/ParseFormData';
import validateRequest from '../../../middlewares/validateRequest';
import {
  createCauseZodSchema,
  createCrowdfunderZodSchema,
} from './Charities.zod.validation';
import { PaymentController } from '../../Payment/paymentController';

const router = express.Router();

//create charity or causes
router.post(
  '/charity',
  auth(USER_ROLES.ORGANIZER ,USER_ROLES.USER),
  fileUploadHandler(),
  parseFormDataMiddleware,
  validateRequest(createCauseZodSchema),
  charitiesController.createCause
);

router.get('/', charitiesController.getAllCauses);
router.get('/myCharity',auth(...USER_ROLES.ADMIN,USER_ROLES.ORGANIZER), charitiesController.getCharitiesByUser);

// create cowfounder
router.post(
  '/cowdFounder',
  auth(USER_ROLES.ORGANIZER ,USER_ROLES.USER),
  fileUploadHandler(),
  parseFormDataMiddleware,
  validateRequest(createCrowdfunderZodSchema),
  charitiesController.createCrowdfunder
);
router.post("/paymentIntent/:id",PaymentController.createPaymentIntentCause)

router.get('/:id', charitiesController.getSingleCause);
router.delete('/:id', charitiesController.deleteCause);

export const CharitiesRoutes = router;
