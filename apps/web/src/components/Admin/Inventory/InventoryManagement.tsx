import { useState } from 'react';
import {
  Boxes,
  Clock,
  CheckCircle,
  FileCheck,
  Zap
} from 'lucide-react';

interface InboundReceipt {
  id: string;
  supplierName: string;
  creatorName: string;
  createdAt: string;
  totalCost: number;
  totalItems: number;
  status: 'pending_admin_approval' | 'approved' | 'rejected';
  note: string;
}

interface ExpiringProduct {
  id: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: string;
  daysRemaining: number;
  quantityInStock: number;
  costPrice: number;
  sellingPrice: number;
}

const mockReceipts: InboundReceipt[] = [
  {
    id: 'PH-NHAP-2026-004',
    supplierName: 'Công ty TNHH Phân Phối Dược Mỹ Phẩm Á Châu',
    creatorName: 'Lê Văn Kho (Thủ kho)',
    createdAt: 'Hôm nay, 10:15',
    totalCost: 45000000,
    totalItems: 120,
    status: 'pending_admin_approval',
    note: 'Lô hàng Serum B5 + Kem chống nắng chuẩn bị cho chiến dịch Flash Sale'
  },
  {
    id: 'PH-NHAP-2026-003',
    supplierName: 'Nhà Nhập Khẩu Mỹ Phẩm Hàn Quốc K-Beauty',
    creatorName: 'Lê Văn Kho (Thủ kho)',
    createdAt: '25/09/2026',
    totalCost: 28500000,
    totalItems: 85,
    status: 'approved',
    note: 'Hàng nhập bổ sung son kem lì và nước hoa mini'
  }
];

const mockExpiringProducts: ExpiringProduct[] = [
  {
    id: 'EXP-01',
    productName: 'Kem Dưỡng Ẩm Trắng Da Chiết Xuất Trà Xanh',
    sku: 'KEM-DUONG-TX-50ML',
    batchNumber: 'LOT-2024-TX01',
    expiryDate: '15/12/2026',
    daysRemaining: 78,
    quantityInStock: 24,
    costPrice: 150000,
    sellingPrice: 320000
  },
  {
    id: 'EXP-02',
    productName: 'Mặt Nạ Giấy Dưỡng Ẩm Chuyên Sâu (Hộp 10 miếng)',
    sku: 'MN-GIAY-CAPAM-10',
    batchNumber: 'LOT-2024-MN09',
    expiryDate: '20/01/2027',
    daysRemaining: 115,
    quantityInStock: 45,
    costPrice: 90000,
    sellingPrice: 220000
  }
];

