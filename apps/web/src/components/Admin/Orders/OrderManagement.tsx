import { useState, useEffect } from 'react';
import {
  Search,
  Bot,
  Store,
  Truck,
  CheckCircle2,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
  Plus
} from 'lucide-react';
import CreateOrderModal from './CreateOrderModal';
import { adminService } from '@/services/adminService';

export interface OrderItemType {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

export interface OrderType {
  id: string;
  numericId?: number;
  date: string;
  source: 'AI_ONLINE' | 'POS_STORE' | 'ADMIN_MANUAL';
  channelName: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'returned';
  statusText: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  shippingAddress: string;
  phone: string;
  customerName: string;
  paymentMethod: string;
  paymentStatus?: 'paid' | 'unpaid';
  codStatus?: 'reconciled' | 'pending_cod_transfer' | 'store_collected';
  codStatusText?: string;
  trackingNumber?: string;
  carrier?: string;
  paymentCode?: string;
  shippingMethod?: string;
  note?: string;
  items: OrderItemType[];
}

const STORAGE_ORDERS_KEY = 'hb_orders_management_data_v2';

const defaultMockOrders: OrderType[] = [
  {
    id: '#ORDER0015',
    date: 'Hôm nay, 14:20:00',
    source: 'AI_ONLINE',
    channelName: 'Online (Web)',
    customerName: 'Trần Thị Thanh Thảo',
    phone: '0908123456',
    shippingAddress: '125 Hai Bà Trưng, P. Bến Nghé, Quận 1, TP.HCM',
    total: 750000,
    paymentMethod: 'Thu tiền khi nhận (COD)',
    paymentStatus: 'unpaid',
    codStatus: 'pending_cod_transfer',
    codStatusText: 'Bưu điện đang giữ COD',
    carrier: 'Giao Hàng Tiết Kiệm (GHTK)',
    trackingNumber: 'GHTK-HCM-98213',
    status: 'shipping',
    statusText: 'Bưu điện đang giao',
    items: [
      { id: 'item-1', name: 'Serum Phục Hồi & Cấp Nước B5 Hoàng Bảo', price: 450000, quantity: 1 },
      { id: 'item-2', name: 'Kem Chống Nắng Kiềm Dầu SPF50+', price: 300000, quantity: 1 }
    ]
  },
  {
    id: '#ORDER0014',
    date: 'Hôm nay, 11:35:12',
    source: 'POS_STORE',
    channelName: 'Quầy Thu Ngân POS',
    customerName: 'Chị Mai Linh (Tại quầy)',
    phone: '0912987654',
    shippingAddress: 'Mua trực tiếp tại Showroom Tân Phú',
    total: 580000,
    paymentMethod: 'Quét mã VietQR động',
    paymentStatus: 'paid',
    codStatus: 'store_collected',
    codStatusText: 'Đã thu tại quầy',
    carrier: 'Tại quầy',
    status: 'delivered',
    statusText: 'Đã hoàn tất tại quầy',
    items: [
      { id: 'item-3', name: 'Son Kem Lì Mịn Môi (Màu Đỏ Gạch)', price: 290000, quantity: 2 }
    ]
  },
  {
    id: '#ORDER0013',
    date: 'Hôm qua, 09:14:22',
    source: 'AI_ONLINE',
    channelName: 'Online (Facebook)',
    customerName: 'Lê Thu Trang',
    phone: '0918234567',
    shippingAddress: '120 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh',
    total: 450000,
    paymentMethod: 'Chuyển khoản VietQR',
    paymentStatus: 'paid',
    codStatus: 'reconciled',
    codStatusText: 'Đã đối soát vào ví shop',
    carrier: 'Giao Hàng Nhanh (GHN)',
    trackingNumber: 'GHN-889912',
    status: 'delivered',
    statusText: 'Giao thành công',
    items: [
      { id: 'item-4', name: 'Serum Phục Hồi B5 Hoàng Bảo', price: 450000, quantity: 1 }
    ]
  },
  {
    id: '#ORDER0012',
    date: '25/09/2026',
    source: 'AI_ONLINE',
    channelName: 'Online (Zalo)',
    customerName: 'Vũ Minh Tuấn',
    phone: '0977665544',
    shippingAddress: 'Số 45 ngõ 12, P. Dịch Vọng, Cầu Giấy, Hà Nội',
    total: 320000,
    paymentMethod: 'Thu tiền khi nhận (COD)',
    paymentStatus: 'unpaid',
    codStatus: 'pending_cod_transfer',
    codStatusText: 'Chờ nhận lại hàng',
    carrier: 'Viettel Post',
    trackingNumber: 'VT-458129',
    status: 'returned',
    statusText: 'Khách không nhận (Đang hoàn)',
    items: [
      { id: 'item-5', name: 'Kem Dưỡng Ẩm Trắng Da Chiết Xuất Trà Xanh', price: 320000, quantity: 1 }
    ]
  }
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Đang tải dữ liệu
  const [, setIsLoading] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const serverOrders = await adminService.getAdminOrders();
      if (Array.isArray(serverOrders) && serverOrders.length > 0) {
        setOrders(serverOrders as unknown as OrderType[]);
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(serverOrders));
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Không thể kết nối API đơn hàng Admin, sử dụng bộ nhớ đệm:', e);
    } finally {
      setIsLoading(false);
    }

