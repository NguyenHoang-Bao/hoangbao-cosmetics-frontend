import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  RefreshCw
} from 'lucide-react';
import { adminService, type ProductItem, type CategoryItem } from '@/services/adminService';
import { getImageUrl } from '@/utils/imageHelper';
import ProductModal from './ProductModal';

interface ProductManagementProps {
  products: ProductItem[];
  categories: CategoryItem[];
  onRefresh: () => void;
}

export default function ProductManagement({
  products,
  categories,
  onRefresh
}: ProductManagementProps) {
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc' | 'nameAsc'>('newest');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Modal xác nhận xóa
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.inStock).length;
    const outOfStock = total - inStock;
    const brandsCount = new Set(products.map((p) => p.brand).filter(Boolean)).size;
    return { total, inStock, outOfStock, brandsCount };
  }, [products]);

  // Xử lý lọc và sắp xếp
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Lọc từ khóa
        const term = searchTerm.toLowerCase().trim();
        const matchSearch =
          !term ||
          p.name?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term);

        // Lọc danh mục
        const matchCategory =
          selectedCategory === 'all' ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase();

        // Lọc tồn kho
        const matchStock =
          stockFilter === 'all' ||
          (stockFilter === 'inStock' && p.inStock) ||
          (stockFilter === 'outOfStock' && !p.inStock);

        return matchSearch && matchCategory && matchStock;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
        return 0; // default newest
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

  // Tính toán trang hiện tại
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handler mở form thêm mới
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Handler mở form sửa
  const handleEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Handler lưu sản phẩm
  const handleSaveProduct = async (productData: Omit<ProductItem, 'id'> | ProductItem) => {
    if ('id' in productData && productData.id) {
      await adminService.updateProduct(productData.id, productData);
    } else {
      await adminService.createProduct(productData);
    }
    setIsModalOpen(false);
    onRefresh();
  };

  // Handler chuyển đổi nhanh trạng thái còn/hết hàng
  const handleToggleStock = async (product: ProductItem) => {
    await adminService.updateProduct(product.id, { inStock: !product.inStock });
    onRefresh();
  };

  // Handler xóa sản phẩm
  const handleDeleteProduct = async (id: number | string) => {
    await adminService.deleteProduct(id);
    setDeleteConfirmId(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* 1. Thẻ thống kê KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng sản phẩm</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Package size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang còn hàng</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.inStock}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tạm hết hàng</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{stats.outOfStock}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thương hiệu</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.brandsCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* 2. Thanh công cụ & Bộ lọc */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên sản phẩm, mã SKU, thương hiệu..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 transition-colors bg-slate-50/50"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Nút hành động */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} /> Thêm Sản Phẩm Mới
            </button>
          </div>
        </div>

        {/* Các bộ lọc phụ */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Lọc danh mục */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 font-medium">Danh mục:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc tình trạng tồn kho */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 font-medium">Kho:</span>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="inStock">Đang còn hàng</option>
              <option value="outOfStock">Tạm hết hàng</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá: Thấp → Cao</option>
              <option value="priceDesc">Giá: Cao → Thấp</option>
              <option value="nameAsc">Tên sản phẩm A-Z</option>
            </select>
          </div>

          <span className="ml-auto text-slate-400 font-medium">
            Tìm thấy <strong className="text-slate-700">{filteredProducts.length}</strong> sản phẩm
          </span>
        </div>
      </div>

      {/* 3. Bảng danh sách sản phẩm */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 w-20">Hình ảnh</th>
                <th className="py-3.5 px-4">Tên sản phẩm & SKU</th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th className="py-3.5 px-4">Thương hiệu</th>
                <th className="py-3.5 px-4">Giá bán</th>
                <th className="py-3.5 px-4 text-center">Trạng thái kho</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, idx) => {
                  const itemIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  const hasDiscount = product.originalPrice > product.price;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {itemIndex}
                      </td>

                      {/* Hình ảnh */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5 flex items-center justify-center">
                          <img
                            src={getImageUrl(product.thumbnail, { width: 60, height: 60, crop: 'fill' })}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/60x60?text=No+Img';
                            }}
                          />
                        </div>
                      </td>

                      {/* Tên & SKU & Dung tích */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            {product.sku || 'N/A'}
                          </span>
                          {product.capacity && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              • {product.capacity}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Danh mục */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          {product.category || 'Mỹ phẩm'}
                        </span>
                      </td>

                      {/* Thương hiệu */}
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {product.brand || '---'}
                      </td>

                      {/* Giá */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-rose-600">
                          {product.price.toLocaleString('vi-VN')}₫
                        </div>
                        {hasDiscount && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {product.originalPrice.toLocaleString('vi-VN')}₫
                          </div>
                        )}
                      </td>

                      {/* Trạng thái kho */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStock(product)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            product.inStock
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                          title="Bấm để đổi trạng thái kho"
                        >
                          {product.inStock ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Còn hàng
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Tạm hết
                            </>
                          )}
                        </button>
                      </td>

                      {/* Nút hành động */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Xem trước trên web */}
                          <a
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Xem trang sản phẩm"
                          >
                            <ExternalLink size={15} />
                          </a>

                          {/* Sửa */}
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Xóa */}
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">Không tìm thấy sản phẩm phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} trên tổng số{' '}
              {filteredProducts.length} sản phẩm
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Trước
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-semibold cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-rose-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm / Chỉnh Sửa */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
      />

      {/* Modal xác nhận xóa */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Xác nhận xóa sản phẩm</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
