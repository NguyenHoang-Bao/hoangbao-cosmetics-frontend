import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Package,
  Boxes,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  FileText,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { orderApi, type OrderResponse, type OrderStatus } from "@/features/checkout/api/orderApi";
import { formatCurrency } from "@/lib/utils";

// Các bước tiến trình giao hàng chuẩn
interface StepItem {
  key: OrderStatus;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRACKING_STEPS: readonly StepItem[] = [
  {
    key: "PENDING",
    title: "Đã Tiếp Nhận",
    description: "Đơn hàng đã được hệ thống ghi nhận",
    icon: Package,
  },
  {
    key: "PROCESSING",
    title: "Đang Đóng Gói",
    description: "Kho đang chuẩn bị và đóng gói sản phẩm",
    icon: Boxes,
  },
  {
    key: "SHIPPING",
    title: "Đang Vận Chuyển",
    description: "Kiện hàng đã giao cho đơn vị vận chuyển",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    title: "Giao Thành Công",
    description: "Đơn hàng đã được giao đến tay quý khách",
    icon: CheckCircle2,
  },
];

// Hàm xác định step index hiện tại (0-based)
const getStepIndex = (status: string): number => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return 0;
    case "PROCESSING":
      return 1;
    case "SHIPPING":
      return 2;
    case "DELIVERED":
      return 3;
    default:
      return 0;
  }
};

