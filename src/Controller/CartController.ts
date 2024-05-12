import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { successHandler } from "../Middleware/ErrorHandler";
import { AuthRequest } from "../Middleware/authMiddleware";

const prisma = new PrismaClient();

export const add = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user;

    const products = req.body.products;

    if (!user) {
      throw new Error("Log in first");
    }

    let userCart = await prisma.user.findUnique({
      where: { id: user.id },
      include: { Cart: true },
    });

    if (!userCart?.Cart) {
      userCart = await prisma.user.update({
        where: { id: user.id },
        data: {
          Cart: {
            create: {},
          },
        },
        include: { Cart: true },
      });
    }

    if (!userCart) {
      throw new Error("User's cart does not exist");
    }

    for (const { product_id, quantity } of products) {
      const existingProductInCart = await prisma.productInCart.findFirst({
        where: {
          cart_id: userCart.Cart?.id,
          product_id,
        },
      });

      if (existingProductInCart) {
        await prisma.productInCart.update({
          where: { id: existingProductInCart.id },
          data: { quantity: existingProductInCart.quantity + quantity },
        });
      } else {
        await prisma.productInCart.create({
          data: {
            quantity,
            product: { connect: { id: product_id } },
            cart: { connect: { id: userCart.Cart?.id } },
          },
        });
      }
    }

    successHandler("Product added successfully", res);
  }
);
