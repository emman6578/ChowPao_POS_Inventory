import {
  ProductInterface,
  ProductInfo,
  Category,
} from "../../Interface/ProductInterfaceRequest";

function validateProductFields(
  product: ProductInterface,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];
  for (const field of requiredFields) {
    if (!(field in product)) {
      missingFields.push(field);
    }
  }
  return missingFields;
}

function validateProductInfoUpdateFields(
  product: ProductInfo,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];
  for (const field of requiredFields) {
    if (!(field in product)) {
      missingFields.push(field);
    }
  }
  return missingFields;
}

function validateProductInventoryUpdateFields(
  product: Category,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];
  for (const field of requiredFields) {
    if (!(field in product)) {
      missingFields.push(field);
    }
  }
  return missingFields;
}

export function checkRequiredFields(req: any) {
  const requiredFields: string[] = [
    "barcode",
    "Product_Info",
    "Category",
    "supplier",
    "condition",
    "status",
    "minimum_stock_level",
    "maximum_stock_level",
    "description",
  ];

  // Check if all required fields are present in req.body
  const missingFields = validateProductFields(req.body, requiredFields);
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields in the request body: ${missingFields.join(", ")}`
    );
  }
}

export function checkRequiredFieldsProductInfo(req: any) {
  const requiredFields: string[] = ["name", "quantity", "price"];

  // Check if all required fields are present in req.body
  const missingFields = validateProductInfoUpdateFields(
    req.body,
    requiredFields
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields in the request body: ${missingFields.join(", ")}`
    );
  }
}

export function checkRequiredFieldsProductInventory(req: any) {
  const requiredFields: string[] = ["condition", "status", "description"];

  // Check if all required fields are present in req.body
  const missingFields = validateProductInventoryUpdateFields(
    req.body,
    requiredFields
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields in the request body: ${missingFields.join(", ")}`
    );
  }
}
