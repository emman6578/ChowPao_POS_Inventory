import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const order = expressAsyncHandler(
  async (req: Request, res: Response) => {}
);
