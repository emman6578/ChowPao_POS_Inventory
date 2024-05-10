import { Router } from "express";

import { authenticateToken } from "../Middleware/authMiddleware";
import { addProduct, getProducts } from "../Controller/ProductController";

const router = Router();

//Inventory Routes
router.get("/", getProducts);
router.post("/create", addProduct);

export default router;
