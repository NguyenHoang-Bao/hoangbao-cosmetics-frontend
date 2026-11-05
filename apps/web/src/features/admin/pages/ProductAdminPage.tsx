import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { productApi } from "@/features/product/api/productApi";
import { adminApi } from "../api/adminApi";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";

export const ProductAdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const { data: productsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-products-list", { search: searchTerm, page }],
    queryFn: () =>
      productApi.getProducts({
        search: searchTerm || undefined,
        page,
        size: 15,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      alert("Đã xóa sản phẩm thành công!");
    },
    onError: (err: any) => {
      alert(err?.message || "Không thể xóa sản phẩm này!");
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi hệ thống không?`)) {
      deleteMutation.mutate(id);
    }
  };

  const products = productsData?.content || [];
  const totalElements = productsData?.totalElements || 0;
  const totalPages = productsData?.totalPages || 1;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ── TIÊU ĐỀ & THAO TÁC ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Quản Lý Sản Phẩm & Bảng Giá
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý danh mục mỹ phẩm, biến thể dung tích, giá niêm yết và tồn kho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            <span>Làm mới ({totalElements} sp)</span>
          </button>
        </div>
      </div>

      {/* ── THANH TÌM KIẾM ── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm kiếm sản phẩm theo tên, danh mục, thương hiệu..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* ── BẢNG SẢN PHẨM ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sản Phẩm</th>
                <th className="py-3 px-4">Phân Loại & Hãng</th>
                <th className="py-3 px-4">Biến Thể (SKU)</th>
                <th className="py-3 px-4">Giá Bán</th>
                <th className="py-3 px-4">Tồn Kho</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const mainVariant = p.variants?.[0];
                  const price = mainVariant?.price ?? 0;
                  const originalPrice = mainVariant?.originalPrice;
                  const stock = mainVariant?.stockQuantity ?? 0;

                  return (
                    <tr key={p.idProduct} className="hover:bg-slate-50/80 transition-colors">
                      {/* Cột 1: Sản phẩm */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getProductImageUrl(p.thumbnail)}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-slate-900 truncate">{p.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: #{p.idProduct}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Phân loại */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[11px] font-semibold">
                          {p.category?.name || "Mỹ phẩm"}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {p.brand?.name || "Chính hãng"}
                        </p>
                      </td>

                      {/* Cột 3: Biến thể */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <p className="font-semibold text-slate-800">
                          {mainVariant?.sku || `SKU-${p.idProduct}`}
                        </p>
                        {mainVariant?.capacity && (
                          <span className="text-slate-400">Dung tích: {mainVariant.capacity}</span>
                        )}
                      </td>

                      {/* Cột 4: Giá bán */}
                      <td className="py-3 px-4">
                        <p className="font-black text-rose-600 text-xs">
                          {formatCurrency(price)}
                        </p>
                        {originalPrice && originalPrice > price && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(originalPrice)}
                          </p>
                        )}
                      </td>

                      {/* Cột 5: Tồn kho */}
                      <td className="py-3 px-4">
                        {stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-full text-[10px]">
                            <AlertTriangle size={10} /> Còn {stock} sp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                            {stock} sp
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${p.idProduct}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Xem trang sản phẩm"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.idProduct, p.name)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang {page + 1} / {totalPages} (Tổng {totalElements} sản phẩm)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 cursor-pointer font-medium"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 cursor-pointer font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdminPage;
