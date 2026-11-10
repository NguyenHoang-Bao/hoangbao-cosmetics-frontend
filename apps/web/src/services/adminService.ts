import { apiClient } from '@hoangbao/api-client';
import type { ApiResponse, PageResponse } from '@hoangbao/types';
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

export interface DashboardOverviewData {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockVariants: number;
}

export interface AdminOrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

export interface AdminOrder {
  id: string;
  numericId?: number;
  date: string;
  source: 'AI_ONLINE' | 'POS_STORE' | 'ADMIN_MANUAL';
  channelName: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'returned';
  statusText: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  shippingAddress: string;
  phone: string;
  customerName: string;
  paymentMethod: string;
  paymentStatus?: 'paid' | 'unpaid';
  codStatus?: 'reconciled' | 'pending_cod_transfer' | 'store_collected';
  codStatusText?: string;
  trackingNumber?: string;
  carrier?: string;
  paymentCode?: string;
  shippingMethod?: string;
  note?: string;
  items: AdminOrderItem[];
}

const STORAGE_PRODUCTS_KEY = 'hb_admin_products';
const STORAGE_CATEGORIES_KEY = 'hb_admin_categories';

// Khởi tạo dữ liệu mẫu nếu chưa có trong LocalStorage làm fallback an toàn
function getFallbackProducts(): ProductItem[] {
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

function getFallbackCategories(): CategoryItem[] {
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

// Map từ ProductResponse của Backend sang ProductItem của Admin UI
function mapBackendProductToItem(p: any): ProductItem {
  const firstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
  const inStock = p.variants ? p.variants.some((v: any) => (v.stockQuantity || 0) > 0) : true;

  let benefitsArr: string[] = [];
  if (Array.isArray(p.benefits)) {
    benefitsArr = p.benefits;
  } else if (typeof p.benefits === 'string' && p.benefits.startsWith('[')) {
    try {
      benefitsArr = JSON.parse(p.benefits);
    } catch {
      benefitsArr = [p.benefits];
    }
  } else if (p.benefits) {
    benefitsArr = [p.benefits];
  }

  let ingredientsArr: string[] = [];
  if (Array.isArray(p.keyIngredients)) {
    ingredientsArr = p.keyIngredients;
  } else if (typeof p.keyIngredients === 'string' && p.keyIngredients.startsWith('[')) {
    try {
      ingredientsArr = JSON.parse(p.keyIngredients);
    } catch {
      ingredientsArr = [p.keyIngredients];
    }
  } else if (p.keyIngredients) {
    ingredientsArr = [p.keyIngredients];
  }

  return {
    id: p.idProduct,
    sku: firstVariant?.sku || `HB-${p.idProduct}`,
    slug: p.category?.slug || `san-pham-${p.idProduct}`,
    name: p.name,
    brand: p.brand?.name || 'Hoàng Bảo',
    category: p.category?.name || 'Mỹ phẩm',
    subCategory: p.category?.slug || '',
    price: Number(firstVariant?.price || 0),
    originalPrice: Number(firstVariant?.originalPrice || firstVariant?.price || 0),
    capacity: firstVariant?.capacity || 'Tiêu chuẩn',
    description: p.description || '',
    benefits: benefitsArr,
    keyIngredients: ingredientsArr,
    usage: p.usageInstruction || '',
    thumbnail: p.thumbnail || (p.images && p.images[0]) || '',
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.thumbnail || ''],
    inStock: inStock,
    image: p.thumbnail || '',
    rating: 5,
    reviewCount: 0,
    createdAt: new Date().toISOString()
  };
}

// Map từ CategoryResponse của Backend sang CategoryItem
function mapBackendCategoryToItem(c: any): CategoryItem {
  return {
    id: c.idCategory,
    name: c.name,
    slug: c.slug || '',
    description: c.name,
    banner: c.thumbnail || '',
    featured: true
  };
}

// Map từ OrderResponse của Backend sang AdminOrder
function mapBackendOrderToAdminOrder(o: any): AdminOrder {
  const isPos = o.orderType === 'POS';
  const statusMap: Record<string, { status: AdminOrder['status']; text: string }> = {
    PENDING: { status: 'pending', text: 'Chờ xác nhận' },
    CONFIRMED: { status: 'processing', text: 'Đã xác nhận & Chờ đóng gói' },
    SHIPPING: { status: 'shipping', text: 'Đang vận chuyển' },
    DELIVERED: { status: 'delivered', text: 'Giao hàng thành công' },
    CANCELLED: { status: 'cancelled', text: 'Đã hủy đơn' }
  };

  const currentStatus = statusMap[o.status] || { status: 'pending', text: o.status || 'Chờ xác nhận' };
  const isCod = o.paymentMethod === 'COD';
  const isPaid = o.webhookStatus === 'PAID' || (!isCod && o.status !== 'CANCELLED') || o.status === 'DELIVERED';

  let codStatus: AdminOrder['codStatus'] = isCod ? 'pending_cod_transfer' : 'store_collected';
  let codStatusText = isCod ? 'Bưu điện đang giữ COD' : 'Đã thanh toán';

  if (isCod && o.status === 'DELIVERED') {
    codStatus = 'reconciled';
    codStatusText = 'Đã đối soát vào ví shop';
  }

  const items: AdminOrderItem[] = Array.isArray(o.items)
    ? o.items.map((it: any) => ({
        id: it.idOrderDetail || it.idVariant || Math.random(),
        name: it.productName || 'Sản phẩm',
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 1),
        size: it.capacity || ''
      }))
    : [];

  const createdDate = o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : 'Mới tạo';

  return {
    id: o.orderCode || `#ORDER${String(o.idOrder).padStart(4, '0')}`,
    numericId: o.idOrder,
    date: createdDate,
    source: isPos ? 'POS_STORE' : 'AI_ONLINE',
    channelName: isPos ? 'Quầy Thu Ngân POS' : 'Online (Web)',
    status: currentStatus.status,
    statusText: currentStatus.text,
    total: Number(o.totalAmount || 0),
    shippingFee: Number(o.shippingFee || 0),
    shippingAddress: o.deliveryAddress || 'Nhận tại quầy',
    phone: o.phoneNumber || '',
    customerName: o.customerName || 'Khách vãng lai',
    paymentMethod: o.paymentMethod === 'COD' ? 'Thu tiền khi nhận (COD)' : (o.paymentMethod || 'Chuyển khoản VietQR'),
    paymentStatus: isPaid ? 'paid' : 'unpaid',
    codStatus: codStatus,
    codStatusText: codStatusText,
    carrier: isPos ? 'Bán trực tiếp' : 'Giao Hàng Tiết Kiệm (GHTK)',
    note: o.note || '',
    items
  };
}

