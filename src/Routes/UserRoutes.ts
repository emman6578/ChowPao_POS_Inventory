import { Router } from "express";

import { authenticateToken, isAdmin } from "../Middleware/authMiddleware";
import {
  getUsers,
  addToDelivery,
  getDelivery,
} from "../Controller/UserController";

const router = Router();

router.get("/", authenticateToken, getUsers);

router.post("/delivery", authenticateToken, isAdmin, addToDelivery);

router.get("/delivery", authenticateToken, isAdmin, getDelivery);

export default router;
