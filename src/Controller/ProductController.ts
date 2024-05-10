import { Request, Response } from "express";
import { PrismaClient, Product, Product_Info, Category } from "@prisma/client";
import { successHandler } from "../Middleware/ErrorHandler";
import { ProductInterface } from "../Interface/ProductInterfaceRequest";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const addProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const product: ProductInterface = req.body;

    const categories = await Promise.all(
      product.Category.map(async (category) => {
        const existingCategory = await prisma.category.findFirst({
          where: {
            name: category.name,
          },
        });
        if (existingCategory) {
          return existingCategory;
        } else {
          return prisma.category.create({
            data: {
              name: category.name,
            },
          });
        }
      })
    );

    const createProduct = await prisma.product.create({
      data: {
        barcode: product.barcode,
        Product_Info: product.Product_Info
          ? {
              create: {
                name: product.Product_Info.name,
                quantity: product.Product_Info.quantity,
                price: product.Product_Info.price,
              },
            }
          : undefined,
        Category: {
          connect: categories,
        },
        supplier: product.supplier,
        condition: product.condition,
        status: product.status,
        minimum_stock_level: product.minimum_stock_level,
        maximum_stock_level: product.maximum_stock_level,
        description: product.description,
      },
      include: {
        Product_Info: true,
        Category: true,
      },
    });

    if (!createProduct) {
      throw new Error("Failed to create product");
    }

    successHandler(createProduct, res);
  }
);

export const getProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const allProducts = await prisma.product.findMany({
      include: {
        Product_Info: {
          select: {
            name: true,
          },
        },
        Category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!allProducts) {
      throw new Error("Error Getting all Products");
    }

    successHandler(allProducts, res);
  }
);
