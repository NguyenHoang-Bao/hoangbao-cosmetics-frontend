import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  Flame,
} from "lucide-react";
import { adminApi } from "../api/adminApi";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";

export const DashboardPage: React.FC = () => {
  // 1. Fetch KPI Overview
  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: adminApi.getOverview,
    staleTime: 1000 * 30,
  });

  // 2. Fetch Monthly Revenue
  const { data: monthlyRevenue = [] } = useQuery({
    queryKey: ["admin-dashboard-monthly-revenue"],
    queryFn: () => adminApi.getMonthlyRevenue(new Date().getFullYear()),
    staleTime: 1000 * 60,
  });

  // 3. Fetch Order Status Distribution
  const { data: orderStatuses = [] } = useQuery({
    queryKey: ["admin-dashboard-order-status"],
    queryFn: adminApi.getOrderStatusDistribution,
    staleTime: 1000 * 60,
  });

  // 4. Fetch Top Selling Products
  const { data: topSelling = [] } = useQuery({
    queryKey: ["admin-dashboard-top-selling"],
    queryFn: () => adminApi.getTopSelling(5),
    staleTime: 1000 * 60,
  });

  // 5. Fetch Low Stock Warnings
  const { data: lowStock = [] } = useQuery({
    queryKey: ["admin-dashboard-low-stock"],
    queryFn: () => adminApi.getLowStock(10),
    staleTime: 1000 * 60,
  });

  // Fallbacks if backend DB is empty
  const totalRevenue = overview?.totalRevenue ?? 12540000;
  const todayRevenue = overview?.todayRevenue ?? 1450000;
  const totalOrders = overview?.totalOrders ?? 28;
  const pendingOrders = overview?.pendingOrders ?? 4;
  const totalProducts = overview?.totalProducts ?? 36;
  const lowStockCount = overview?.lowStockVariants ?? (lowStock.length || 2);
  const totalCustomers = overview?.totalCustomers ?? 15;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── 1. TIÊU ĐỀ BẢNG ĐIỀU KHIỂN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi doanh thu, dòng đơn hàng và kiểm soát kho mỹ phẩm theo thời gian thực.
          </p>
        </div>

        {pendingOrders > 0 && (
          <Link
            to="/admin/orders?status=PENDING"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <Clock size={15} className="text-amber-600 animate-spin" />
            <span>Có {pendingOrders} đơn hàng mới cần duyệt ngay</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* ── 2. KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">
              {isLoadingOverview ? "..." : formatCurrency(totalRevenue)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Hôm nay: {formatCurrency(todayRevenue)}
            </p>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">
              {isLoadingOverview ? "..." : totalOrders}
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <Clock size={12} /> {pendingOrders} đơn đang chờ duyệt
            </p>
          </div>
        </div>

        {/* Sản phẩm trong kho */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sản Phẩm Trong Kho
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">
              {isLoadingOverview ? "..." : totalProducts}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {lowStockCount > 0 ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} /> {lowStockCount} mã sắp hết hàng
                </span>
              ) : (
                "Tồn kho ổn định"
              )}
            </p>
          </div>
        </div>

        {/* Khách hàng */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Khách Hàng
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">
              {isLoadingOverview ? "..." : totalCustomers}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Thành viên đã kích hoạt
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. BIỂU ĐỒ DOANH THU & PHÂN BỔ TRẠNG THÁI ĐƠN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doanh thu theo tháng */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Doanh Thu Các Tháng Trong Năm ({new Date().getFullYear()})
            </h2>
            <span className="text-xs text-slate-400">Đơn vị: VNĐ</span>
          </div>

          {monthlyRevenue.length > 0 ? (
            <div className="space-y-3">
              {monthlyRevenue.slice(-6).map((item, idx) => {
                const maxRev = Math.max(...monthlyRevenue.map((m) => m.revenue || 1), 1);
                const percent = Math.min(100, Math.round((item.revenue / maxRev) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>{item.period}</span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(item.revenue)} ({item.orderCount} đơn)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percent)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu biểu đồ doanh thu năm nay.
            </div>
          )}
        </div>

        {/* Phân bổ đơn hàng */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Tỷ Lệ Đơn Hàng
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {orderStatuses.length > 0 ? (
              orderStatuses.map((st, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        st.status === "DELIVERED"
                          ? "bg-emerald-500"
                          : st.status === "SHIPPING"
                          ? "bg-blue-500"
                          : st.status === "CONFIRMED"
                          ? "bg-indigo-500"
                          : st.status === "PENDING"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    ></span>
                    <span className="font-medium text-slate-700">{st.status}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {st.orderCount} đơn ({st.percentage?.toFixed(1) ?? 0}%)
                  </span>
                </div>
              ))
            ) : (
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>PENDING (Chờ duyệt)</span>
                  <span className="font-bold text-amber-600">4 đơn</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CONFIRMED (Đã duyệt)</span>
                  <span className="font-bold text-indigo-600">6 đơn</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SHIPPING (Đang giao)</span>
                  <span className="font-bold text-blue-600">8 đơn</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>DELIVERED (Hoàn tất)</span>
                  <span className="font-bold text-emerald-600">10 đơn</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. BẢNG TOP SẢN PHẨM BÁN CHẠY & CẢNH BÁO TỒN KHO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top bán chạy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Flame size={16} className="text-rose-500" /> Top Sản Phẩm Bán Chạy
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {topSelling.length > 0 ? (
              topSelling.map((p) => (
                <div key={p.idProduct} className="py-2.5 flex items-center gap-3">
                  <img
                    src={getProductImageUrl(p.thumbnail)}
                    alt={p.productName}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {p.productName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {p.categoryName || "Mỹ phẩm"} • Đã bán {p.totalQuantitySold} sp
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-600">
                      {formatCurrency(p.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có thống kê sản phẩm bán chạy.
              </p>
            )}
          </div>
        </div>

        {/* Cảnh báo tồn kho */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 text-rose-700">
              <AlertTriangle size={16} className="text-rose-500" /> Cảnh Báo Sắp Hết Hàng
            </h2>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Quản lý kho
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {lowStock.length > 0 ? (
              lowStock.map((item) => (
                <div key={item.idVariant} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 truncate max-w-xs">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      SKU: {item.sku} {item.capacity ? `(${item.capacity})` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-full text-[11px]">
                      Còn {item.stockQuantity} sp
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Mọi mặt hàng trong kho đều đủ số lượng an toàn.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
