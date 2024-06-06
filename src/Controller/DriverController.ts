import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { successHandler } from "../Middleware/ErrorHandler";
import { AuthRequest } from "../Middleware/authMiddleware";
import { userInfo } from "os";

const prisma = new PrismaClient();

//driver controller
export const getCurrentlyLoggedInDriver = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const driverId = req.user?.id;

    const allUsers = await prisma.user.findMany({
      where: { id: driverId, role: "DRIVER" },
    });

    if (!allUsers) {
      throw new Error("Error Getting all Products");
    }

    successHandler(allUsers, res);
  }
);

export const ViewDelivery = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const driverId = req.user?.id;

    const delivery = await prisma.delivery.findMany({
      where: { driver_id: driverId },
      include: {
        Products: {
          include: { product: { include: { Product_Info: true } } },
        },
      },
    });

    if (!delivery) {
      throw new Error(`Error Getting Delivery`);
    }

    successHandler(delivery, res);
  }
);

export const ApprovedInventory = expressAsyncHandler(
  async (req: Request, res: Response) => {}
);
