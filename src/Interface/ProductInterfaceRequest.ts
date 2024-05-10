export interface ProductInterface {
  barcode: string;
  Product_Info?: ProductInfo | null;
  Category: Category[];
  supplier: string;
  condition: string;
  status: string;
  minimum_stock_level: number;
  maximum_stock_level: number;
  description: string;
}

export interface ProductInfo {
  name: string;
  quantity: number;
  price: number;
}

export interface Category {
  name: string;
}
