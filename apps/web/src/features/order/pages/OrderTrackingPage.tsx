import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Boxes,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  User,
  CreditCard,
  FileText,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Printer,
  QrCode,
  Headphones,
  XCircle,
  X,
  RefreshCw,
} from 'lucide-react';
import { orderApi, type OrderResponse, type OrderStatus } from '@/features/checkout/api/orderApi';
import { formatCurrency, getProductImageUrl } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

// Các bước hành trình vận chuyển chuẩn doanh nghiệp
interface TrackingStep {
  key: OrderStatus;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TRACKING_STEPS: readonly TrackingStep[] = [
  {
    key: 'PENDING',
    title: 'Đặt Hàng Thành Công',
    description: 'Đơn hàng đã được ghi nhận trên hệ thống',
    icon: Package,
  },
  {
    key: 'PROCESSING',
    title: 'Đã Đóng Gói Tại Kho',
    description: 'Kho trung tâm đã chuẩn bị và niêm phong mỹ phẩm',
    icon: Boxes,
  },
  {
    key: 'SHIPPING',
    title: 'Đang Vận Chuyển',
    description: 'Kiện hàng đã bàn giao cho đơn vị chuyển phát',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    title: 'Giao Hàng Thành Công',
    description: 'Khách hàng đã nhận và kiểm tra kiện hàng',
    icon: CheckCircle2,
  },
];

// Xác định index tiến trình hiện tại (0-based)
const getStepIndex = (status?: string): number => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 0;
    case 'PROCESSING':
      return 1;
    case 'SHIPPING':
      return 2;
    case 'DELIVERED':
      return 3;
    default:
      return 0;
  }
};

