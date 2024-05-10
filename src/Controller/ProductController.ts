import { Request, Response } from "express";
import { PrismaClient, Product, Product_Info, Category } from "@prisma/client";
import { successHandler } from "../Middleware/ErrorHandler";
import {
  ProductInfo,
  ProductInterface,
} from "../Interface/ProductInterfaceRequest";
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
        Product_Info: true,
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

export const getProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error(`Error Getting id of the Product`);
    }

    const getOne = await prisma.product.findUnique({
      where: {
        id: String(id),
      },
      include: {
        Product_Info: true,
        Category: { select: { name: true } },
      },
    });

    if (!getOne) {
      throw new Error(`Error Getting One Product`);
    }

    successHandler(getOne, res);
  }
);

export const updateProductInfo = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product: ProductInfo = req.body;

    if (!id) {
      throw new Error(`Error Getting id of the Product`);
    }

    const update = await prisma.product.update({
      where: {
        id: String(id),
      },
      data: {
        Product_Info: {
          update: {
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          },
        },
      },
    });

    if (!update) {
      throw new Error(`Error Updateing ${id} Product`);
    }

    successHandler(update, res);
  }
);

export const updateProductInventory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product: ProductInterface = req.body;

    if (!id) {
      throw new Error(`Error Getting id of the Product`);
    }

    const update = await prisma.product.update({
      where: {
        id: String(id),
      },
      data: {
        condition: product.condition,
        status: product.status,
        description: product.description,
      },
    });

    if (!update) {
      throw new Error(`Error Updateing ${id} Product`);
    }

    successHandler(update, res);
  }
);

export const deleteProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error(`Error Getting id of the Product`);
    }

    try {
      await prisma.product_Info.delete({
        where: {
          product_id: String(id),
        },
      });

      await prisma.product.delete({
        where: {
          id: String(id),
        },
      });

      // throw new Error(`Error Getting One Product`);

      successHandler(`Successfully deleted product: ${id}`, res);
    } catch (error) {
      throw new Error("Deleting product failed");
    }
  }
);
