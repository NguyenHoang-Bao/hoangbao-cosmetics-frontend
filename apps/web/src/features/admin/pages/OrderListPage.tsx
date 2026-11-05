import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Ban,
  Eye,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { adminApi, type AdminOrderFilterParams } from "../api/adminApi";
import { OrderDetailModal } from "../components/OrderDetailModal";
import type { OrderResponse } from "@/features/checkout/api/orderApi";
import { formatCurrency } from "@/lib/utils";

const STATUS_TABS = [
  { id: "ALL", label: "Tất Cả Đơn" },
  { id: "PENDING", label: "Chờ Duyệt" },
  { id: "CONFIRMED", label: "Đã Xác Nhận" },
  { id: "SHIPPING", label: "Đang Giao" },
  { id: "DELIVERED", label: "Đã Giao" },
  { id: "CANCELLED", label: "Đã Hủy" },
] as const;

export const OrderListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentTab = searchParams.get("status") || "ALL";
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filterParams: AdminOrderFilterParams = {
    status: currentTab,
    keyword: searchTerm || undefined,
    page,
    size: 15,
    sortBy: "createdAt",
    sortDir: "desc",
  };

  const {
    data: ordersData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-orders-list", filterParams],
    queryFn: () => adminApi.getOrders(filterParams),
  });

  // Mutation cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: string; note?: string }) =>
      adminApi.updateOrderStatus(id, status, note),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] });
      setSelectedOrder(updated);
      setToastMessage(`Đã cập nhật trạng thái đơn #${updated.orderCode} -> ${updated.status}!`);
      setTimeout(() => setToastMessage(null), 3000);
    },
    onError: (err: any) => {
      alert(err?.message || "Không thể cập nhật trạng thái đơn hàng!");
    },
  });

  // Mutation hủy đơn
  const cancelOrderMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      adminApi.cancelOrder(id, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] });
      setSelectedOrder(updated);
      setToastMessage(`Đã hủy đơn hàng #${updated.orderCode}!`);
      setTimeout(() => setToastMessage(null), 3000);
    },
    onError: (err: any) => {
      alert(err?.message || "Không thể hủy đơn hàng!");
    },
  });

  const handleTabChange = (status: string) => {
    setSearchParams(status === "ALL" ? {} : { status });
    setPage(0);
  };

  const handleViewDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const orders = ordersData?.content || [];
  const totalElements = ordersData?.totalElements || 0;
  const totalPages = ordersData?.totalPages || 1;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ── TIÊU ĐỀ & NÚT REFRESH ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Quản Lý & Duyệt Đơn Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Duyệt đơn online, đối soát COD VietQR và cập nhật trạng thái tiến độ giao hàng.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          <span>Làm mới ({totalElements} đơn)</span>
        </button>
      </div>

      {/* ── BỘ LỌC TABS & TÌM KIẾM ── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        {/* Tabs Trạng Thái */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {STATUS_TABS.map((tab) => {
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Thanh Tìm Kiếm */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm theo mã đơn (ví dụ: HB...), tên khách hàng, số điện thoại..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* ── BẢNG DANH SÁCH ĐƠN HÀNG ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã Đơn & Thời Gian</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Thanh Toán</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.idOrder}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Cột 1: Mã đơn & Thời gian */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ShoppingBag size={13} className="text-rose-600" />
                        <span>#{order.orderCode}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </div>
                      <span className="inline-block px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-bold mt-1">
                        {order.orderType || "ONLINE"}
                      </span>
                    </td>

                    {/* Cột 2: Khách hàng */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-800 truncate">{order.customerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{order.phoneNumber}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </p>
                    </td>

                    {/* Cột 3: Thanh toán */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                          order.webhookStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.webhookStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </td>

                    {/* Cột 4: Tổng tiền */}
                    <td className="py-3.5 px-4">
                      <span className="font-black text-rose-600 text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>

                    {/* Cột 5: Trạng thái đơn */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "SHIPPING"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "CONFIRMED"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {order.status === "PENDING" && <Clock size={11} />}
                        {order.status === "CONFIRMED" && <CheckCircle2 size={11} />}
                        {order.status === "SHIPPING" && <Truck size={11} />}
                        {order.status === "DELIVERED" && <CheckCircle2 size={11} />}
                        {order.status === "CANCELLED" && <Ban size={11} />}
                        <span>{order.status}</span>
                      </span>
                    </td>

                    {/* Cột 6: Thao tác */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Nút xem chi tiết */}
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Duyệt nhanh đơn PENDING */}
                        {order.status === "PENDING" && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: order.idOrder, status: "CONFIRMED" })
                            }
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                            title="Xác nhận duyệt đơn"
                          >
                            Duyệt Đơn
                          </button>
                        )}

                        {/* Giao nhanh đơn CONFIRMED */}
                        {order.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: order.idOrder, status: "SHIPPING" })
                            }
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                            title="Chuyển sang đang giao"
                          >
                            Giao Hàng
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang {page + 1} / {totalPages} (Tổng {totalElements} đơn)
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

      {/* ── MODAL CHI TIẾT ĐƠN HÀNG ── */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={async (id, status, note) => {
          await updateStatusMutation.mutateAsync({ id, status, note });
        }}
        onCancelOrder={async (id, reason) => {
          await cancelOrderMutation.mutateAsync({ id, reason });
        }}
        isUpdating={updateStatusMutation.isPending || cancelOrderMutation.isPending}
      />

      {/* ── TOAST PHẢN HỒI THÀNH CÔNG ── */}
      {toastMessage && (
        <aside
          aria-live="assertive"
          className="fixed top-14 right-4 sm:right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2"
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </aside>
      )}
    </div>
  );
};

export default OrderListPage;
