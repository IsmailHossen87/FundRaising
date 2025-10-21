import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RaffleRoutes } from '../app/modules/ORGANIZER/raffel/raffe.route';
import { NotificationRoutes } from '../app/modules/ADMIN/Notification/notification.route';
import { ActionRouters } from '../app/modules/ADMIN/UsersAction/actionRoute';
import { CharitiesRoutes } from '../app/modules/ORGANIZER/Charities/Charities.Route';
import { PaymentRoute } from '../app/modules/Payment/PaymentRoute';
import { fundRiaseRouter } from '../app/modules/user/FundRaise/FundRaiseRoute';

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
    path: '/raffel',
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
    path: '/payment',
    route: PaymentRoute,
  },
  {
    path: '/fundraise',
    route:fundRiaseRouter ,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
