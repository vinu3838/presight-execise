import { Router } from "express";
import { getUsersController } from "../controllers/users";

const router = Router();

router.get("/", getUsersController);

export default router;
