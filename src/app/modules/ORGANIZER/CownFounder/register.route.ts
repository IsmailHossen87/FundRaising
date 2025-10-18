import { Router } from 'express';
import { registerCowdfounderController } from './register.controller';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import { parseFormDataMiddleware } from '../../../middlewares/ParseFormData';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = Router();
router.post(
  '/',
  auth(USER_ROLES.ORGANIZER),
  fileUploadHandler(),
  parseFormDataMiddleware,
  registerCowdfounderController.createCrowdfunder
);

export const registerCowdfunderRoute = router;
