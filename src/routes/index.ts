import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RaffleRoutes } from '../app/modules/ORGANIZER/raffel/raffe.route';
import { NotificationRoutes } from '../app/modules/ADMIN/Notification/notification.route';
import { ActionRouters } from '../app/modules/ADMIN/UsersAction/actionRoute';
import { CharitiesRoutes } from '../app/modules/ORGANIZER/Charities/Charities.Route';
import { fundRiaseRouter } from '../app/modules/user/FundRaise/FundRaiseRoute';
import { PaymentRouter } from '../app/modules/Payment/Payment.route';

const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/raffle',
    route: RaffleRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/action',
    route: ActionRouters,
  },
  {
    path: '/cause',
    route: CharitiesRoutes,
  },
  {
    path: '/fundraise',
    route:fundRiaseRouter ,
  },
  {
    path: '/payment',
    route:PaymentRouter ,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
