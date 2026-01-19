import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PayoutController } from "../Payment/Payout.controller";

const router = Router()
router.post(
    "/admin/:transactionId",
    auth(USER_ROLES.ADMIN),
    PayoutController.payOrganizer
);


export const PayoutRouter = router