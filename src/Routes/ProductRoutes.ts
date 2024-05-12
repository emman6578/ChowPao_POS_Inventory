import { Router } from "express";

import { authenticateToken } from "../Middleware/authMiddleware";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProductInfo,
  updateProductInventory,
} from "../Controller/ProductController";

const router = Router();

//Inventory Routes
router.get("/", authenticateToken, getProducts);
router.get("/:id", authenticateToken, getProduct);

router.post("/create", authenticateToken, addProduct);

//update product info
router.put("/info/:id", authenticateToken, updateProductInfo);
//update product in inventory
router.put("/inventory/:id", authenticateToken, updateProductInventory);

router.delete("/:id", authenticateToken, deleteProduct);

export default router;
