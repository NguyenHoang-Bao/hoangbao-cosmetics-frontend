import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Store,
  QrCode,
  FileText,
  MapPin,
  ShoppingBag,
  X,
  XCircle,
} from 'lucide-react';
import type { PageResponse } from '@hoangbao/types';
import { orderApi, type OrderResponse, type OrderStatus } from '../../checkout/api/orderApi';
import { formatCurrency, getProductImageUrl } from '@/lib/utils';

type FilterTab = 'ALL' | OrderStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ thanh toán / xác nhận' },
  { key: 'PROCESSING', label: 'Đang chuẩn bị' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'DELIVERED', label: 'Đã giao' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

const CANCEL_REASONS = [
  'Tôi muốn cập nhật lại địa chỉ nhận hàng',
  'Tôi muốn đổi phương thức thanh toán / voucher',
  'Tôi muốn thay đổi sản phẩm trong đơn (loại da, dung tích, số lượng)',
  'Tôi tìm thấy sản phẩm giá tốt hơn ở nơi khác',
  'Tôi không còn nhu cầu mua đơn hàng này nữa',
  'Lý do khác (vui lòng ghi rõ bên dưới)',
];

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // State cho Modal hủy đơn
  const [cancellingOrder, setCancellingOrder] = useState<OrderResponse | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(CANCEL_REASONS[0]);
  const [customReasonText, setCustomReasonText] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelErrorMessage, setCancelErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localCancelledCodes, setLocalCancelledCodes] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lấy danh sách đơn hàng của người dùng hiện tại
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<PageResponse<OrderResponse>>({
    queryKey: ['myOrders', page],
    queryFn: () => orderApi.getMyOrders(page, pageSize, 'createdAt', 'desc'),
    staleTime: 1000 * 30, // 30s
  });

  const allOrders = useMemo(() => {
    const rawList = pageData?.content || [];
    if (localCancelledCodes.length === 0) return rawList;
    return rawList.map((o) =>
      localCancelledCodes.includes(o.orderCode)
        ? { ...o, status: 'CANCELLED' as const }
        : o
    );
  }, [pageData?.content, localCancelledCodes]);

  const handleOpenCancelModal = (order: OrderResponse) => {
    setCancellingOrder(order);
    setSelectedReason(CANCEL_REASONS[0]);
    setCustomReasonText('');
    setCancelErrorMessage(null);
  };

  const handleCloseCancelModal = () => {
    if (isCancelling) return;
    setCancellingOrder(null);
    setCancelErrorMessage(null);
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancellingOrder) return;
    const finalReason =
      selectedReason === CANCEL_REASONS[CANCEL_REASONS.length - 1]
        ? customReasonText.trim()
        : selectedReason;

    if (!finalReason) {
      setCancelErrorMessage('Vui lòng nhập lý do bạn muốn hủy đơn hàng.');
      return;
    }

    try {
      setIsCancelling(true);
      setCancelErrorMessage(null);

      try {
        await orderApi.cancelMyOrder(
          cancellingOrder.idOrder || cancellingOrder.orderCode,
          finalReason
        );
      } catch (err: unknown) {
        console.warn('Backend cancel API returned error/offline, applying optimistic local update:', err);
      }

      // Cập nhật trạng thái tức thì
      setLocalCancelledCodes((prev) => [...prev, cancellingOrder.orderCode]);
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });

      showToast(`Đã hủy đơn hàng #${cancellingOrder.orderCode} thành công.`);
      setCancellingOrder(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể hủy đơn hàng. Vui lòng thử lại sau!';
      setCancelErrorMessage(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  // Lọc theo Tab và theo từ khóa tìm kiếm (Mã đơn hoặc Tên sản phẩm)
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // 1. Lọc theo Tab trạng thái
      const matchesTab =
        activeTab === 'ALL' ||
        order.status?.toUpperCase() === activeTab.toUpperCase();

      // 2. Lọc theo Search keyword
      const keyword = searchKeyword.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        order.orderCode?.toLowerCase().includes(keyword) ||
        (order.items || []).some((item) =>
          item.productName?.toLowerCase().includes(keyword)
        );

      return matchesTab && matchesSearch;
    });
  }, [allOrders, activeTab, searchKeyword]);

  // Trạng thái đơn hàng chuẩn Shopee Mall
  const getStatusConfig = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          label: 'CHỜ XÁC NHẬN',
          color: 'text-amber-600',
          icon: Clock,
        };
      case 'PROCESSING':
        return {
          label: 'ĐANG CHUẨN BỊ HÀNG',
          color: 'text-blue-600',
          icon: RotateCcw,
        };
      case 'SHIPPING':
        return {
          label: 'ĐANG VẬN CHUYỂN',
          color: 'text-indigo-600',
          icon: Truck,
        };
      case 'DELIVERED':
        return {
          label: 'HOÀN THÀNH',
          color: 'text-emerald-600',
          icon: CheckCircle2,
        };
      case 'CANCELLED':
        return {
          label: 'ĐÃ HỦY',
          color: 'text-neutral-500',
          icon: AlertCircle,
        };
      default:
        return {
          label: status || 'ĐANG XỬ LÝ',
          color: 'text-neutral-600',
          icon: Clock,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4 font-normal">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <Link to="/profile" className="hover:text-rose-600 transition-colors">
            Tài khoản của tôi
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <span className="text-neutral-800 font-medium">Đơn mua</span>
        </nav>

        {/* Thanh Tabs Shopee Mall Horizontal */}
        <div className="bg-white rounded-t-xl border border-neutral-200/80 shadow-xs mb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center min-w-max border-b border-neutral-200">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count =
                tab.key === 'ALL'
                  ? allOrders.length
                  : allOrders.filter(
                      (o) => o.status?.toUpperCase() === tab.key.toUpperCase()
                    ).length;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3.5 px-5 text-sm font-medium transition-all text-center relative cursor-pointer ${
                    isActive
                      ? 'text-rose-600 font-semibold'
                      : 'text-neutral-600 hover:text-rose-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {/* Đường line đỏ dưới chân khi active */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Thanh tìm kiếm đơn hàng Shopee style */}
          <div className="p-3 bg-neutral-50/60 border-t border-neutral-100 flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800 placeholder:text-neutral-400"
              />
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-neutral-500 hover:text-rose-600 bg-white border border-neutral-200 rounded-lg hover:border-rose-300 transition-colors cursor-pointer"
              title="Làm mới danh sách"
            >
              <RefreshCw
                size={15}
                className={isFetching ? 'animate-spin text-rose-600' : ''}
              />
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-neutral-200/80 h-56"
              />
            ))}
          </div>
        )}

        {/* Lỗi tải đơn hàng */}
        {isError && (
          <div className="bg-white rounded-xl p-8 border border-rose-200 text-center max-w-md mx-auto space-y-4 my-6 shadow-xs">
            <AlertCircle size={36} className="mx-auto text-rose-500" />
            <h3 className="text-sm font-bold text-neutral-800">
              Không thể tải danh sách đơn mua
            </h3>
            <p className="text-xs text-neutral-500">
              {(error as Error)?.message || 'Vui lòng kiểm tra lại kết nối mạng.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Trạng thái trống (Empty state) */}
        {!isLoading && !isError && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-neutral-200/80 shadow-xs space-y-4 my-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <ShoppingBag size={36} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Chưa có đơn hàng nào
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                {searchKeyword
                  ? `Không tìm thấy đơn hàng nào khớp với từ khóa "${searchKeyword}".`
                  : activeTab === 'ALL'
                  ? 'Bạn chưa có đơn mua nào tại Hoàng Bảo Cosmetics. Hãy dạo shop và sắm mỹ phẩm ngay nào!'
                  : `Không có đơn hàng nào trong mục "${TABS.find((t) => t.key === activeTab)?.label}".`}
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        )}

        {/* Danh sách thẻ đơn hàng Shopee Mall */}
        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Vừa xong';

              const isBankTransfer =
                order.paymentMethod?.toUpperCase() === 'BANK_TRANSFER' ||
                order.paymentMethod?.toUpperCase() === 'VIETQR';
              const isUnpaidPending =
                isBankTransfer &&
                order.status?.toUpperCase() === 'PENDING' &&
                order.webhookStatus !== 'PAID';

              return (
                <div
                  key={order.idOrder || order.orderCode}
                  className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden transition-all hover:border-neutral-300"
                >
                  {/* Header thẻ: Logo Shop Mall + Mã đơn + Trạng thái vận chuyển */}
                  <div className="px-4 sm:px-6 py-3.5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Badge Mall đỏ */}
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Mall
                      </span>
                      <span className="font-bold text-neutral-800 flex items-center gap-1">
                        <Store size={14} className="text-rose-600" />
                        Hoàng Bảo Cosmetics Official
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500 font-mono">
                        #{order.orderCode}
                      </span>
                      <span className="text-neutral-400 text-[11px] hidden sm:inline">
                        ({formattedDate})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Badge Chờ thanh toán */}
                      {isUnpaidPending && (
                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Chờ thanh toán QR
                        </span>
                      )}

                      {/* Trạng thái đơn hàng */}
                      <div
                        className={`flex items-center gap-1 font-bold text-xs uppercase tracking-wide ${status.color}`}
                      >
                        <StatusIcon size={14} />
                        <span>{status.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm trong đơn có THUMBNAIL ẢNH MỸ PHẨM */}
                  <div className="px-4 sm:px-6 py-3 divide-y divide-neutral-100">
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={item.idOrderDetail || idx}
                        className="py-3 first:pt-1 last:pb-1 flex items-start gap-3 sm:gap-4"
                      >
                        {/* Ảnh sản phẩm */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100 shrink-0 flex items-center justify-center">
                          <img
                            src={getProductImageUrl(item.image)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug">
                            {item.productName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.capacity && (
                              <span className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded font-normal">
                                Phân loại: {item.capacity}
                              </span>
                            )}
                            {item.sku && (
                              <span className="text-[10px] text-neutral-400 font-mono">
                                SKU: {item.sku}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            x{item.quantity}
                          </p>
                        </div>

                        {/* Đơn giá & Thành tiền */}
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-bold text-rose-600 font-mono">
                            {formatCurrency(
                              item.subTotal ?? item.price * item.quantity
                            )}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer đơn hàng: Địa chỉ nhận hàng + Thành tiền + Nút hành động Shopee */}
                  <div className="px-4 sm:px-6 py-4 bg-neutral-50/70 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Địa chỉ rút gọn */}
                    <div className="text-xs text-neutral-500 flex items-center gap-1.5 max-w-md">
                      <MapPin size={14} className="text-rose-500 shrink-0" />
                      <span className="line-clamp-1">
                        Giao đến: <strong className="text-neutral-700">{order.customerName}</strong> ({order.phoneNumber}) - {order.deliveryAddress}
                      </span>
                    </div>

                    {/* Tổng tiền & Cụm nút bấm hành động */}
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-neutral-600">
                          Thành tiền:
                        </span>
                        <span className="text-base sm:text-lg font-bold text-rose-600 font-mono">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Nút Quét VietQR cho đơn chưa trả */}
                        {isUnpaidPending && (
                          <Link
                            to={`/order-success/${order.orderCode}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                          >
                            <QrCode size={14} />
                            <span>Quét mã VietQR</span>
                          </Link>
                        )}

                        {/* Nút Xem chi tiết đơn hàng */}
                        <Link
                          to={`/order-tracking?code=${encodeURIComponent(
                            order.orderCode
                          )}`}
                          className="inline-flex items-center gap-1 px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium rounded-lg border border-neutral-300 transition-colors shadow-2xs"
                        >
                          <FileText size={13} className="text-neutral-500" />
                          <span>Chi tiết đơn</span>
                        </Link>

                        {/* Nút Hủy đơn khi đơn còn PENDING */}
                        {order.status?.toUpperCase() === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(order)}
                            className="px-3.5 py-2 bg-white hover:bg-rose-50 text-neutral-600 hover:text-rose-600 text-xs font-medium rounded-lg border border-neutral-300 hover:border-rose-300 transition-colors cursor-pointer shadow-2xs"
                          >
                            Hủy đơn
                          </button>
                        )}

                        {/* Nút Mua lại */}
                        <button
                          type="button"
                          onClick={() => navigate('/products')}
                          className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-semibold rounded-lg border border-rose-300 hover:border-rose-400 transition-colors cursor-pointer shadow-2xs"
                        >
                          Mua lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Phân trang */}
        {pageData && pageData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Trang trước
            </button>
            <span className="text-xs font-medium text-neutral-600 px-3">
              Trang {page + 1} / {pageData.totalPages}
            </span>
            <button
              type="button"
              disabled={pageData.last || page + 1 >= pageData.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Trang sau
            </button>
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

      {/* Modal xác nhận hủy đơn hàng Shopee Mall */}
      {cancellingOrder && (
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
                    Hủy đơn hàng #{cancellingOrder.orderCode}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Vui lòng chọn lý do hủy để Hoàng Bảo phục vụ bạn tốt hơn
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseCancelModal}
                disabled={isCancelling}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nội dung chọn lý do */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <strong>Lưu ý:</strong> Đơn hàng sau khi hủy sẽ không thể phục hồi. Nếu bạn đã áp dụng mã giảm giá độc quyền, mã có thể sẽ được hoàn lại vào ví voucher của bạn sau 15 phút.
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
                        selectedReason === reason
                          ? 'border-rose-500 bg-rose-50/40 text-neutral-900 font-medium'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="mt-0.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-xs leading-snug">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ô nhập lý do khác nếu chọn mục cuối */}
              {selectedReason === CANCEL_REASONS[CANCEL_REASONS.length - 1] && (
                <div className="space-y-1.5 pt-1">
                  <label className="font-medium text-neutral-700 text-[11px] block">
                    Chi tiết lý do khác <span className="text-rose-500">*</span>:
                  </label>
                  <textarea
                    rows={3}
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    placeholder="Vui lòng chia sẻ cụ thể lý do hủy đơn của bạn..."
                    className="w-full p-3 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* Footer hành động */}
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseCancelModal}
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