// Service quản lý Nghiệp vụ Admin (Kết nối trực tiếp API Backend)
export const adminService = {
  // Lấy toàn bộ sản phẩm từ Backend Database
  async getProducts(): Promise<ProductItem[]> {
    try {
      const response = await apiClient.get<any, ApiResponse<PageResponse<any>>>(
        '/products?page=0&size=200&sortBy=idProduct&sortDir=desc'
      );
      if (response && response.data && Array.isArray(response.data.content) && response.data.content.length > 0) {
        const mapped = response.data.content.map(mapBackendProductToItem);
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('[adminService.getProducts] Không thể kết nối API Backend, sử dụng kho dự phòng:', err);
    }
    return getFallbackProducts();
  },

  // Thêm mới sản phẩm lên Backend
  async createProduct(productData: Omit<ProductItem, 'id'>): Promise<ProductItem> {
    try {
      // Tìm category ID hoặc mặc định là 1
      const categories = await this.getCategories();
      const matchedCat = categories.find(
        (c) => c.name.toLowerCase() === (productData.category || '').toLowerCase()
      );
      const catId = matchedCat ? Number(matchedCat.id) : 1;

      const payload = {
        name: productData.name,
        idCategory: catId,
        idBrand: 1, // Mặc định Brand 1 (Hoàng Bảo)
        description: productData.description || '',
        benefits: Array.isArray(productData.benefits) ? JSON.stringify(productData.benefits) : (productData.benefits || ''),
        keyIngredients: Array.isArray(productData.keyIngredients) ? JSON.stringify(productData.keyIngredients) : (productData.keyIngredients || ''),
        usageInstruction: productData.usage || '',
        thumbnail: productData.thumbnail || '',
        variants: [
          {
            sku: productData.sku || `HB-${Date.now().toString().slice(-6)}`,
            capacity: productData.capacity || 'Tiêu chuẩn',
            originalPrice: Number(productData.originalPrice || productData.price || 0),
            price: Number(productData.price || 0),
            stockQuantity: productData.inStock ? 50 : 0
          }
        ],
        imageUrls: productData.images && productData.images.length > 0 ? productData.images : [productData.thumbnail]
      };

      const response = await apiClient.post<any, ApiResponse<any>>('/products', payload);
      if (response && response.data) {
        return mapBackendProductToItem(response.data);
      }
    } catch (err) {
      console.warn('[adminService.createProduct] API thất bại, lưu tạm vào LocalStorage:', err);
    }

    // Fallback nếu API lỗi
    const products = getFallbackProducts();
    const newProduct: ProductItem = {
      ...productData,
      id: Date.now(),
      image: productData.thumbnail,
      rating: productData.rating || 5,
      reviewCount: productData.reviewCount || 0,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  // Cập nhật sản phẩm trên Backend
  async updateProduct(id: number | string, updatedData: Partial<ProductItem>): Promise<ProductItem | null> {
    try {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        const categories = await this.getCategories();
        const matchedCat = categories.find(
          (c) => c.name.toLowerCase() === (updatedData.category || '').toLowerCase()
        );
        const catId = matchedCat ? Number(matchedCat.id) : 1;

        const payload = {
          name: updatedData.name || 'Sản phẩm',
          idCategory: catId,
          idBrand: 1,
          description: updatedData.description || '',
          benefits: Array.isArray(updatedData.benefits) ? JSON.stringify(updatedData.benefits) : (updatedData.benefits || ''),
          keyIngredients: Array.isArray(updatedData.keyIngredients) ? JSON.stringify(updatedData.keyIngredients) : (updatedData.keyIngredients || ''),
          usageInstruction: updatedData.usage || '',
          thumbnail: updatedData.thumbnail || '',
          variants: [
            {
              sku: updatedData.sku || `HB-${numId}`,
              capacity: updatedData.capacity || 'Tiêu chuẩn',
              originalPrice: Number(updatedData.originalPrice || updatedData.price || 0),
              price: Number(updatedData.price || 0),
              stockQuantity: updatedData.inStock !== false ? 50 : 0
            }
          ],
          imageUrls: updatedData.images && updatedData.images.length > 0 ? updatedData.images : [updatedData.thumbnail || '']
        };

        const response = await apiClient.put<any, ApiResponse<any>>(`/products/${numId}`, payload);
        if (response && response.data) {
          return mapBackendProductToItem(response.data);
        }
      }
    } catch (err) {
      console.warn('[adminService.updateProduct] API thất bại, lưu tạm vào LocalStorage:', err);
    }

    // Fallback
    const products = getFallbackProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedData,
      image: updatedData.thumbnail || products[index].thumbnail
    };
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    return products[index];
  },

  // Xóa sản phẩm trên Backend
  async deleteProduct(id: number | string): Promise<boolean> {
    try {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        await apiClient.delete<any, ApiResponse<void>>(`/products/${numId}`);
      }
    } catch (err) {
      console.warn('[adminService.deleteProduct] API thất bại, xóa trên LocalStorage:', err);
    }

    const products = getFallbackProducts();
    const filtered = products.filter((p) => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Lấy toàn bộ danh mục từ Backend
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const response = await apiClient.get<any, ApiResponse<any[]>>('/categories');
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const mapped = response.data.map(mapBackendCategoryToItem);
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('[adminService.getCategories] Không thể kết nối API Backend, sử dụng kho dự phòng:', err);
    }
    return getFallbackCategories();
  },

  // Thêm mới danh mục lên Backend
  async createCategory(categoryData: Omit<CategoryItem, 'id'>): Promise<CategoryItem> {
    try {
      const payload = {
        name: categoryData.name,
        slug: categoryData.slug || this.createSlug(categoryData.name),
        thumbnail: categoryData.banner || ''
      };
      const response = await apiClient.post<any, ApiResponse<any>>('/categories', payload);
      if (response && response.data) {
        return mapBackendCategoryToItem(response.data);
      }
    } catch (err) {
      console.warn('[adminService.createCategory] API thất bại, lưu tạm vào LocalStorage:', err);
    }

    const categories = getFallbackCategories();
    const newCategory: CategoryItem = {
      ...categoryData,
      id: Date.now()
    };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
  },

  // Cập nhật danh mục trên Backend
  async updateCategory(id: number | string, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    try {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        const payload = {
          name: data.name || '',
          slug: data.slug || this.createSlug(data.name || ''),
          thumbnail: data.banner || ''
        };
        const response = await apiClient.put<any, ApiResponse<any>>(`/categories/${numId}`, payload);
        if (response && response.data) {
          return mapBackendCategoryToItem(response.data);
        }
      }
    } catch (err) {
      console.warn('[adminService.updateCategory] API thất bại, lưu tạm vào LocalStorage:', err);
    }

    const categories = getFallbackCategories();
    const index = categories.findIndex((c) => String(c.id) === String(id));
    if (index === -1) return null;

    categories[index] = { ...categories[index], ...data };
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    return categories[index];
  },

  // Xóa danh mục trên Backend
  async deleteCategory(id: number | string): Promise<boolean> {
    try {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        await apiClient.delete<any, ApiResponse<void>>(`/categories/${numId}`);
      }
    } catch (err) {
      console.warn('[adminService.deleteCategory] API thất bại, xóa trên LocalStorage:', err);
    }

    const categories = getFallbackCategories();
    const filtered = categories.filter((c) => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(filtered));
    return true;
  },

  // Lấy dữ liệu KPI Dashboard từ Backend
  async getDashboardOverview(): Promise<DashboardOverviewData | null> {
    try {
      const response = await apiClient.get<any, ApiResponse<DashboardOverviewData>>(
        '/admin/dashboard/overview'
      );
      if (response && response.data) {
        return {
          totalRevenue: Number(response.data.totalRevenue || 0),
          todayRevenue: Number(response.data.todayRevenue || 0),
          totalOrders: Number(response.data.totalOrders || 0),
          pendingOrders: Number(response.data.pendingOrders || 0),
          totalProducts: Number(response.data.totalProducts || 0),
          totalCustomers: Number(response.data.totalCustomers || 0),
          lowStockVariants: Number(response.data.lowStockVariants || 0)
        };
      }
    } catch (err) {
      console.warn('[adminService.getDashboardOverview] Không thể tải KPI từ API:', err);
    }
    return null;
  },

  // Lấy danh sách tất cả đơn hàng cho Admin/Staff
  async getAdminOrders(params?: {
    status?: string;
    orderType?: string;
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<AdminOrder[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.orderType) query.set('orderType', params.orderType);
      if (params?.keyword) query.set('keyword', params.keyword);
      query.set('page', String(params?.page || 0));
      query.set('size', String(params?.size || 50));
      query.set('sortBy', 'createdAt');
      query.set('sortDir', 'desc');

      const response = await apiClient.get<any, ApiResponse<PageResponse<any>>>(
        `/admin/orders?${query.toString()}`
      );
      if (response && response.data && Array.isArray(response.data.content)) {
        return response.data.content.map(mapBackendOrderToAdminOrder);
      }
    } catch (err) {
      console.warn('[adminService.getAdminOrders] Lỗi tải đơn hàng từ server:', err);
    }
    return [];
  },

  // Cập nhật trạng thái đơn hàng (Duyệt, Giao hàng, Hoàn thành)
  async updateOrderStatus(idOrder: number, status: string, note?: string): Promise<any> {
    const payload = {
      status,
      note: note || `Admin cập nhật trạng thái sang ${status}`
    };
    return await apiClient.patch<any, ApiResponse<any>>(`/admin/orders/${idOrder}/status`, payload);
  },

  // Hủy đơn hàng và hoàn tồn kho
  async cancelOrder(idOrder: number, reason: string): Promise<any> {
    const payload = { reason };
    return await apiClient.post<any, ApiResponse<any>>(`/admin/orders/${idOrder}/cancel`, payload);
  },

  // Tạo đơn hàng tại quầy POS
  async createPosOrder(payload: any): Promise<any> {
    return await apiClient.post<any, ApiResponse<any>>('/admin/orders/pos', payload);
  },

  // Lấy danh sách phiếu nhập kho
  async getImportReceipts(page = 0, size = 20): Promise<any[]> {
    try {
      const response = await apiClient.get<any, ApiResponse<PageResponse<any>>>(
        `/admin/warehouse/import-receipts?page=${page}&size=${size}`
      );
      if (response && response.data && Array.isArray(response.data.content)) {
        return response.data.content;
      }
    } catch (err) {
      console.warn('[adminService.getImportReceipts] Lỗi tải phiếu nhập kho:', err);
    }
    return [];
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
