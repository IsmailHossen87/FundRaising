import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { actionController } from './actionController';


const router = express.Router();
const admin = [USER_ROLES.ADMIN]
router
  .route('/')
  .get(
    auth(...admin),
    actionController.getAllCharitits
  )
// USER ACTION
router
  .route('/:id')
  .patch(
    auth(...admin),
    actionController.statusChange
  )

  router
  .route("/cheritist/:id")
  .patch(
    auth(USER_ROLES.ADMIN),
    actionController.charitistStatus
  )



export const ActionRouters = router;
