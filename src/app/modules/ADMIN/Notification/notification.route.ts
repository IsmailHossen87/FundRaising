import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import validateRequest from '../../../middlewares/validateRequest';
import { NotificationController } from './notification.controller';
import { NotificationValidation } from './notification.validation';

const router = express.Router();


router
  .route('/')
  .post(
    
    auth(USER_ROLES.ADMIN),
    // validateRequest(NotificationValidation.createNotificationSchema),
    NotificationController.createNotification
  )
  .get(
    auth(USER_ROLES.ADMIN),
    NotificationController.getAllNotifications 
  )


router
  .route('/:id')
  .get(
    auth(USER_ROLES.ADMIN),
    NotificationController.getNotificationById 
  )
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(NotificationValidation.updateNotificationSchema),
    NotificationController.updateNotification
  )
  .delete(auth(USER_ROLES.ADMIN), NotificationController.deleteNotification);

export const NotificationRoutes = router;