export default function InventoryManagement() {
  const [receipts, setReceipts] = useState<InboundReceipt[]>(mockReceipts);
  const [expiringProducts] = useState<ExpiringProduct[]>(mockExpiringProducts);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
    showToast(`Đã phê duyệt phiếu nhập ${id}. Tồn kho đã được cộng tự động!`);
  };

  const handleRejectReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
    showToast(`Đã từ chối phiếu nhập ${id}.`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-3 font-sans text-xs text-[#333]">
      {toastMessage && (
        <div className="fixed top-12 right-6 z-50 bg-[#333] text-white px-3 py-2 rounded shadow-md text-xs flex items-center gap-1.5">
          <CheckCircle size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3 Thẻ thống kê kho tổng cho Admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-[#ccc] p-3 rounded-xs flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Tổng giá trị tồn kho (Giá vốn)</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">386.500.000đ</p>
            <p className="text-[10px] text-gray-400">Đang lưu tại Kho Tân Phú (TP.HCM)</p>
          </div>
          <Boxes className="text-blue-600" size={28} />
        </div>

        <div className="bg-white border border-[#ccc] p-3 rounded-xs flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Phiếu nhập kho chờ duyệt</p>
            <p className="text-lg font-bold text-amber-700 mt-0.5">
              {receipts.filter((r) => r.status === 'pending_admin_approval').length} phiếu
            </p>
            <p className="text-[10px] text-amber-600">Thủ kho đề xuất nhập đợt mới</p>
          </div>
          <FileCheck className="text-amber-600" size={28} />
        </div>

        <div className="bg-white border border-[#ccc] p-3 rounded-xs flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Mỹ phẩm cận hạn sử dụng (&lt; 6 tháng)</p>
            <p className="text-lg font-bold text-rose-600 mt-0.5">
              {expiringProducts.reduce((sum, p) => sum + p.quantityInStock, 0)} hộp
            </p>
            <p className="text-[10px] text-rose-500">Cần tạo Flash Sale xả hàng</p>
          </div>
          <Clock className="text-rose-600" size={28} />
        </div>
      </div>

      {/* PHIẾU NHẬP KHO CHỜ ADMIN PHÊ DUYỆT */}
      <div className="bg-white border border-[#ccc]">
        <div className="p-2.5 bg-[#f5f5f5] border-b border-[#ddd] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <FileCheck size={14} className="text-blue-600" />
            <span>Phiếu Nhập Hàng Chờ Admin Phê Duyệt</span>
          </div>
          <span className="text-[11px] text-gray-500">Thủ kho tạo phiếu $\rightarrow$ Admin duyệt $\rightarrow$ Kho mới được cộng tồn</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white border-b border-[#ccc] text-[#555]">
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Mã phiếu</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Nhà cung cấp</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Người lập</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Số lượng</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Tổng tiền nhập</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Ghi chú</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee] text-center">Trạng thái</th>
                <th className="py-2 px-2.5 font-normal text-right">Quyết định của Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee]">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-[#f9f9f9]">
                  <td className="py-2 px-2.5 font-mono text-[11px] text-blue-700 border-r border-[#eee] whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="py-2 px-2.5 font-medium border-r border-[#eee] text-slate-800 max-w-[200px]">
                    <span className="line-clamp-1">{r.supplierName}</span>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] text-gray-600 whitespace-nowrap">
                    {r.creatorName} ({r.createdAt})
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] font-bold text-center">
                    {r.totalItems} món
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] font-bold text-red-600 whitespace-nowrap">
                    {formatCurrency(r.totalCost)}
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] text-gray-500 max-w-[180px]">
                    <span className="line-clamp-1">{r.note}</span>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] text-center whitespace-nowrap">
                    {r.status === 'pending_admin_approval' && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px]">
                        Chờ Admin duyệt
                      </span>
                    )}
                    {r.status === 'approved' && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px]">
                        Đã duyệt nhập kho
                      </span>
                    )}
                    {r.status === 'rejected' && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                        Đã từ chối
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    {r.status === 'pending_admin_approval' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApproveReceipt(r.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          Duyệt nhập
                        </button>
                        <button
                          onClick={() => handleRejectReceipt(r.id)}
                          className="px-2 py-1 bg-white border border-[#ccc] hover:bg-rose-50 text-rose-600 rounded text-[11px] cursor-pointer"
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Đã hoàn tất</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CẢNH BÁO MỸ PHẨM CẬN DATE (< 6 THÁNG) */}
      <div className="bg-white border border-[#ccc]">
        <div className="p-2.5 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
            <Clock size={14} className="text-rose-600" />
            <span>Cảnh Báo Hàng Cận Date (Hạn sử dụng dưới 6 tháng)</span>
          </div>
          <span className="text-[11px] text-rose-700">Khuyến nghị: Tạo Flash Sale giảm giá sâu để thu hồi vốn</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white border-b border-[#ccc] text-[#555]">
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Sản phẩm</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Lô sản xuất</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Hạn dùng (EXP)</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Còn lại</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Tồn kho</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Giá vốn / Giá bán</th>
                <th className="py-2 px-2.5 font-normal text-right">Hành động xả hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee]">
              {expiringProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#f9f9f9]">
                  <td className="py-2 px-2.5 font-semibold text-slate-800 border-r border-[#eee]">
                    {p.productName}
                  </td>
                  <td className="py-2 px-2.5 font-mono text-[11px] text-gray-600 border-r border-[#eee]">
                    {p.batchNumber}
                  </td>
                  <td className="py-2 px-2.5 font-bold text-red-600 border-r border-[#eee]">
                    {p.expiryDate}
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee]">
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                      Còn {p.daysRemaining} ngày
                    </span>
                  </td>
                  <td className="py-2 px-2.5 font-bold text-center border-r border-[#eee]">
                    {p.quantityInStock} hộp
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] text-[11px]">
                    <span className="text-gray-500 line-through mr-1">{formatCurrency(p.sellingPrice)}</span>
                    <span className="text-slate-800 font-medium">(Vốn: {formatCurrency(p.costPrice)})</span>
                  </td>
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => showToast(`Đã tạo chiến dịch Flash Sale giảm 40% cho sản phẩm ${p.productName}`)}
                      className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-medium flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Zap size={11} />
                      <span>Tạo Flash Sale Xả Kho</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
