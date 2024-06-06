import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { successHandler } from "../Middleware/ErrorHandler";
import { AuthRequest } from "../Middleware/authMiddleware";

const prisma = new PrismaClient();

//get all user

export const getUsers = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const allUsers = await prisma.user.findMany({
      where: { role: "DRIVER" },
    });

    if (!allUsers) {
      throw new Error("Error Getting all Products");
    }

    successHandler(allUsers, res);
  }
);

export const addToDelivery = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      driverId,
      productInCartIds,
    }: { driverId: string; productInCartIds: string[] } = req.body;

    try {
      // Validate input
      if (!Array.isArray(productInCartIds)) {
        throw new Error("productInCartIds must be an array");
      }

      // Find the driver with the provided driverId
      let driver = await prisma.user.findUnique({
        where: {
          id: driverId,
        },
        include: { Delivery: true },
      });

      if (!driver) {
        throw new Error("Driver not found");
      }

      // Check if the driver already has a delivery
      let delivery = await prisma.delivery.findFirst({
        where: { driver_id: driverId },
      });

      // If not, create a new delivery
      if (!delivery) {
        delivery = await prisma.delivery.create({
          data: {
            driver_id: driverId,
          },
        });
      }

      const deliveryId = delivery.id;

      // Iterate over each productInCartId to add them to DeliveryProducts
      for (const productInCartId of productInCartIds) {
        // Find the product in cart by its id
        const productInCart = await prisma.productInCart.findUnique({
          where: { id: productInCartId },
          include: { product: true },
        });

        if (!productInCart) {
          throw new Error(`ProductInCart with id ${productInCartId} not found`);
        }

        // Check if the product already exists in DeliveryProducts
        const existingDeliveryProduct = await prisma.deliveryProducts.findFirst(
          {
            where: {
              deliveryId: deliveryId,
              product: { some: { id: productInCart.product_id } },
            },
          }
        );

        if (existingDeliveryProduct) {
          // If it exists, update the existing DeliveryProducts entry
          await prisma.deliveryProducts.update({
            where: { id: existingDeliveryProduct.id },
            data: {
              quantity:
                existingDeliveryProduct.quantity + productInCart.quantity,
              total: existingDeliveryProduct.total + productInCart.total,
            },
          });
        } else {
          // If not, create a new DeliveryProducts entry
          await prisma.deliveryProducts.create({
            data: {
              product: {
                connect: { id: productInCart.product_id },
              },
              quantity: productInCart.quantity,
              total: productInCart.total,
              Delivery: {
                connect: { id: deliveryId },
              },
            },
          });
        }
      }

      // Calculate the total quantity and price of the delivery
      const deliveryProducts = await prisma.deliveryProducts.findMany({
        where: { deliveryId: deliveryId },
      });

      const totalQuantity = deliveryProducts.reduce(
        (sum, dp) => sum + dp.quantity,
        0
      );
      const totalPrice = deliveryProducts.reduce(
        (sum, dp) => sum + dp.total,
        0
      );

      // Update the delivery with the new totals and statuses
      await prisma.delivery.update({
        where: { id: deliveryId },
        data: {
          total_delivery_quantity: totalQuantity,
          total_delivery_price: totalPrice,
        },
      });

      // Send the success response
      successHandler(delivery, res);
    } catch (error: any) {
      // Handle errors and send the error response
      res.status(500).json({ message: error.message });
    }
  }
);

//get single user

export const getDelivery = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const delivery = await prisma.delivery.findMany({
      include: {
        Products: {
          include: { product: { include: { Product_Info: true } } },
        },
      },
    });

    if (!delivery) {
      throw new Error(`Error Getting One Product`);
    }

    successHandler(delivery, res);
  }
);
