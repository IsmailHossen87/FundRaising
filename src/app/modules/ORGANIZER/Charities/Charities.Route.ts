import express from "express";
import { charitiesController } from "./Charities.Contoller";
import auth from "../../../middlewares/auth";
import { USER_ROLES } from "../../../../enums/user";
import fileUploadHandler from "../../../middlewares/fileUploadHandler";



const router = express.Router();

router.post("/",auth(USER_ROLES.ORGANIZER),fileUploadHandler(), charitiesController.createCause);

router.get("/", charitiesController.getAllCauses);
router.get("/:id", charitiesController.getSingleCause);
router.delete("/:id", charitiesController.deleteCause);

export const CharitiesRoutes = router;
