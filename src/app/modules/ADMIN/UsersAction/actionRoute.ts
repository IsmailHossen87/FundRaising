import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { actionController } from './actionController';


const router = express.Router();
// get all Cherity
const admin = [USER_ROLES.ADMIN]
router
  .route('/')
  .get(auth(...admin),actionController.getAllCharitits),

 router.route("/dashboard").get(auth(...admin),actionController.dashboard) 
 router.route("/allRaffle").get(auth(...admin),actionController.allUserUnderCharity) 
 router.route("/raffleStatus/:id").patch(auth(...admin),actionController.RaffleStatusChange)



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
