import { Router } from "express";

import { authenticateToken, isAdmin } from "../Middleware/authMiddleware";
import { add } from "../Controller/CartController";

const router = Router();

router.post("/add", authenticateToken, isAdmin, add);

export default router;
