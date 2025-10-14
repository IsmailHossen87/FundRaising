import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../auth/auth.validation';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PaymentController } from './paymentController';

const router = express.Router();
const userAuth = [USER_ROLES.USER,USER_ROLES.ORGANIZER,USER_ROLES.ADMIN]
router.post(
  '/',
  auth(...userAuth),
  PaymentController.createPaymentIntent
);



export const PaymentRoute = router;
