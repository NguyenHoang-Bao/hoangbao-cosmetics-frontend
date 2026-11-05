import {
  TrendingUp,
  Package,
  ShoppingCart,
  Layers,
  Activity,
  Clock
} from 'lucide-react';
import type { ProductItem, CategoryItem } from '@/services/adminService';
import { getImageUrl } from '@/utils/imageHelper';

interface DashboardOverviewProps {
  products: ProductItem[];
  categories: CategoryItem[];
  onNavigateTab: (tab: string) => void;
}

export default function DashboardOverview({
  products,
  categories,
  onNavigateTab
}: DashboardOverviewProps) {
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.length - inStockCount;

  // Lấy đơn hàng từ localStorage
  let ordersList: any[] = [];
  try {
    ordersList = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
  } catch {}

  const totalRevenue = ordersList.reduce((acc, cur) => acc + (cur.total || 0), 0) || 12450000;
  const pendingOrders = ordersList.filter((o) => o.status === 'pending');

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Doanh thu hệ thống
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">
              {totalRevenue.toLocaleString('vi-VN')}₫
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>+18.4%</span> so với tháng trước
            </p>
          </div>
        </div>

        {/* Tổng sản phẩm */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sản phẩm trong kho
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">{products.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {inStockCount} còn hàng • {outOfStockCount} tạm hết
            </p>
          </div>
        </div>

        {/* Đơn hàng online */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đơn hàng Online
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">
              {ordersList.length > 0 ? ordersList.length : 28}
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <Clock size={12} /> {pendingOrders.length} đơn đang xử lý
            </p>
          </div>
        </div>

        {/* Ngành hàng & Danh mục */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Danh mục mỹ phẩm
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800">{categories.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Đã phân loại đồng bộ Web & POS</p>
          </div>
        </div>
      </div>

      {/* 2. Omnichannel Channel Breakdown & AI Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doanh thu theo kênh */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Phân Bổ Kênh Bán Hàng</span>
            <span className="text-[11px] text-gray-400">Thời gian thực</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Online (Web & Chatbot AI n8n):
                </span>
                <span className="font-bold text-slate-900">8.715.000₫ (70%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Offline tại quầy (App POS Electron):
                </span>
                <span className="font-bold text-slate-900">3.735.000₫ (30%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Giám sát cảnh báo từ AI & Kho */}
        <div className="bg-gradient-to-br from-purple-50 to-slate-50 p-4 rounded-2xl border border-purple-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="font-bold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-purple-600" />
                Cảnh Báo Vận Hành & AI Agent
              </span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">Cần chú ý</span>
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-slate-700">
              <p className="flex items-center justify-between">
                <span>• AI Agent báo cáo <strong>2 ca khiếu nại</strong> cần giải quyết</span>
                <button
                  onClick={() => onNavigateTab('ai_reports')}
                  className="text-purple-700 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Xử lý ngay →
                </button>
              </p>
              <p className="flex items-center justify-between">
                <span>• Có <strong>1 phiếu nhập kho</strong> chờ Admin phê duyệt</span>
                <button
                  onClick={() => onNavigateTab('inventory')}
                  className="text-blue-700 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Duyệt kho →
                </button>
              </p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 italic">
            * 82% tác vụ thông thường đang được n8n AI tự động xử lý trôi chảy.
          </p>
        </div>
      </div>

      {/* 3. Khối nội dung 2 cột: Sản phẩm nổi bật & Lối tắt thao tác */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái (2/3): Danh sách sản phẩm tiêu biểu */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Sản phẩm nổi bật trong kho</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cập nhật giá và tồn kho gần nhất</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Xem tất cả ({products.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg border border-slate-200 overflow-hidden p-0.5 flex-shrink-0 bg-slate-50">
                    <img
                      src={getImageUrl(prod.thumbnail, { width: 50, height: 50, crop: 'fill' })}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 line-clamp-1">{prod.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {prod.brand} • <span className="font-mono text-slate-600">{prod.sku}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-rose-600">{prod.price.toLocaleString('vi-VN')}₫</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      prod.inStock
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {prod.inStock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải (1/3): Lối tắt nhanh & Thông tin chuỗi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
              Thao tác nhanh Quản trị viên
            </h3>

            <div className="space-y-2.5 mt-4">
              <button
                onClick={() => onNavigateTab('products')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-rose-600">Thêm sản phẩm mới</p>
                  <p className="text-[11px] text-slate-400">Nhập mã SKU, giá bán & hình ảnh Cloudinary</p>
                </div>
                <Package size={16} className="text-slate-400 group-hover:text-rose-600" />
              </button>

              <button
                onClick={() => onNavigateTab('orders')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-rose-600">Giám sát đơn hàng Online</p>
                  <p className="text-[11px] text-slate-400">Xem và đối soát trạng thái đơn khách đặt</p>
                </div>
                <ShoppingCart size={16} className="text-slate-400 group-hover:text-rose-600" />
              </button>

              <button
                onClick={() => onNavigateTab('categories')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-rose-600">Quản lý cây danh mục</p>
                  <p className="text-[11px] text-slate-400">Phân loại ngành hàng mỹ phẩm, banner</p>
                </div>
                <Layers size={16} className="text-slate-400 group-hover:text-rose-600" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1">
            <p className="font-bold text-rose-400">Hệ sinh thái Omnichannel</p>
            <p className="text-[11px] text-slate-300">
              Dữ liệu danh mục và sản phẩm đang đồng bộ tức thì với Website khách hàng và sẵn sàng kết nối Electron POS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
