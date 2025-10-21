import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { actionController } from './actionController';


const router = express.Router();
// get all Cherity
const admin = [USER_ROLES.ADMIN]
router
  .route('/')
  .get(
    auth(...admin),
    actionController.getAllCharitits
  )
  // all Count

// USER Status Change
router
  .route('/:id')
  .patch(
    auth(...admin),
    actionController.statusChange
  )
// charity status change
  router
  .route("/cheritist/:id")
  .patch(
    auth(USER_ROLES.ADMIN),
    actionController.charitistStatus
  )



export const ActionRouters = router;
