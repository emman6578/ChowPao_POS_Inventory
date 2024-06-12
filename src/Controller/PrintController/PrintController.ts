import { Request, Response } from "express";
import { Measurement, PrismaClient, StockStatus } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import {
  generateToken,
  validateToken,
} from "../../Middleware/downloadTokenMiddleware";
import { AuthRequest } from "../../Middleware/authMiddleware";

import multer from "multer";

const prisma = new PrismaClient();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "Uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer to use the uploads directory
const upload = multer({ dest: uploadsDir });

const createExcelFile = async (products: any[], filePath: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products");

  const columns = [
    { header: "ID", key: "id" },
    { header: "Barcode", key: "barcode" },
    { header: "Name", key: "name" },
    { header: "Quantity", key: "quantity" },
    { header: "Price", key: "price" },
    { header: "Brand", key: "brand" },
    { header: "Description", key: "description" },
    { header: "Unit of Measure", key: "unit_of_measure" },
    { header: "Expiration", key: "expiration" },
    { header: "Date of Manufacture", key: "date_of_manufacture" },
    { header: "Date of Entry", key: "date_of_entry" },
    { header: "Supplier", key: "supplier" },
    { header: "Stock Status", key: "stock_status" },
    { header: "Minimum Stock Level", key: "minimum_stock_level" },
    { header: "Maximum Stock Level", key: "maximum_stock_level" },
    { header: "Created At", key: "createdAt" },
    { header: "Updated At", key: "updatedAt" },
    { header: "Category", key: "category" },
  ];
  worksheet.columns = columns;

  products.forEach((product) => {
    worksheet.addRow({
      ...product,
      category: product.Category.map((cat: any) => cat.name).join(", "),
    });
  });

  // Add data validation for the "Stock Status" column
  worksheet
    .getColumn(13)
    .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber > 1) {
        // Skip the header row
        cell.dataValidation = {
          type: "list",
          allowBlank: false,
          formulae: ['"IN_STOCK,OUT_OF_STOCK,LOW_STOCK"'],
          showErrorMessage: true,
          errorTitle: "Invalid Unit of Measure",
          error:
            "Please select a value from the dropdown list: IN_STOCK, OUT_OF_STOCK, LOW_STOCK",
        };
      }
    });

  // Add data validation for the "Unit of Measure" column
  worksheet.getColumn(8).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
    if (rowNumber > 1) {
      // Skip the header row
      cell.dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ['"KILOGRAMS,LITERS,PIECES"'],
        showErrorMessage: true,
        errorTitle: "Invalid Unit of Measure",
        error:
          "Please select a value from the dropdown list: KILOGRAMS, LITERS, PIECES",
      };
    }
  });

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  await workbook.xlsx.writeFile(filePath);
};

const readExcelFile = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  let worksheet: ExcelJS.Worksheet | undefined;
  workbook.eachSheet((sheet) => {
    if (sheet.name === "Products") {
      worksheet = sheet;
    }
  });

  if (!worksheet) {
    throw new Error("Worksheet 'Products' not found in the Excel file.");
  }

  const productsToUpdate: {
    [key: string]: {
      barcode?: string;
      name?: string;
      quantity?: number;
      price?: number;
      brand?: string;
      description?: string;
      unit_of_measure?: Measurement;
      stock_status?: StockStatus;
      minimum_stock_level?: number;
      maximum_stock_level?: number;
    };
  } = {};

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData_id = row.getCell(1).value?.toString();
    if (rowData_id) {
      productsToUpdate[rowData_id] = {
        barcode: row.getCell(2).value?.toString(),
        name: row.getCell(3).value?.toString(),
        quantity: row.getCell(4).value as number,
        price: row.getCell(5).value as number,
        brand: row.getCell(6).value?.toString(),
        description: row.getCell(7).value?.toString(),
        unit_of_measure: row.getCell(8).value as Measurement,
        stock_status: row.getCell(13).value as StockStatus,
        minimum_stock_level: row.getCell(14).value as number,
        maximum_stock_level: row.getCell(15).value as number,
      };
    }
  });

  return productsToUpdate;
};

const updateProductsInDatabase = async (productsToUpdate: {
  [key: string]: {
    barcode?: string;
    name?: string;
    quantity?: number;
    price?: number;
    brand?: string;
    description?: string;
    unit_of_measure?: Measurement;
    stock_status?: StockStatus;
    minimum_stock_level?: number;
    maximum_stock_level?: number;
  };
}) => {
  const updates = Object.entries(productsToUpdate).map(([id, data]) => ({
    where: { id },
    data: {
      barcode: data.barcode,
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      brand: data.brand,
      description: data.description,
      unit_of_measure: data.unit_of_measure,
      stock_status: data.stock_status,
      minimum_stock_level: data.minimum_stock_level,
      maximum_stock_level: data.maximum_stock_level,
    },
  }));

  await Promise.all(
    updates.map(async (update) => {
      await prisma.product.update({
        where: { id: update.where.id },
        data: update.data,
      });
    })
  );
};

export const print = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          Category: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!products || products.length === 0) {
        throw new Error("Error Getting all Products or Database is empty");
      }

      const directoryPath = path.join(__dirname, "../../../Download");
      // const filePath = path.join(directoryPath, "products.xlsx");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filePath = path.join(directoryPath, `products_${timestamp}.xlsx`);

      await createExcelFile(products, filePath);

      console.log("Excel file generated successfully.");
      res.status(200).send("Excel file generated successfully.");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      res.status(500).send("Error generating Excel file.");
    }
  }
);

export const update = [
  upload.single("file"),
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        throw new Error("File not provided.");
      }

      const productsToUpdate = await readExcelFile(file.path);

      await updateProductsInDatabase(productsToUpdate);

      // Delete the uploaded file after processing
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully:", file.path);
        }
      });

      console.log("Products updated successfully from Excel file.");
      res.status(200).send("Products updated successfully from Excel file.");
    } catch (error) {
      console.error("Error updating products from Excel file:", error);
      res.status(500).send("Error updating products from Excel file." + error);
    }
  }),
];

export const listFileInDownloadsFolder = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const admin = req.admin?.id;

    const generateDownloadToken = generateToken(admin);

    try {
      const directoryPath = path.join(__dirname, "../../../Download");
      const files = fs.readdirSync(directoryPath);
      const excelFiles = files.filter((file) => file.endsWith(".xlsx"));
      // You can send the list of files as a response
      res
        .status(200)
        .json({ files: excelFiles, downloadToken: generateDownloadToken });
    } catch (error) {
      console.error("Error listing files in the download folder:", error);
      res.status(500).send("Error listing files in the download folder.");
    }
  }
);

export const download = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const token: any = req.query.token;
      if (!token || !validateToken(token)) {
        res.status(401).send("Unauthorized");
        return;
      }

      const filePath = path.join(
        __dirname,
        "../../../Download",
        req.params.filename
      );
      if (!fs.existsSync(filePath)) {
        res.status(404).send("File not found.");
        return;
      }

      res.download(filePath, req.params.filename, (err) => {
        if (err) {
          console.error("Error downloading the file:", err);
          res.status(500).send("Problem downloading the file.");
        } else {
          // Delete the file after successful download
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting the file:", unlinkErr);
            } else {
              console.log("File deleted successfully:", filePath);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error processing download request:", error);
      res.status(500).send("Error processing download request.");
    }
  }
);
