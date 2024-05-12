import { Router } from "express";

import {
  authenticateToken,
  isAdmin,
  isDriver,
} from "../Middleware/authMiddleware";
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
router.get("/", authenticateToken, isAdmin, getProducts);
router.get("/:id", authenticateToken, isAdmin, getProduct);

router.post("/create", authenticateToken, isAdmin, addProduct);

//update product info
router.put("/info/:id", authenticateToken, isAdmin, updateProductInfo);
//update product in inventory
router.put(
  "/inventory/:id",
  authenticateToken,
  isAdmin,
  updateProductInventory
);

router.delete("/:id", authenticateToken, isAdmin, deleteProduct);

export default router;
