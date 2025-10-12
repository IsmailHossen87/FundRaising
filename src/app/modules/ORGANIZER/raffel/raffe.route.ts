import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { RaffleController } from './raffel.controller';
import {
  createRaffleZodSchema,
  updateRaffleZodSchema,
} from './raffel.validation';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middlewares/auth';

const router = express.Router();
const rolesOfAccess = [USER_ROLES.ORGANIZER];

// Create new raffle
router.post(
  '/',
  auth(...rolesOfAccess),
  validateRequest(createRaffleZodSchema),
  RaffleController.createRaffle
);

// Get all raffles
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER),
  RaffleController.getAllRaffles
);

// Get single raffle by ID
router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER),
  RaffleController.getRaffleById
);

// Update raffle
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  validateRequest(updateRaffleZodSchema),
  RaffleController.updateRaffle
);

// Delete raffle
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER),
  RaffleController.deleteRaffle
);

export const RaffleRoutes = router;
