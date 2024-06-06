import { Router } from "express";

import { authenticateToken, isAdmin } from "../Middleware/authMiddleware";
import { add, deleteInCart, getCart } from "../Controller/CartController";

const router = Router();

router.post("/add", authenticateToken, isAdmin, add);
router.get("/cart", authenticateToken, isAdmin, getCart);
router.delete("/delete", authenticateToken, isAdmin, deleteInCart);

export default router;
