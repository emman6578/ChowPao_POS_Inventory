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
router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/create", addProduct);

router.put("/info/:id", updateProductInfo);
router.put("/inventory/:id", updateProductInventory);

router.delete("/:id", deleteProduct);

export default router;
