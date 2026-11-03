import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronRight,
  RefreshCw,
  QrCode,
  Truck,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  CreditCard,
  MapPin,
  Search,
} from 'lucide-react';
import type { PageResponse } from '@hoangbao/types';
import { orderApi, type OrderResponse, type OrderStatus } from '../../checkout/api/orderApi';
import { formatCurrency } from '@/lib/utils';

type FilterTab = 'ALL' | OrderStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'PROCESSING', label: 'Đang chuẩn bị' },
  { key: 'SHIPPING', label: 'Đang giao hàng' },
  { key: 'DELIVERED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [page, setPage] = useState(0);
  const pageSize = 10;

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

  const allOrders = pageData?.content || [];

  // Lọc theo Tab trên client
  const filteredOrders =
    activeTab === 'ALL'
      ? allOrders
      : allOrders.filter(
          (order) => order.status?.toUpperCase() === activeTab.toUpperCase()
        );

  // Helper format badge trạng thái đơn hàng
  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          label: 'Chờ xác nhận',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
      case 'PROCESSING':
        return {
          label: 'Đang chuẩn bị hàng',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: RefreshCw,
        };
      case 'SHIPPING':
        return {
          label: 'Đang giao hàng',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Truck,
        };
      case 'DELIVERED':
        return {
          label: 'Giao thành công',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertCircle,
        };
      default:
        return {
          label: status || 'Đang xử lý',
          bg: 'bg-neutral-100 text-neutral-700 border-neutral-200',
          icon: PackageCheck,
        };
    }
  };

  // Helper format tên phương thức thanh toán
  const getPaymentMethodLabel = (method?: string) => {
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

  return (
    <div className="min-h-screen bg-neutral-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb điều hướng */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-medium">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <Link to="/profile" className="hover:text-rose-600 transition-colors">
            Tài khoản
          </Link>
          <ChevronRight size={14} />
          <span className="text-neutral-700">Đơn mua của tôi</span>
        </nav>

        {/* Tiêu đề & Nút thao tác nhanh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2.5">
              <ShoppingBag className="text-rose-600" size={26} />
              <span>Đơn Mua Của Tôi</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Theo dõi tiến độ vận chuyển và lịch sử mua sắm mỹ phẩm của bạn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-white rounded-xl border border-neutral-200 transition-all cursor-pointer shadow-2xs"
              title="Làm mới danh sách"
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin text-rose-600' : ''} />
            </button>
            <Link
              to="/order-tracking"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xl border border-neutral-200 shadow-2xs transition-colors"
            >
              <Search size={14} />
              <span>Tra cứu theo mã</span>
            </Link>
          </div>
        </div>

        {/* Bộ lọc Tab chuẩn Shopee */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-1.5 shadow-2xs mb-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center min-w-max gap-1">
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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 h-48" />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center max-w-md mx-auto space-y-4">
            <AlertCircle size={40} className="mx-auto text-rose-500" />
            <h3 className="text-base font-bold text-neutral-900">Không thể tải danh sách đơn hàng</h3>
            <p className="text-xs text-neutral-500">
              {(error as Error)?.message || 'Vui lòng kiểm tra lại kết nối mạng.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredOrders.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-2xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Chưa có đơn hàng nào</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                {activeTab === 'ALL'
                  ? 'Bạn chưa đặt mua đơn hàng nào. Hãy khám phá ngay các sản phẩm mỹ phẩm cao cấp!'
                  : `Bạn hiện không có đơn hàng nào ở trạng thái "${TABS.find((t) => t.key === activeTab)?.label}".`}
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors"
            >
              <ShoppingBag size={14} />
              <span>Khám phá sản phẩm ngay</span>
            </Link>
          </div>
        )}

        {/* Danh sách thẻ đơn hàng */}
        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const BadgeIcon = badge.icon;
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
                  className="bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all shadow-2xs overflow-hidden"
                >
                  {/* Header thẻ đơn hàng */}
                  <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/40">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                      <span className="font-extrabold text-neutral-900 font-mono tracking-tight">
                        #{order.orderCode}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500">{formattedDate}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600">
                        <CreditCard size={13} className="text-neutral-400" />
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUnpaidPending && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Chờ thanh toán
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                      >
                        <BadgeIcon size={13} />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm trong đơn */}
                  <div className="p-4 sm:p-5 divide-y divide-neutral-100">
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={item.idOrderDetail || idx}
                        className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-bold text-neutral-900 line-clamp-1">
                            {item.productName}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-neutral-500 text-[11px]">
                            {item.capacity && (
                              <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-700 font-medium">
                                Dung tích: {item.capacity}
                              </span>
                            )}
                            {item.sku && (
                              <span className="font-mono text-neutral-400">
                                SKU: {item.sku}
                              </span>
                            )}
                            <span>Số lượng: x{item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-neutral-900 font-mono">
                            {formatCurrency(item.subTotal ?? item.price * item.quantity)}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {formatCurrency(item.price)} / sp
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer thẻ: Địa chỉ, Tổng tiền & Nút hành động */}
                  <div className="p-4 sm:p-5 bg-neutral-50/60 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-neutral-600 flex items-start gap-1.5 max-w-md">
                      <MapPin size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        Giao đến: <strong className="text-neutral-800">{order.customerName}</strong> ({order.phoneNumber}) - {order.deliveryAddress}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
                      <div>
                        <span className="text-xs text-neutral-500 mr-2">Tổng tiền:</span>
                        <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Nút Thanh toán ngay VietQR cho đơn chuyển khoản chưa trả */}
                        {isUnpaidPending && (
                          <Link
                            to={`/order-success/${order.orderCode}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                          >
                            <QrCode size={14} />
                            <span>Quét VietQR ngay</span>
                          </Link>
                        )}

                        {/* Nút Xem hành trình / chi tiết */}
                        <Link
                          to={`/order-tracking?code=${encodeURIComponent(order.orderCode)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl border border-neutral-200 transition-colors shadow-2xs"
                        >
                          <span>Xem tiến trình</span>
                          <ChevronRight size={14} />
                        </Link>

                        {/* Mua lại */}
                        <button
                          type="button"
                          onClick={() => navigate('/products')}
                          className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-white rounded-xl border border-neutral-200 transition-colors cursor-pointer"
                          title="Mua lại các sản phẩm này"
                        >
                          <RotateCcw size={15} />
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
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Trang trước
            </button>
            <span className="text-xs font-medium text-neutral-500 px-3">
              Trang {page + 1} / {pageData.totalPages}
            </span>
            <button
              type="button"
              disabled={pageData.last || page + 1 >= pageData.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
