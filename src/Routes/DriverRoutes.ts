import { Router } from "express";

import { authenticateToken } from "../Middleware/authMiddleware";

import {
  getCurrentlyLoggedInDriver,
  ViewDelivery,
} from "../Controller/DriverController";

const router = Router();

router.get("/", authenticateToken, getCurrentlyLoggedInDriver);
router.get("/delivery", authenticateToken, ViewDelivery);

export default router;
