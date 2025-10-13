import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { NotificationController } from '../Notification/notification.controller';
import { actionController } from './actionController';


const router = express.Router();

router
  .route('/:id')
  .patch(
    auth(USER_ROLES.ADMIN),
    actionController.statusChange
  )
  .delete(auth(USER_ROLES.ADMIN), NotificationController.deleteNotification);

export const ActionRouters = router;
