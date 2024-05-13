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

    // Calculate total price of products in the cart
    const cartId = userCart.Cart?.id;
    const cartProducts = await prisma.productInCart.findMany({
      where: {
        cart_id: cartId,
      },
      include: {
        product: {
          select: {
            Product_Info: true,
          },
        },
      },
    });

    if (!cartProducts) {
      throw new Error("Cart Products failed to find");
    }

    let totalPrice = 0;
    for (const cartProduct of cartProducts) {
      totalPrice +=
        cartProduct.quantity * cartProduct.product.Product_Info!.price;
    }

    try {
      // Update cart
      await prisma.cart.update({
        where: { id: cartId },
        data: {
          total_price: totalPrice,
          status: "ACTIVE",
          payment_status: "UNPAID",
        },
      });
    } catch (error) {
      throw new Error(`${error}`);
    }

    successHandler("Product added successfully", res);
  }
);