    try {
      const stored = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setOrders(defaultMockOrders);
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(defaultMockOrders));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const saveOrders = (updated: OrderType[]) => {
    setOrders(updated);
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
  };

  // Đối soát tiền COD bưu điện cho các đơn đã giao
  const handleReconcileCOD = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.numericId) {
      try {
        await adminService.updateOrderStatus(targetOrder.numericId, 'DELIVERED', 'Đã đối soát tiền COD');
      } catch (err) {
        console.warn('Lỗi gọi API cập nhật đơn hàng:', err);
      }
    }
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            codStatus: 'reconciled' as const,
            codStatusText: 'Đã đối soát vào ví shop',
            paymentStatus: 'paid' as const
          }
        : o
    );
    saveOrders(updated);
    showToast(`Đã đối soát tiền COD cho đơn ${orderId} thành công!`);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              codStatus: 'reconciled',
              codStatusText: 'Đã đối soát vào ví shop',
              paymentStatus: 'paid'
            }
          : null
      );
    }
  };

  // Đối soát hàng loạt các đơn COD đã chọn
  const handleBatchReconcileCOD = async () => {
    const eligibleOrders = orders.filter(
      (o) => selectedOrderIds.includes(o.id) && o.codStatus === 'pending_cod_transfer'
    );
    if (eligibleOrders.length === 0) {
      showToast('Các đơn được chọn không ở trạng thái chờ đối soát COD!');
      return;
    }
    for (const o of eligibleOrders) {
      if (o.numericId) {
        try {
          await adminService.updateOrderStatus(o.numericId, 'DELIVERED', 'Đối soát COD hàng loạt');
        } catch (err) {
          console.warn('Lỗi cập nhật đơn:', o.id, err);
        }
      }
    }
    const totalMoney = eligibleOrders.reduce((sum, o) => sum + o.total, 0);
    const updated = orders.map((o) =>
      selectedOrderIds.includes(o.id) && o.codStatus === 'pending_cod_transfer'
        ? {
            ...o,
            codStatus: 'reconciled' as const,
            codStatusText: 'Đã đối soát vào ví shop',
            paymentStatus: 'paid' as const
          }
        : o
    );
    saveOrders(updated);
    setSelectedOrderIds([]);
    showToast(`Đã đối soát thành công ${eligibleOrders.length} đơn hàng (${formatCurrency(totalMoney)})!`);
  };

  // Hủy đơn hàng khẩn cấp
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(`Bạn có chắc muốn hủy khẩn cấp đơn hàng ${orderId}?`)) return;
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.numericId) {
      try {
        await adminService.cancelOrder(targetOrder.numericId, 'Quản trị viên hủy khẩn cấp');
      } catch (err) {
        console.warn('Lỗi gọi API hủy đơn hàng:', err);
      }
    }
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: 'cancelled' as const,
            statusText: 'Đã hủy khẩn cấp'
          }
        : o
    );
    saveOrders(updated);
    showToast(`Đã hủy đơn ${orderId} thành công.`);
    setSelectedOrder(null);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleExportFile = () => {
    const exportTargets =
      selectedOrderIds.length > 0
        ? orders.filter((o) => selectedOrderIds.includes(o.id))
        : filteredOrders;

    if (exportTargets.length === 0) {
      alert('Không có đơn hàng nào để xuất file!');
      return;
    }

    const headers = [
      'Mã đơn hàng',
      'Ngày đặt',
      'Nguồn đơn',
      'Khách hàng',
      'Điện thoại',
      'Địa chỉ',
      'Sản phẩm',
      'Tổng tiền',
      'Hình thức thanh toán',
      'Đối soát COD',
      'Trạng thái'
    ];

    const rows = exportTargets.map((o) => {
      const productStr = o.items.map((it) => `${it.name} (${it.quantity})`).join('; ');
      return [
        `"${o.id}"`,
        `"${o.date.replace('\n', ' ')}"`,
        `"${o.channelName}"`,
        `"${o.customerName}"`,
        `"${o.phone}"`,
        `"${o.shippingAddress}"`,
        `"${productStr}"`,
        `"${o.total}"`,
        `"${o.paymentMethod}"`,
        `"${o.codStatusText || ''}"`,
        `"${o.statusText}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DoiSoat_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Đã xuất file đối soát cho ${exportTargets.length} đơn hàng.`);
  };

  const handleOrderCreated = (newOrder: OrderType) => {
    const updated = [newOrder, ...orders];
    saveOrders(updated);
    showToast(`Đã tạo đơn ${newOrder.id}`);
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      o.id.toLowerCase().includes(term) ||
      o.customerName?.toLowerCase().includes(term) ||
      o.phone?.includes(term) ||
      o.shippingAddress?.toLowerCase().includes(term);

    const matchChannel =
      selectedChannel === 'all' ||
      (selectedChannel === 'AI_ONLINE' && o.source === 'AI_ONLINE') ||
      (selectedChannel === 'POS_STORE' && o.source === 'POS_STORE') ||
      (selectedChannel === 'RETURNED' && o.status === 'returned');

    const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchSearch && matchChannel && matchStatus;
  });

  const totalValue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCOD = orders
    .filter((o) => o.codStatus === 'pending_cod_transfer')
    .reduce((sum, o) => sum + o.total, 0);

  const selectedPendingOrders = orders.filter(
    (o) => selectedOrderIds.includes(o.id) && o.codStatus === 'pending_cod_transfer'
  );
  const selectedBatchCODTotal = selectedPendingOrders.reduce((sum, o) => sum + o.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-3 text-xs text-[#333] font-sans">
      {toastMessage && (
        <div className="fixed top-12 right-6 z-50 bg-[#333] text-white text-xs px-3 py-2 rounded shadow-md flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 Thẻ thống kê Giám sát & Đối soát tài chính dành cho Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3 border border-[#ccc] rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-[11px]">
            <span>Tổng giá trị đơn hàng</span>
            <Coins size={16} className="text-blue-600" />
          </div>
          <div className="text-base font-bold text-slate-800 mt-1">{formatCurrency(totalValue)}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{orders.length} đơn trên toàn hệ thống</div>
        </div>

        <div className="bg-white p-3 border border-purple-200 bg-purple-50/20 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-purple-700 text-[11px] font-medium">
            <span>Kênh Online tự động</span>
            <Bot size={16} className="text-purple-600" />
          </div>
          <div className="text-base font-bold text-purple-900 mt-1">
            {orders.filter((o) => o.source === 'AI_ONLINE').length} đơn (75%)
          </div>
          <div className="text-[10px] text-purple-600 mt-0.5">Tự động chuyển Kho đóng gói</div>
        </div>

        <div className="bg-white p-3 border border-blue-200 bg-blue-50/20 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-[11px] font-medium">
            <span>Kênh Bán Quầy POS</span>
            <Store size={16} className="text-blue-600" />
          </div>
          <div className="text-base font-bold text-blue-900 mt-1">
            {orders.filter((o) => o.source === 'POS_STORE').length} đơn (25%)
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">Tiền thu ngay tại quầy</div>
        </div>

        <div className="bg-white p-3 border border-amber-300 bg-amber-50/40 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-amber-800 text-[11px] font-medium">
            <span>Tiền COD bưu điện đang giữ</span>
            <Truck size={16} className="text-amber-700" />
          </div>
          <div className="text-base font-bold text-amber-800 mt-1">{formatCurrency(pendingCOD)}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Cần đối soát khi bưu cục chuyển tiền</div>
        </div>
      </div>

      {/* THANH ĐIỀU KHIỂN & BỘ LỌC ĐỐI SOÁT */}
      <div className="bg-white p-2.5 border border-[#ccc] flex flex-wrap items-center justify-between gap-2">
        {/* Bộ lọc kênh nguồn */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-slate-700">Nguồn đơn:</span>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="h-8 px-2 text-xs border border-[#ccc] bg-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả nguồn (Online + Quầy)</option>
            <option value="AI_ONLINE">Kênh Online tự động (Web/Zalo/FB)</option>
            <option value="POS_STORE">Kênh Quầy POS (Tại cửa hàng)</option>
            <option value="RETURNED">Đơn chuyển hoàn / Bị hoàn</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 px-2 text-xs border border-[#ccc] bg-white text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="shipping">Bưu điện đang giao</option>
            <option value="delivered">Giao thành công</option>
            <option value="returned">Đang chuyển hoàn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {/* Tìm kiếm từ khóa */}
        <div className="flex items-center gap-1.5 flex-1 max-w-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-2 pr-7 text-xs border border-[#ccc] bg-white focus:outline-none"
            />
            <Search size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888]" />
          </div>
        </div>

        {/* Nút hành động Admin */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-8 px-3 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-[#ccc] cursor-pointer flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Tạo đơn hộ</span>
          </button>

          <button
            onClick={handleExportFile}
            className="h-8 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileSpreadsheet size={13} />
            <span>Xuất Excel Đối Soát COD</span>
          </button>
        </div>
      </div>

      {/* THANH THAO TÁC HÀNG LOẠT (BATCH ACTIONS CHO ĐỐI SOÁT COD) */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            <span className="font-bold">Đã chọn {selectedOrderIds.length} đơn hàng.</span>
            {selectedPendingOrders.length > 0 ? (
              <span className="text-slate-600">
                Có {selectedPendingOrders.length} đơn chờ đối soát COD: <strong>{formatCurrency(selectedBatchCODTotal)}</strong>
              </span>
            ) : (
              <span className="text-slate-500 italic">Không có đơn nào chờ đối soát COD trong các đơn đã chọn.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedPendingOrders.length > 0 && (
              <button
                onClick={handleBatchReconcileCOD}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xs cursor-pointer shadow-xs transition-colors"
              >
                Đối soát cả lô ({selectedPendingOrders.length} đơn)
              </button>
            )}
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-2.5 py-1 bg-white border border-[#ccc] hover:bg-slate-100 text-slate-700 rounded-xs cursor-pointer"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>
      )}

      {/* BẢNG GIÁM SÁT DÒNG ĐƠN & ĐỐI SOÁT */}
      <div className="bg-white border border-[#ccc] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white border-b border-[#ccc] text-[#333]">
              <th className="py-2 px-2 text-center border-r border-[#eee] w-8">
                <input
                  type="checkbox"
                  checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                  onChange={(e) => handleToggleSelectAll(e.target.checked)}
                  className="cursor-pointer"
                  title="Chọn tất cả đơn"
                />
              </th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Mã đơn</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Ngày & Kênh</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Khách hàng</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Sản phẩm mỹ phẩm</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Tổng tiền</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Thanh toán</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Đối soát COD bưu điện</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee] text-center">Trạng thái vận chuyển</th>
              <th className="py-2 px-2.5 font-normal text-right">Chi tiết</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eee]">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                return (
                  <tr key={order.id} className="hover:bg-[#f9f9f9]">
                    {/* Checkbox chọn hàng loạt */}
                    <td className="py-2 px-2 text-center border-r border-[#eee]">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(order.id)}
                        onChange={() => handleToggleSelectOrder(order.id)}
                        className="cursor-pointer"
                      />
                    </td>

                    {/* Mã đơn */}
                    <td className="py-2 px-2.5 font-mono text-[11px] font-bold text-[#337ab7] border-r border-[#eee] whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="hover:underline cursor-pointer"
                      >
                        {order.id}
                      </button>
                    </td>

                    {/* Ngày & Kênh nguồn */}
                    <td className="py-2 px-2.5 border-r border-[#eee] whitespace-nowrap">
                      <p className="text-[11px] text-gray-500">{order.date}</p>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                          order.source === 'AI_ONLINE'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.channelName}
                      </span>
                    </td>

                    {/* Khách hàng */}
                    <td className="py-2 px-2.5 border-r border-[#eee]">
                      <p className="font-semibold text-slate-800">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500">{order.phone}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1 max-w-[160px]" title={order.shippingAddress}>
                        {order.shippingAddress}
                      </p>
                    </td>

                    {/* Sản phẩm */}
                    <td className="py-2 px-2.5 border-r border-[#eee] max-w-[200px]">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="line-clamp-1 text-slate-700" title={it.name}>
                          • {it.name} <span className="font-bold text-slate-900">x{it.quantity}</span>
                        </div>
                      ))}
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-2 px-2.5 font-bold text-slate-900 border-r border-[#eee] whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </td>

                    {/* Hình thức thanh toán */}
                    <td className="py-2 px-2.5 border-r border-[#eee] whitespace-nowrap">
                      <p className="text-[11px] font-medium text-slate-700">{order.paymentMethod}</p>
                      <span
                        className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-semibold mt-0.5 ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>

                    {/* Đối soát COD */}
                    <td className="py-2 px-2.5 border-r border-[#eee] whitespace-nowrap">
                      {order.codStatus === 'pending_cod_transfer' && (
                        <div className="flex items-center gap-1">
                          <span className="text-amber-700 text-[11px] font-medium">Bưu điện đang giữ</span>
                          <button
                            onClick={() => handleReconcileCOD(order.id)}
                            className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] cursor-pointer"
                            title="Bấm khi bưu điện đã chuyển tiền COD vào tài khoản"
                          >
                            Đã nhận tiền
                          </button>
                        </div>
                      )}
                      {order.codStatus === 'reconciled' && (
                        <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle2 size={12} /> Đã vào ví shop
                        </span>
                      )}
                      {order.codStatus === 'store_collected' && (
                        <span className="text-blue-700 font-medium text-[11px]">
                          ✓ Thu tại quầy POS
                        </span>
                      )}
                    </td>

                    {/* Trạng thái vận chuyển */}
                    <td className="py-2 px-2.5 text-center border-r border-[#eee] whitespace-nowrap">
                      {order.status === 'shipping' && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-medium">
                          {order.statusText}
                        </span>
                      )}
                      {order.status === 'delivered' && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-medium">
                          {order.statusText}
                        </span>
                      )}
                      {order.status === 'returned' && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                          {order.statusText}
                        </span>
                      )}
                    </td>

                    {/* Nút xem chi tiết */}
                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2 py-1 bg-white border border-[#ccc] hover:bg-slate-100 rounded text-[11px] cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-gray-400">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG & ĐỐI SOÁT TÀI CHÍNH */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans text-xs text-[#333]">
          <div className="bg-white w-full max-w-xl border border-[#999] shadow-xl">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs flex items-center gap-1.5 text-slate-800">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Giám sát đơn hàng: {selectedOrder.id} ({selectedOrder.channelName})</span>
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-3.5 space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 border border-slate-200 rounded">
                <div>
                  <p className="text-[11px] text-gray-500">Khách hàng nhận:</p>
                  <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                  <p className="text-gray-600">{selectedOrder.phone}</p>
                  <p className="text-[11px] text-gray-600 mt-1">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500">Vận chuyển & Bưu cục:</p>
                  <p className="font-bold text-slate-900">{selectedOrder.carrier || 'Bán tại quầy'}</p>
                  {selectedOrder.trackingNumber && (
                    <p className="text-blue-700 font-mono text-[11px]">Mã vận đơn: {selectedOrder.trackingNumber}</p>
                  )}
                  <p className="text-emerald-700 font-semibold mt-1">Trạng thái: {selectedOrder.statusText}</p>
                </div>
              </div>

              {/* Sản phẩm trong đơn */}
              <div>
                <p className="font-bold border-b border-[#eee] pb-1 text-slate-800">Sản phẩm trong đơn hàng:</p>
                <div className="divide-y divide-[#eee] mt-1">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="py-1.5 flex justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{it.name}</p>
                        <p className="text-[11px] text-gray-500">Số lượng: {it.quantity}</p>
                      </div>
                      <div className="font-bold text-slate-800">
                        {formatCurrency(it.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Đối soát COD */}
              <div className="bg-amber-50/60 p-2.5 border border-amber-200 rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-900">Tình trạng đối soát tiền COD:</p>
                  <p className="text-amber-800 text-[11px]">{selectedOrder.codStatusText || 'Đã thanh toán'}</p>
                </div>
                {selectedOrder.codStatus === 'pending_cod_transfer' && (
                  <button
                    onClick={() => handleReconcileCOD(selectedOrder.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer"
                  >
                    Xác nhận bưu điện đã chuyển tiền
                  </button>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-[#ddd] flex items-center justify-between">
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' ? (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs cursor-pointer font-medium"
                >
                  Hủy đơn khẩn cấp
                </button>
              ) : <div />}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 py-1 bg-white border border-[#ccc] hover:bg-slate-100 text-xs rounded cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo đơn nhanh */}
      {isCreateModalOpen && (
        <CreateOrderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  );
}
