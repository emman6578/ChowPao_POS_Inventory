import { Router } from "express";

import { authenticateToken } from "../Middleware/authMiddleware";
import { addProduct } from "../Controller/ProductController";

const router = Router();

//Inventory Routes
router.post("/create", addProduct);

export default router;