// Định dạng thời gian hiển thị thân thiện
const formatDateTime = (isoDate?: string): string => {
  if (!isoDate) return "---";
  try {
    const d = new Date(isoDate);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
};

// Map phương thức thanh toán sang nhãn hiển thị
const getPaymentMethodLabel = (method?: string): string => {
  switch (method) {
    case "BANK_TRANSFER":
      return "Chuyển khoản VietQR";
    case "MOMO":
      return "Ví điện tử MoMo";
    case "VNPAY":
      return "Cổng thanh toán VNPay";
    case "COD":
    default:
      return "Thanh toán khi nhận hàng (COD)";
  }
};

export const OrderTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orderCode, setOrderCode] = useState<string>(searchParams.get("orderCode") || "");
  const [phone, setPhone] = useState<string>(searchParams.get("phone") || "");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hàm thực hiện tra cứu API
  const handleFetchOrder = useCallback(async (codeToSearch: string, phoneToSearch?: string) => {
    const trimmedCode = codeToSearch.trim();
    if (!trimmedCode) {
      setErrorMessage("Vui lòng nhập mã đơn hàng cần tra cứu!");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await orderApi.getOrderByCode(trimmedCode, phoneToSearch?.trim() || undefined);
      setOrder(data);
    } catch (err: unknown) {
      setOrder(null);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Không thể tra cứu thông tin đơn hàng. Vui lòng kiểm tra lại mã đơn hoặc số điện thoại!");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tự động kích hoạt tra cứu nếu có orderCode trên URL khi load trang
  useEffect(() => {
    const initialCode = searchParams.get("orderCode");
    const initialPhone = searchParams.get("phone") || "";
    if (initialCode) {
      setOrderCode(initialCode);
      setPhone(initialPhone);
      handleFetchOrder(initialCode, initialPhone);
    }
  }, [searchParams, handleFetchOrder]);

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      setErrorMessage("Vui lòng nhập mã đơn hàng!");
      return;
    }

    // Cập nhật Query params trên URL để tiện chia sẻ link hoặc reload
    const newParams: Record<string, string> = { orderCode: orderCode.trim() };
    if (phone.trim()) {
      newParams.phone = phone.trim();
    }
    setSearchParams(newParams);

    handleFetchOrder(orderCode, phone);
  };

  const isCancelled = order?.status?.toUpperCase() === "CANCELLED";
  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-neutral-50/60 py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-medium">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Tra cứu đơn hàng</span>
        </nav>

        {/* ── TIÊU ĐỀ SECTION ── */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 mb-3 border border-rose-100">
            <Truck className="w-3.5 h-3.5" />
            Hệ Thống Vận Hành & Giao Vận
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-neutral-900">
            Tra Cứu Đơn Hàng
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
            Nhập mã đơn hàng và số điện thoại đặt hàng để theo dõi chi tiết hành trình vận chuyển kiện hàng của bạn theo thời gian thực.
          </p>
        </div>

        {/* ── KHUNG FORM TRA CỨU ── */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="orderCode"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                >
                  Mã đơn hàng <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="orderCode"
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="VD: HB2026110112345"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm font-mono font-medium uppercase tracking-wide transition-all"
                    required
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                >
                  Số điện thoại đặt hàng <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0359490221"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm font-medium transition-all"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Bảo mật thông tin: Khách vãng lai cần nhập đúng SĐT để tra cứu.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Thông tin được mã hóa và bảo mật theo chuẩn da liễu Hoàng Bảo
              </span>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-neutral-900 hover:bg-[#0F1E36] disabled:bg-neutral-400 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang Tra Cứu...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Tra Cứu Tiến Độ</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ── THÔNG BÁO LỖI NẾU CÓ ── */}
          {errorMessage && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block mb-0.5">Tra cứu không thành công</strong>
                <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── KẾT QUẢ TRA CỨU ĐƠN HÀNG ── */}
        {order && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* THẺ HEADER ĐƠN HÀNG */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Mã Đơn Hàng
                  </span>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black font-mono text-neutral-900 tracking-tight">
                      {order.orderCode}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Thời Gian Đặt
                  </span>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-700 flex items-center gap-1.5 justify-end">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formatDateTime(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* ── CẢNH BÁO NẾU ĐƠN HÀNG BỊ HỦY ── */}
              {isCancelled ? (
                <div className="my-6 p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3.5 text-rose-900">
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Đơn hàng này đã bị hủy</h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      Đơn hàng đã được ghi nhận hủy trên hệ thống. Nếu quý khách có bất kỳ thắc mắc nào hoặc muốn đặt lại, vui lòng liên hệ Hotline:{" "}
                      <strong className="underline">0359 490 221</strong> để được tư vấn nhanh nhất.
                    </p>
                  </div>
                </div>
              ) : (
                /* ── STEPPER TIẾN TRÌNH 4 BƯỚC ── */
                <div className="py-8">
                  <div className="relative">
                    {/* Thanh nối màu xám nền */}
                    <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-neutral-100 -translate-y-1/2 z-0" />
                    {/* Thanh nối màu đỏ hoàn thành */}
                    <div
                      className="hidden sm:block absolute top-1/2 left-0 h-1 bg-rose-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`,
                      }}
                    />

                    {/* Danh sách 4 bước */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                      {TRACKING_STEPS.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;
                        const IconComponent = step.icon;

                        return (
                          <div
                            key={step.key}
                            className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                          >
                            {/* Icon tròn */}
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 shadow-2xs ${
                                isCompleted
                                  ? "bg-rose-500 border-rose-500 text-white"
                                  : "bg-white border-neutral-300 text-neutral-400"
                              } ${isCurrent ? "ring-4 ring-rose-100 scale-105" : ""}`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>

                            {/* Văn bản bước */}
                            <div className="text-left sm:text-center">
                              <h4
                                className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                                  isCompleted ? "text-neutral-900" : "text-neutral-400"
                                }`}
                              >
                                {step.title}
                              </h4>
                              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── THÔNG TIN NGƯỜI NHẬN & VẬN CHUYỂN ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
                <div className="p-4 bg-neutral-50/70 rounded-2xl border border-neutral-100 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    Thông Tin Người Nhận
                  </span>
                  <div className="text-xs sm:text-sm space-y-1">
                    <p className="font-bold text-neutral-900">{order.customerName}</p>
                    <p className="text-neutral-600 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      {order.phoneNumber}
                    </p>
                    <p className="text-neutral-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50/70 rounded-2xl border border-neutral-100 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                    Hình Thức & Ghi Chú
                  </span>
                  <div className="text-xs sm:text-sm space-y-1">
                    <div>
                      <span className="text-neutral-400 text-[11px] block">Thanh toán:</span>
                      <strong className="text-neutral-900 font-semibold">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </strong>
                    </div>
                    {order.note && (
                      <div className="pt-1">
                        <span className="text-neutral-400 text-[11px] block flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Ghi chú đơn:
                        </span>
                        <p className="text-neutral-700 italic text-xs mt-0.5">"{order.note}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── DANH SÁCH SẢN PHẨM TRONG ĐƠN HÀNG ── */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                Kiện Hàng Chi Tiết
              </h3>

              {order.items && order.items.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {order.items.map((item, idx) => (
                    <div
                      key={item.idOrderDetail || item.idVariant || idx}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                          {item.productName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                          {item.capacity && (
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-medium text-neutral-700">
                              Dung tích: {item.capacity}
                            </span>
                          )}
                          <span>SL: x{item.quantity}</span>
                          <span>•</span>
                          <span>{formatCurrency(item.price)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-extrabold text-neutral-900 font-mono">
                          {formatCurrency(item.subTotal ?? item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 py-3 text-center italic">
                  Không có chi tiết sản phẩm hiển thị.
                </p>
              )}

              {/* ── BẢNG TÍNH TIỀN TỔNG ── */}
              <div className="border-t border-neutral-200 mt-6 pt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Tiền hàng</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(order.totalProductPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-mono font-semibold">
                    {order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "Miễn phí"}
                  </span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-neutral-900 pt-2 border-t border-neutral-100">
                  <span className="uppercase tracking-tight">Tổng thanh toán</span>
                  <span className="font-mono text-rose-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── NÚT HÀNH ĐỘNG DƯỚI CÙNG ── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOrder(null);
                  setOrderCode("");
                  setPhone("");
                  setSearchParams({});
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tra Cứu Đơn Khác</span>
              </button>

              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tiếp Tục Mua Sắm</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
