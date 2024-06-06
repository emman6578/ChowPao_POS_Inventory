import { Router } from "express";

import { authenticateToken, isAdmin } from "../Middleware/authMiddleware";
import { createOrder, getOrder } from "../Controller/OrderController";

const router = Router();

router.post("/orders", authenticateToken, isAdmin, createOrder);
router.get("/orders", authenticateToken, isAdmin, getOrder);

export default router;
