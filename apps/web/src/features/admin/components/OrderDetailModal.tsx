import React, { useState } from "react";
import {
  X,
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  Truck,
  Ban,
  AlertCircle,
} from "lucide-react";
import type { OrderResponse } from "@/features/checkout/api/orderApi";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";

interface OrderDetailModalProps {
  order: OrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (idOrder: number, status: string, note?: string) => Promise<void>;
  onCancelOrder: (idOrder: number, reason: string) => Promise<void>;
  isUpdating?: boolean;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onCancelOrder,
  isUpdating = false,
}) => {
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  if (!isOpen || !order) return null;

  const handleQuickStatus = async (status: string) => {
    await onUpdateStatus(order.idOrder, status);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn hàng!");
      return;
    }
    await onCancelOrder(order.idOrder, cancelReason.trim());
    setShowCancelPrompt(false);
    setCancelReason("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package size={18} className="text-amber-400" />
            <div>
              <h3 className="font-black text-sm tracking-wide">
                Chi Tiết Đơn Hàng #{order.orderCode}
              </h3>
              <p className="text-[11px] text-slate-400">
                Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Thông tin trạng thái & Khách hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Khách hàng & Giao hàng */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase text-[11px]">
                <User size={13} className="text-rose-600" /> Thông Tin Người Nhận
              </h4>
              <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
              <p className="flex items-center gap-1.5 text-slate-600">
                <Phone size={12} /> {order.phoneNumber}
              </p>
              <p className="flex items-start gap-1.5 text-slate-600">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                <span>{order.deliveryAddress}</span>
              </p>
              {order.note && (
                <p className="text-slate-500 italic mt-1 pt-1 border-t border-slate-200">
                  Ghi chú: {order.note}
                </p>
              )}
            </div>

            {/* Thanh toán & Trạng thái */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase text-[11px]">
                <CreditCard size={13} className="text-indigo-600" /> Thanh Toán & Trạng Thái
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Kênh đặt:</span>
                <span className="font-bold text-slate-800 px-2 py-0.5 bg-slate-200 rounded text-[10px]">
                  {order.orderType || "ONLINE"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Hình thức:</span>
                <span className="font-bold text-slate-800">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Thanh toán:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    order.webhookStatus === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.webhookStatus === "PAID" ? "Đã Thanh Toán (PAID)" : "Chưa Thu Tiền"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Tiến độ đơn:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
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
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách mặt hàng */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2.5">
              Sản Phẩm Trong Đơn ({order.items?.length || 0})
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getProductImageUrl(item.image)}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        SKU: {item.sku || "N/A"} {item.capacity ? `(${item.capacity})` : ""} • SL:{" "}
                        <strong>{item.quantity}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-rose-600 text-xs">
                      {formatCurrency(item.subTotal ?? item.price * item.quantity)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatCurrency(item.price)}/sp
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng kết tiền */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold text-slate-700">
                {formatCurrency(order.totalProductPrice || order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-slate-700">
                {formatCurrency(order.shippingFee || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Tổng thanh toán:</span>
              <span className="text-rose-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Hộp thoại hủy đơn hàng nếu đang mở */}
          {showCancelPrompt && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <AlertCircle size={15} /> Xác nhận hủy đơn hàng và hoàn lại tồn kho
              </div>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy (ví dụ: Khách đổi ý, Hết hàng, Sai thông tin...)"
                rows={2}
                className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isUpdating}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  Xác Nhận Hủy Đơn
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hành Động Cập Nhật Trạng Thái */}
        <div className="bg-slate-100 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500">
            Hành động duyệt đơn sẽ cập nhật kho & gửi thông báo tương ứng.
          </div>

          <div className="flex items-center gap-2">
            {/* Nếu đơn PENDING */}
            {order.status === "PENDING" && (
              <>
                <button
                  onClick={() => setShowCancelPrompt(true)}
                  disabled={isUpdating}
                  className="px-3.5 py-2 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Ban size={14} /> Hủy Đơn
                </button>
                <button
                  onClick={() => handleQuickStatus("CONFIRMED")}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <CheckCircle2 size={14} /> Duyệt Đơn (Xác Nhận)
                </button>
              </>
            )}

            {/* Nếu đơn CONFIRMED */}
            {order.status === "CONFIRMED" && (
              <>
                <button
                  onClick={() => setShowCancelPrompt(true)}
                  disabled={isUpdating}
                  className="px-3.5 py-2 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Ban size={14} /> Hủy Đơn
                </button>
                <button
                  onClick={() => handleQuickStatus("SHIPPING")}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Truck size={14} /> Giao Cho Shipper
                </button>
              </>
            )}

            {/* Nếu đơn SHIPPING */}
            {order.status === "SHIPPING" && (
              <button
                onClick={() => handleQuickStatus("DELIVERED")}
                disabled={isUpdating}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <CheckCircle2 size={14} /> Xác Nhận Đã Giao Thành Công
              </button>
            )}

            {/* Nếu đơn đã DELIVERED hoặc CANCELLED */}
            {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
              <span className="text-xs font-semibold text-slate-500 italic">
                Đơn hàng ở trạng thái kết thúc ({order.status}).
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
