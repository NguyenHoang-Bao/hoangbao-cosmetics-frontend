// Loai
export interface Category {
  idCategory: number;
  name: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
}

// Nhan hieu
export interface Brand {
  idBrand: number;
  name: string;
  logo?: string;
  logoUrl?: string;
  description?: string;
}

// Bien the san pham (size, mau, gia)
export interface ProductVariant {
  idVariant: number;
  sku: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  stockQuantity: number;
  volume?: string; // Dung tich ml
  capacity?: string;
  shade?: string;  // Mau sac
}

// San pham chi tiet
export interface Product {
  idProduct: number;
  name: string;
  category: Category;
  brand: Brand;
  description: string;
  benefits?: string;          // Cong dung
  keyIngredients?: string;     // Thanh phan chinh
  usageInstruction?: string;   // Huong dan su dung
  thumbnail: string;
  variants: ProductVariant[];
  images: string[];
}

// Loc va phan trang
export interface ProductFilterParams {
  category?: string;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: "price_asc" | "price_desc" | "newest"; // Sap xep 
}