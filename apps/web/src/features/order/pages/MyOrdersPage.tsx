import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  RefreshCw,
  AlertCircle,
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
  { key: 'SHIPPING', label: 'Đang giao' },
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

  // Helper format dot & label trạng thái đơn hàng (Tối giản cao cấp)
  const getStatusDisplay = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          label: 'Chờ xác nhận',
          dotColor: 'bg-amber-500',
          textColor: 'text-amber-800',
        };
      case 'PROCESSING':
        return {
          label: 'Đang chuẩn bị hàng',
          dotColor: 'bg-blue-500',
          textColor: 'text-blue-800',
        };
      case 'SHIPPING':
        return {
          label: 'Đang vận chuyển',
          dotColor: 'bg-indigo-500',
          textColor: 'text-indigo-800',
        };
      case 'DELIVERED':
        return {
          label: 'Giao thành công',
          dotColor: 'bg-emerald-500',
          textColor: 'text-emerald-800',
        };
      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          dotColor: 'bg-neutral-400',
          textColor: 'text-neutral-500',
        };
      default:
        return {
          label: status || 'Đang xử lý',
          dotColor: 'bg-neutral-400',
          textColor: 'text-neutral-700',
        };
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method?.toUpperCase()) {
      case 'BANK_TRANSFER':
      case 'VIETQR':
        return 'Chuyển khoản VietQR';
      case 'MOMO':
        return 'Ví MoMo';
      case 'VNPAY':
        return 'VNPAY';
      case 'COD':
      default:
        return 'Thanh toán COD';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb tối giản */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-medium">
          <Link to="/" className="hover:text-neutral-900 transition-colors uppercase tracking-wider text-[11px]">
            Trang chủ
          </Link>
          <ChevronRight size={12} />
          <Link to="/profile" className="hover:text-neutral-900 transition-colors uppercase tracking-wider text-[11px]">
            Tài khoản
          </Link>
          <ChevronRight size={12} />
          <span className="text-neutral-900 uppercase tracking-wider text-[11px] font-semibold">Đơn mua</span>
        </nav>

        {/* Tiêu đề & Hành động */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-900">
              Đơn Mua Của Tôi
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Theo dõi tình trạng vận chuyển và đơn hàng mỹ phẩm của bạn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-sm border border-neutral-300 hover:border-neutral-900 transition-colors cursor-pointer"
              title="Làm mới"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            </button>
            <Link
              to="/order-tracking"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-800 text-xs uppercase font-bold tracking-wider rounded-sm border border-neutral-300 hover:border-neutral-900 transition-colors"
            >
              <Search size={13} />
              <span>Tra cứu mã</span>
            </Link>
          </div>
        </div>

        {/* Minimalist Underline Tabs (Chuẩn Zara / Sephora) */}
        <div className="border-b border-neutral-200 mb-8 overflow-x-auto">
          <nav className="flex space-x-8 min-w-max">
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
                  className={`pb-3.5 px-0.5 text-xs uppercase font-bold tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className="text-[11px] font-normal font-mono text-neutral-400">
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-sm p-6 border border-neutral-200 h-44" />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="bg-white rounded-sm p-8 border border-neutral-200 text-center max-w-md mx-auto space-y-4">
            <AlertCircle size={36} className="mx-auto text-rose-600" />
            <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-900">
              Không thể tải danh sách đơn hàng
            </h3>
            <p className="text-xs text-neutral-500">
              {(error as Error)?.message || 'Vui lòng kiểm tra lại kết nối mạng.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredOrders.length === 0 && (
          <div className="bg-white rounded-sm p-12 text-center border border-neutral-200 space-y-4 max-w-lg mx-auto">
            <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              Chưa có đơn hàng
            </p>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {activeTab === 'ALL'
                ? 'Bạn chưa có đơn đặt mua nào tại Hoàng Bảo Cosmetics.'
                : `Không có đơn hàng nào ở trạng thái "${TABS.find((t) => t.key === activeTab)?.label}".`}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase font-bold tracking-widest rounded-sm transition-colors"
            >
              <span>Xem sản phẩm</span>
            </Link>
          </div>
        )}

        {/* Danh sách thẻ đơn hàng (Luxury Minimalist Cards) */}
        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusDisplay(order.status);
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
                  className="bg-white rounded-sm border border-neutral-200 hover:border-neutral-400 transition-all"
                >
                  {/* Header thẻ đơn hàng */}
                  <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                      <span className="font-bold font-mono tracking-wider text-neutral-900">
                        #{order.orderCode}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500 font-mono text-[11px]">{formattedDate}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUnpaidPending && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-amber-50 text-amber-700 border border-amber-200">
                          Chờ thanh toán
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${statusInfo.textColor}`}>
                          {statusInfo.label}
                        </span>
                      </div>
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
                          <p className="font-semibold text-neutral-900 line-clamp-1">
                            {item.productName}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-neutral-500 text-[11px]">
                            {item.capacity && (
                              <span className="text-neutral-600 font-medium">
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
                          <p className="font-bold text-neutral-900 font-mono">
                            {formatCurrency(item.subTotal ?? item.price * item.quantity)}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {formatCurrency(item.price)} / sp
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer thẻ: Địa chỉ, Tổng tiền & Nút hành động */}
                  <div className="p-4 sm:p-5 bg-neutral-50/30 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-neutral-500 max-w-md">
                      <span className="line-clamp-1">
                        Giao đến: <strong className="text-neutral-800">{order.customerName}</strong> ({order.phoneNumber}) - {order.deliveryAddress}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
                          Tổng tiền:
                        </span>
                        <span className="text-base font-bold text-neutral-900 font-mono">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Nút Quét VietQR cho đơn chuyển khoản chưa trả */}
                        {isUnpaidPending && (
                          <Link
                            to={`/order-success/${order.orderCode}`}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-colors"
                          >
                            Quét VietQR
                          </Link>
                        )}

                        {/* Nút Xem hành trình / chi tiết */}
                        <Link
                          to={`/order-tracking?code=${encodeURIComponent(order.orderCode)}`}
                          className="px-4 py-2 bg-white text-neutral-800 text-xs uppercase font-bold tracking-wider rounded-sm border border-neutral-300 hover:border-neutral-900 transition-colors"
                        >
                          Chi tiết đơn
                        </Link>

                        {/* Mua lại */}
                        <button
                          type="button"
                          onClick={() => navigate('/products')}
                          className="px-3 py-2 text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-900 rounded-sm text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
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

        {/* Phân trang tối giản */}
        {pageData && pageData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-sm border border-neutral-300 bg-white hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            <span className="text-xs font-mono text-neutral-500 px-3">
              Trang {page + 1} / {pageData.totalPages}
            </span>
            <button
              type="button"
              disabled={pageData.last || page + 1 >= pageData.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-sm border border-neutral-300 bg-white hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
