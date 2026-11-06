import initialProducts from '../data/products.json';
import initialCategories from '../data/categories.json';

export interface ProductItem {
  id: number | string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  rating?: number;
  reviewCount?: number;
  capacity?: string;
  description?: string;
  benefits?: string[];
  keyIngredients?: string[];
  usage?: string;
  thumbnail: string;
  images: string[];
  inStock: boolean;
  image?: string;
  createdAt?: string;
}

export interface CategoryItem {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  banner: string;
  featured: boolean;
}

const STORAGE_PRODUCTS_KEY = 'hb_admin_products';
const STORAGE_CATEGORIES_KEY = 'hb_admin_categories';

// Khởi tạo dữ liệu mẫu nếu chưa có trong LocalStorage
function getInitialProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading products from storage', err);
  }
  const products = initialProducts as unknown as ProductItem[];
  localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  return products;
}

function getInitialCategories(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading categories from storage', err);
  }
  const categories = initialCategories as unknown as CategoryItem[];
  localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
}

// Service quản lý Sản phẩm & Danh mục
export const adminService = {
  // Lấy toàn bộ sản phẩm
  getProducts(): ProductItem[] {
    return getInitialProducts();
  },

  // Lưu danh sách sản phẩm
  saveProducts(products: ProductItem[]): void {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  },

  // Thêm mới sản phẩm
  createProduct(productData: Omit<ProductItem, 'id'>): ProductItem {
    const products = this.getProducts();
    const newId = Date.now();
    const newProduct: ProductItem = {
      ...productData,
      id: newId,
      image: productData.thumbnail,
      rating: productData.rating || 5,
      reviewCount: productData.reviewCount || 0,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  // Cập nhật sản phẩm
  updateProduct(id: number | string, updatedData: Partial<ProductItem>): ProductItem | null {
    const products = this.getProducts();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedData,
      image: updatedData.thumbnail || products[index].thumbnail
    };
    this.saveProducts(products);
    return products[index];
  },

  // Xóa sản phẩm
  deleteProduct(id: number | string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => String(p.id) !== String(id));
    if (filtered.length === products.length) return false;
    this.saveProducts(filtered);
    return true;
  },

  // Lấy toàn bộ danh mục
  getCategories(): CategoryItem[] {
    return getInitialCategories();
  },

  // Lưu danh sách danh mục
  saveCategories(categories: CategoryItem[]): void {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  },

  // Thêm danh mục
  createCategory(categoryData: Omit<CategoryItem, 'id'>): CategoryItem {
    const categories = this.getCategories();
    const newCategory: CategoryItem = {
      ...categoryData,
      id: Date.now()
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  },

  // Cập nhật danh mục
  updateCategory(id: number | string, data: Partial<CategoryItem>): CategoryItem | null {
    const categories = this.getCategories();
    const index = categories.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    categories[index] = { ...categories[index], ...data };
    this.saveCategories(categories);
    return categories[index];
  },

  // Xoá danh mục
  deleteCategory(id: number | string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => String(c.id) !== String(id));
    if (filtered.length === categories.length) return false;
    this.saveCategories(filtered);
    return true;
  },

  // Tạo slug tự động từ tiếng Việt
  createSlug(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
};
