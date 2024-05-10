import { Router } from "express";
import { authToken, createToken, register } from "../Controller/AuthController";

const router = Router();

router.post("/register", register);
router.post("/login", createToken);
router.post("/authenticate", authToken);

export default router;
