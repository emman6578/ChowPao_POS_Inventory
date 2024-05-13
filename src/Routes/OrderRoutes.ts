import { Router } from "express";

import { authenticateToken } from "../Middleware/authMiddleware";
import { order } from "../Controller/OrderController";

const router = Router();

router.get("/orders", order);

export default router;