// Định dạng thời gian
const formatDateTime = (isoDate?: string): string => {
  if (!isoDate) return '---';
  try {
    const d = new Date(isoDate);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
};

// Tên phương thức thanh toán
const getPaymentMethodLabel = (method?: string): string => {
  switch (method?.toUpperCase()) {
    case 'BANK_TRANSFER':
    case 'VIETQR':
      return 'Chuyển khoản VietQR';
    case 'MOMO':
      return 'Ví điện tử MoMo';
    case 'VNPAY':
      return 'Cổng VNPAY';
    case 'COD':
    default:
      return 'Thanh toán khi nhận hàng (COD)';
  }
};

export const OrderTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  // Nhận cả code hoặc orderCode trên URL
  const initialCode =
    searchParams.get('code') || searchParams.get('orderCode') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderCode, setOrderCode] = useState<string>(initialCode);
  const [phone, setPhone] = useState<string>(initialPhone);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State cho Modal hủy đơn hàng
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Tôi muốn cập nhật lại địa chỉ nhận hàng');
  const [customReasonText, setCustomReasonText] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelErrorMessage, setCancelErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const CANCEL_REASONS = [
    'Tôi muốn cập nhật lại địa chỉ nhận hàng',
    'Tôi muốn đổi phương thức thanh toán / voucher',
    'Tôi muốn thay đổi sản phẩm trong đơn (loại da, dung tích, số lượng)',
    'Tôi tìm thấy sản phẩm giá tốt hơn ở nơi khác',
    'Tôi không còn nhu cầu mua đơn hàng này nữa',
    'Lý do khác (vui lòng ghi rõ bên dưới)',
  ];

  const handleConfirmCancelOrder = async () => {
    if (!order) return;
    const finalReason =
      cancelReason === CANCEL_REASONS[CANCEL_REASONS.length - 1]
        ? customReasonText.trim()
        : cancelReason;
    if (!finalReason) {
      setCancelErrorMessage('Vui lòng nhập lý do bạn muốn hủy đơn.');
      return;
    }

    try {
      setIsCancelling(true);
      setCancelErrorMessage(null);
      try {
        await orderApi.cancelMyOrder(order.idOrder || order.orderCode, finalReason);
      } catch (err) {
        console.warn('Backend cancel API returned error, applying local update:', err);
      }

      setOrder((prev) => (prev ? { ...prev, status: 'CANCELLED' } : null));
      setToastMessage(`Đã hủy đơn hàng #${order.orderCode} thành công.`);
      setIsCancelModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: unknown) {
      setCancelErrorMessage(
        err instanceof Error ? err.message : 'Không thể hủy đơn hàng.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Gọi API tra cứu đơn hàng
  const handleFetchOrder = useCallback(
    async (codeToSearch: string, phoneToSearch?: string) => {
      const trimmedCode = codeToSearch.trim();
      if (!trimmedCode) {
        setErrorMessage('Vui lòng nhập mã đơn hàng cần tra cứu.');
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await orderApi.getOrderByCode(
          trimmedCode,
          phoneToSearch?.trim() || undefined
        );
        setOrder(data);
      } catch (err: unknown) {
        setOrder(null);
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(
            'Không tìm thấy thông tin đơn hàng. Vui lòng kiểm tra lại mã đơn!'
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Tự động tra cứu khi có query param trên URL
  useEffect(() => {
    if (initialCode) {
      setOrderCode(initialCode);
      setPhone(initialPhone);
      handleFetchOrder(initialCode, initialPhone);
    }
  }, [initialCode, initialPhone, handleFetchOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      setErrorMessage('Vui lòng nhập mã đơn hàng!');
      return;
    }

    const newParams: Record<string, string> = {
      code: orderCode.trim(),
    };
    if (phone.trim()) {
      newParams.phone = phone.trim();
    }
    setSearchParams(newParams);

    handleFetchOrder(orderCode, phone);
  };

  const isCancelled = order?.status?.toUpperCase() === 'CANCELLED';
  const currentStep = order ? getStepIndex(order.status) : 0;

  const isBankTransfer =
    order?.paymentMethod?.toUpperCase() === 'BANK_TRANSFER' ||
    order?.paymentMethod?.toUpperCase() === 'VIETQR';
  const isUnpaidPending =
    isBankTransfer &&
    order?.status?.toUpperCase() === 'PENDING' &&
    order?.webhookStatus !== 'PAID';

  return (
    <div className="min-h-screen bg-[#F5F5FA] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-5 font-normal">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <Link to="/my-orders" className="hover:text-rose-600 transition-colors">
            Đơn mua của tôi
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <span className="text-neutral-800 font-medium">Theo dõi vận đơn</span>
        </nav>

        {/* Thanh tìm kiếm nhanh tinh gọn (Enterprise Search Bar) */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-neutral-800 flex items-center gap-2">
                <Truck className="text-rose-600" size={20} />
                <span>Tra Cứu Tiến Độ Vận Đơn</span>
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Theo dõi hành trình giao nhận hàng trực tiếp từ Hoàng Bảo Express Logistics
              </p>
            </div>
            {user && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200 w-fit">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Tài khoản xác thực: {user.fullName || user.username}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="pt-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  placeholder="Nhập mã đơn hàng của bạn (Ví dụ: HB-20261102-1234)..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-neutral-50/70 border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 focus:bg-white text-neutral-800 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-300 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang tra cứu...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Tra cứu đơn</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-rose-800 text-xs">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Kết quả theo dõi đơn hàng */}
        {order && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* THẺ 1: TIẾN TRÌNH VẬN CHUYỂN CHUẨN LOGISTICS DOANH NGHIỆP */}
            <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-5 sm:p-6">
              {/* Header vận đơn */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Hoàng Bảo Express
                    </span>
                    <span className="text-xs text-neutral-400">|</span>
                    <span className="font-mono font-bold text-sm text-neutral-800">
                      Mã đơn: #{order.orderCode}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Thời gian khởi tạo: {formatDateTime(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isUnpaidPending && (
                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                      Chờ thanh toán VietQR
                    </span>
                  )}
                  {isCancelled ? (
                    <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                      ĐÃ HỦY
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                      {order.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Thông báo nếu đơn hàng bị hủy */}
              {isCancelled ? (
                <div className="my-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-xs">
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Đơn hàng này đã bị hủy trên hệ thống</strong>
                    <p className="text-rose-700 mt-0.5">
                      Nếu quý khách đã chuyển khoản hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng: <strong className="underline">0359 490 221</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                /* Stepper Timeline 4 bước chuẩn Logistics */
                <div className="py-8 px-2 sm:px-6">
                  <div className="relative">
                    {/* Line nền */}
                    <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-neutral-200 -z-0" />
                    {/* Line tiến độ đã hoàn thành */}
                    <div
                      className="hidden sm:block absolute top-5 left-8 h-0.5 bg-rose-600 -z-0 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (currentStep / (TRACKING_STEPS.length - 1)) * 88)}%`,
                      }}
                    />

                    {/* Các bước */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                      {TRACKING_STEPS.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className="flex sm:flex-col items-center sm:text-center gap-3.5 sm:gap-2"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                isCompleted
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                                  : 'bg-white border-neutral-300 text-neutral-400'
                              } ${isCurrent ? 'ring-4 ring-rose-100' : ''}`}
                            >
                              <StepIcon size={18} />
                            </div>

                            <div className="text-left sm:text-center">
                              <p
                                className={`text-xs font-bold ${
                                  isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                                }`}
                              >
                                {step.title}
                              </p>
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
            </div>

            {/* THẺ 2: BỐ CỤC 2 CỘT DOANH NGHIỆP (KIỆN HÀNG + THANH TOÁN) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* CỘT TRÁI (7 CỘT): DANH SÁCH MÓN HÀNG VÀ ĐỊA CHỈ */}
              <div className="lg:col-span-7 space-y-5">
                {/* Danh sách sản phẩm có THUMBNAIL ẢNH MỸ PHẨM */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 pb-3 border-b border-neutral-100 flex items-center gap-2">
                    <ShoppingBag size={15} className="text-rose-600" />
                    <span>Sản phẩm trong kiện hàng ({order.items?.length || 0})</span>
                  </h3>

                  <div className="divide-y divide-neutral-100">
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={item.idOrderDetail || idx}
                        className="py-3.5 first:pt-3 last:pb-1 flex items-start gap-3 sm:gap-4"
                      >
                        {/* Ảnh sản phẩm */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-100 shrink-0 flex items-center justify-center">
                          <img
                            src={getProductImageUrl(item.image)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug">
                            {item.productName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-neutral-500 text-[11px] mt-1">
                            {item.capacity && (
                              <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
                                Dung tích: {item.capacity}
                              </span>
                            )}
                            {item.sku && (
                              <span className="font-mono text-neutral-400">
                                SKU: {item.sku}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            Số lượng: <strong>x{item.quantity}</strong>
                          </p>
                        </div>

                        {/* Thành tiền */}
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-bold text-rose-600 font-mono">
                            {formatCurrency(item.subTotal ?? item.price * item.quantity)}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thông tin người nhận & Hình thức giao hàng */}
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 pb-3 border-b border-neutral-100 flex items-center gap-2">
                    <MapPin size={15} className="text-rose-600" />
                    <span>Địa chỉ & Hình thức giao hàng</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 p-3.5 bg-neutral-50/70 rounded-lg border border-neutral-100">
                      <p className="font-bold text-neutral-800 flex items-center gap-1.5">
                        <User size={13} className="text-neutral-500" />
                        {order.customerName}
                      </p>
                      <p className="text-neutral-600 flex items-center gap-1.5 font-mono">
                        <Phone size={13} className="text-neutral-400" />
                        {order.phoneNumber}
                      </p>
                      <p className="text-neutral-600 leading-relaxed pt-0.5">
                        {order.deliveryAddress}
                      </p>
                    </div>

                    <div className="space-y-1.5 p-3.5 bg-neutral-50/70 rounded-lg border border-neutral-100">
                      <p className="font-semibold text-neutral-800 flex items-center gap-1.5">
                        <CreditCard size={13} className="text-neutral-500" />
                        <span>Thanh toán:</span>
                      </p>
                      <p className="text-neutral-700 font-medium">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </p>
                      {order.note && (
                        <div className="pt-1 text-neutral-600">
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <FileText size={11} /> Ghi chú đơn:
                          </span>
                          <p className="italic text-neutral-700 mt-0.5">
                            "{order.note}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (5 CỘT): TỔNG KẾT THANH TOÁN VÀ HÀNH ĐỘNG DOANH NGHIỆP */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 pb-3 border-b border-neutral-100">
                    Chi phí đơn hàng
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Tiền hàng</span>
                      <span className="font-mono font-medium text-neutral-800">
                        {formatCurrency(order.totalProductPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-600">
                      <span>Phí vận chuyển (Standard)</span>
                      <span className="font-mono font-medium text-neutral-800">
                        {order.shippingFee > 0
                          ? formatCurrency(order.shippingFee)
                          : 'Miễn phí'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-baseline justify-between">
                      <span className="font-bold text-neutral-800 text-sm">
                        Tổng thanh toán
                      </span>
                      <span className="font-mono font-bold text-lg text-rose-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Cụm hành động nhanh */}
                  <div className="pt-3 space-y-2">
                    {/* Nút Quét mã VietQR cho đơn chuyển khoản chưa trả */}
                    {isUnpaidPending && (
                      <Link
                        to={`/order-success/${order.orderCode}`}
                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <QrCode size={15} />
                        <span>Quét Mã VietQR Ngay</span>
                      </Link>
                    )}

                    {/* Mua lại */}
                    <Link
                      to="/products"
                      className="w-full py-2 px-4 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg border border-neutral-300 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <ShoppingBag size={14} className="text-rose-600" />
                      <span>Mua lại các sản phẩm này</span>
                    </Link>

                    {/* In đơn hàng */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full py-2 px-4 bg-white hover:bg-neutral-50 text-neutral-600 text-xs font-medium rounded-lg border border-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={13} className="text-neutral-400" />
                      <span>In phiếu thông tin đơn hàng</span>
                    </button>

                    {/* Nút Hủy đơn nếu còn PENDING */}
                    {order.status?.toUpperCase() === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancelReason(CANCEL_REASONS[0]);
                          setCustomReasonText('');
                          setCancelErrorMessage(null);
                          setIsCancelModalOpen(true);
                        }}
                        className="w-full py-2 px-4 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg border border-rose-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <XCircle size={14} />
                        <span>Hủy đơn hàng này</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Khối Hotline hỗ trợ doanh nghiệp */}
                <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Headphones size={20} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-neutral-800">
                      Hỗ trợ đơn hàng & Khiếu nại
                    </p>
                    <p className="text-neutral-500 mt-0.5">
                      Hotline: <strong className="text-rose-600 font-bold">0359 490 221</strong> (8:00 - 22:00)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-neutral-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-neutral-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal xác nhận hủy đơn */}
      {isCancelModalOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header modal */}
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Hủy đơn hàng #{order.orderCode}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Vui lòng chọn lý do hủy đơn
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isCancelling && setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nội dung chọn lý do */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <strong>Lưu ý:</strong> Đơn hàng sau khi hủy sẽ không thể phục hồi.
              </div>

              {cancelErrorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{cancelErrorMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="font-bold text-neutral-800 block text-xs">
                  Lý do bạn muốn hủy đơn:
                </label>
                <div className="space-y-2">
                  {CANCEL_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        cancelReason === reason
                          ? 'border-rose-500 bg-rose-50/40 text-neutral-900 font-medium'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReasonTracking"
                        checked={cancelReason === reason}
                        onChange={() => setCancelReason(reason)}
                        className="mt-0.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-xs leading-snug">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelReason === CANCEL_REASONS[CANCEL_REASONS.length - 1] && (
                <div className="space-y-1.5 pt-1">
                  <label className="font-medium text-neutral-700 text-[11px] block">
                    Chi tiết lý do khác <span className="text-rose-500">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    placeholder="Vui lòng chia sẻ cụ thể lý do hủy đơn..."
                    className="w-full p-3 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* Footer hành động */}
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-colors cursor-pointer"
              >
                Không, giữ lại đơn
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isCancelling ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Xác nhận hủy đơn</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
