import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { successHandler } from "../Middleware/ErrorHandler";
import { AuthRequest } from "../Middleware/authMiddleware";

const prisma = new PrismaClient();

export const createOrder = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { productInCartIds, address } = req.body;

    // Check if user ID exists
    const userId = req.user?.id;
    if (!userId) {
      res.status(400);
      throw new Error("User ID is required");
    }

    // Fetch the productInCart details
    const productInCarts = await prisma.productInCart.findMany({
      where: {
        id: { in: productInCartIds },
      },
      include: {
        product: {
          include: {
            Product_Info: true,
          },
        },
      },
    });

    if (productInCarts.length === 0) {
      res.status(400);
      throw new Error("No valid ProductInCart items found");
    }

    // Calculate total price and quantity
    const total = productInCarts.reduce((acc, item) => acc + item.total, 0);
    const quantity = productInCarts.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const status = productInCarts[0].status; // Assuming all items have the same status

    // Get product IDs from ProductInCart items
    const productIds = productInCarts.map((item) => item.product.id);

    // Create new order
    const newOrder = await prisma.order.create({
      data: {
        total,
        payment_status: "PROCESSING", // Default status, can be modified as needed
        quantity,
        status,
        address,
        user_id: userId,
        product: {
          connect: productIds.map((id) => ({ id })),
        },
      },
    });

    successHandler(newOrder, res);
  }
);

export const getOrder = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Get the authenticated user's ID
    const userId = req.user;

    // Fetch orders for the authenticated user
    const orders = await prisma.order.findMany({
      where: {
        user_id: userId?.id,
      },
      include: {
        product: { include: { Product_Info: true } },
        user: { select: { name: true } },
      },
    });

    // Return the orders in the response
    return successHandler(orders, res);
  }
);
