import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import { parseFormDataMiddleware } from '../../../middlewares/ParseFormData';
import auth from '../../../middlewares/auth';

import { USER_ROLES } from '../../../../enums/user';
import { RaffleController } from './raffel.controller';
import { PaymentController } from '../../Payment/paymentController';
import {
  updateRaffleZodSchema,
} from './raffel.validation';

const router = express.Router();


const organizerAccess = [USER_ROLES.ORGANIZER];
const adminAccess = [USER_ROLES.ADMIN];


// 🆕 Create a new Raffle (Organizer only)
router.post(
  '/',
  auth(...organizerAccess),
  fileUploadHandler(),
  parseFormDataMiddleware,
  validateRequest(updateRaffleZodSchema),
  RaffleController.createRaffle
);
router.route('/monthly-raffle')
  .post(auth(...adminAccess), validateRequest(updateRaffleZodSchema), RaffleController.monthlyRaffle)
  .get(auth(...adminAccess), RaffleController.allMonthlyRaffle)

router.get('/', auth(...adminAccess), RaffleController.getAllRaffles);

// 📦 Get My Raffles (Organizer)
router.get('/myRaffle', auth(USER_ROLES.ORGANIZER), RaffleController.getMyRaffle);

router.get('/participant', RaffleController.allParticipant);

// 💳 Create Payment Intent for Raffle
router.post('/payment-intent/:id', auth(USER_ROLES.USER), PaymentController.createPaymentMothlyRaffle);

//®️®️®️®️®️®️®️®️®️®️ DRAW RAFFLE 
router.get('/random-winner_single/:id', auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER), RaffleController.getRandomWinner);
//®️®️®️®️®️®️®️®️®️®️ DRAW RAFFLE 
router.get('/random-winner_multiple/:id', auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER), RaffleController.getRandomWinnerMultiple);
//®️®️®️®️®️®️®️®️®️®️ALL winner
router.get("/winner/:id", auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER), RaffleController.allWinner)


// 🔍 Get Single Raffle by ID (Admin / Organizer)
router.get('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER), RaffleController.getRaffleById);

// ✏️ Update Raffle (Organizer)
router.patch('/:id', auth(...organizerAccess), validateRequest(updateRaffleZodSchema), RaffleController.updateRaffle);

// 🗑️ Delete Raffle (Admin / Organizer)
router.delete('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER), RaffleController.deleteRaffle);



export const RaffleRoutes = router;
