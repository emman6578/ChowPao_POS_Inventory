export interface ProductInterface {
  id?: string;
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

interface ProductInfo {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

interface Category {
  id?: string;
  name: string;
}
