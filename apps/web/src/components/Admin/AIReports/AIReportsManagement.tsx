import { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  MessageSquare,
  Phone,
  ShieldAlert,
  Filter,
  Sparkles
} from 'lucide-react';

interface AIIncident {
  id: string;
  customerName: string;
  phone: string;
  channel: 'Facebook' | 'Zalo' | 'Website' | 'TikTok';
  issueType: 'Allergy' | 'DamagedGoods' | 'DelayedShip' | 'RefundRequest' | 'VIPConsult';
  issueTitle: string;
  aiSummary: string;
  sentiment: 'Frustrated' | 'Confused' | 'Urgent';
  createdAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  assignee: string; // 'Admin' hoặc tên CTV CSKH tại nhà
}

interface ProblemProduct {
  id: string;
  productName: string;
  sku: string;
  reportCount: number;
  mainIssue: string;
  suggestedAction: string;
  status: 'warning' | 'critical' | 'inspected';
}

const mockIncidents: AIIncident[] = [
  {
    id: 'INC-1092',
    customerName: 'Hoàng Kim Thoa',
    phone: '0912384756',
    channel: 'Facebook',
    issueType: 'Allergy',
    issueTitle: 'Da nổi mẩn đỏ sau khi dùng Serum B5',
    aiSummary: 'Khách dùng lần đầu tiên vào tối qua, sáng nay má nổi mẩn đỏ ngứa. AI đã khuyên ngưng dùng ngay và chườm lạnh. Khách muốn chuyên viên da liễu gọi lại tư vấn.',
    sentiment: 'Frustrated',
    createdAt: '15 phút trước',
    status: 'pending',
    assignee: 'Chưa phân công'
  },
  {
    id: 'INC-1091',
    customerName: 'Lê Văn Minh',
    phone: '0988776655',
    channel: 'Zalo',
    issueType: 'DamagedGoods',
    issueTitle: 'Chai nước tẩy trang bị nứt nắp, chảy nước',
    aiSummary: 'Khách nhận đơn #ORDER0008, mở hộp ra thấy nắp bị nứt và đổ 1/3 chai. Khách đã gửi ảnh bằng chứng qua Zalo và yêu cầu đổi chai mới.',
    sentiment: 'Urgent',
    createdAt: '45 phút trước',
    status: 'in_progress',
    assignee: 'CTV CSKH Nguyễn Mai (Tại nhà)'
  },
  {
    id: 'INC-1090',
    customerName: 'Phạm Thuỳ Dương',
    phone: '0903112233',
    channel: 'Website',
    issueType: 'VIPConsult',
    issueTitle: 'Tư vấn phác đồ trị nám & phục hồi sau laser',
    aiSummary: 'Khách vừa làm laser trị nám 3 ngày trước, cần tư vấn trọn bộ phục hồi trên 3 triệu. AI nhận diện khách VIP tiềm năng nên đã chuyển về cho Quản lý.',
    sentiment: 'Confused',
    createdAt: '2 giờ trước',
    status: 'pending',
    assignee: 'Admin (Ưu tiên cao)'
  },
  {
    id: 'INC-1089',
    customerName: 'Trần Đại Nghĩa',
    phone: '0934567890',
    channel: 'Facebook',
    issueType: 'DelayedShip',
    issueTitle: 'Đơn hàng 4 ngày chưa thấy bưu tá liên hệ',
    aiSummary: 'Đơn #ORDER0005 giao về Cần Thơ, bưu tá báo delay do mưa lớn. Khách cần gấp để mang đi công tác ngày mai.',
    sentiment: 'Urgent',
    createdAt: '3 giờ trước',
    status: 'resolved',
    assignee: 'CTV CSKH Lê Trang'
  }
];

const mockProblemProducts: ProblemProduct[] = [
  {
    id: 'PROB-01',
    productName: 'Serum Phục Hồi & Cấp Nước B5 Hoàng Bảo',
    sku: 'SERUM-B5-30ML',
    reportCount: 5,
    mainIssue: '3 khách phản ánh châm chích da nhạy cảm; 2 khách hỏi nồng độ cồn',
    suggestedAction: 'Cập nhật lại mô tả thành phần trên Web & Bổ sung lưu ý test trước ra cổ tay vào Prompt AI',
    status: 'warning'
  },
  {
    id: 'PROB-02',
    productName: 'Nước Tẩy Trang Dịu Nhẹ Mắt Môi',
    sku: 'TAYTRANG-MM-150ML',
    reportCount: 3,
    mainIssue: 'Vỡ nắp vặn trong quá trình vận chuyển bưu điện',
    suggestedAction: 'Yêu cầu bộ phận Kho quấn thêm 2 lớp bọc xốp chống sốc trước khi đóng thùng carton',
    status: 'critical'
  }
];

export default function AIReportsManagement() {
  const [incidents, setIncidents] = useState<AIIncident[]>(mockIncidents);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<AIIncident | null>(null);

  const handleAssignToRemoteStaff = (id: string, staffName: string) => {
    setIncidents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, assignee: staffName, status: 'in_progress' } : item
      )
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, assignee: staffName, status: 'in_progress' } : null));
    }
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'resolved' } : item
      )
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    }
  };

  const filteredIncidents = incidents.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-3 font-sans text-xs text-[#333]">
      {/* Header Banner thống kê hiệu suất AI */}
      <div className="bg-white border border-[#ccc] p-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#eee]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111] flex items-center gap-2">
                <span>Trung Tâm Giám Sát AI & Xử Lý Sự Cố Khách Hàng</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  n8n AI Agent Online
                </span>
              </h2>
              <p className="text-[11px] text-[#666]">
                Bộ lọc AI tự động giải quyết 80% câu hỏi; chuyển tiếp 20% ca khiếu nại & sản phẩm có vấn đề về cho Admin và CSKH xử lý
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#777]">Mô hình vận hành:</span>
            <span className="font-semibold bg-slate-100 px-2 py-1 border border-slate-300 rounded text-slate-800">
              AI Tự Động + CSKH Tại Nhà
            </span>
          </div>
        </div>

        {/* 3 Thẻ số liệu đo lường */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Tỷ lệ AI tự động giải quyết</p>
              <p className="text-lg font-bold text-emerald-600 mt-0.5">82.4%</p>
              <p className="text-[10px] text-gray-400">142/173 cuộc hội thoại tự động hoàn tất</p>
            </div>
            <Sparkles className="text-emerald-500" size={24} />
          </div>

          <div className="p-2.5 bg-[#fff8e6] border border-[#fde68a] rounded flex items-center justify-between">
            <div>
              <p className="text-[11px] text-amber-800 font-medium">Sự cố cần con người can thiệp (20%)</p>
              <p className="text-lg font-bold text-amber-700 mt-0.5">
                {incidents.filter((i) => i.status !== 'resolved').length} ca chờ xử lý
              </p>
              <p className="text-[10px] text-amber-600">Đơn dị ứng, vỡ hàng, khách VIP</p>
            </div>
            <AlertTriangle className="text-amber-600" size={24} />
          </div>

          <div className="p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded flex items-center justify-between">
            <div>
              <p className="text-[11px] text-rose-800 font-medium">Cảnh báo sản phẩm bị lỗi nhiều</p>
              <p className="text-lg font-bold text-rose-600 mt-0.5">
                {mockProblemProducts.length} sản phẩm
              </p>
              <p className="text-[10px] text-rose-500">Khách báo lỗi bao bì hoặc kích ứng da</p>
            </div>
            <ShieldAlert className="text-rose-600" size={24} />
          </div>
        </div>
      </div>

      {/* CẢNH BÁO SẢN PHẨM CÓ VẤN ĐỀ TỪ AI */}
      <div className="bg-white border border-[#ccc] p-3 space-y-2">
        <div className="flex items-center justify-between border-b border-[#eee] pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 uppercase">
            <ShieldAlert size={15} />
            <span>Sản phẩm bị AI phát hiện phàn nàn nhiều (Cần kiểm tra)</span>
          </div>
          <span className="text-[11px] text-[#777]">Dữ liệu trích xuất từ các cuộc hội thoại khách hàng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {mockProblemProducts.map((prod) => (
            <div key={prod.id} className="p-2.5 bg-rose-50/50 border border-rose-200 rounded space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{prod.productName}</span>
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold rounded text-[10px]">
                  {prod.reportCount} lượt phản ánh
                </span>
              </div>
              <p className="text-slate-600">
                <strong className="text-rose-800">Vấn đề:</strong> {prod.mainIssue}
              </p>
              <div className="bg-white p-2 border border-rose-100 rounded text-[11px] text-slate-700">
                <strong className="text-emerald-700">Đề xuất giải quyết cho Admin:</strong> {prod.suggestedAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DANH SÁCH CÁC CA KHIẾU NẠI & SỰ CỐ CẦN XỬ LÝ (20%) */}
      <div className="bg-white border border-[#ccc]">
        <div className="p-2.5 bg-[#f5f5f5] border-b border-[#ddd] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">Danh sách Sự cố & Khiếu nại từ AI</span>
            <span className="text-[11px] text-gray-500">(Admin hoặc CTV CSKH tại nhà xử lý)</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={12} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-7 px-2 border border-[#ccc] bg-white text-xs focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white border-b border-[#ccc] text-[#555]">
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Mã sự cố</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Khách hàng</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Kênh</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Vấn đề phản ánh</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Tóm tắt từ AI</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Người phụ trách</th>
                <th className="py-2 px-2.5 font-normal border-r border-[#eee] text-center">Trạng thái</th>
                <th className="py-2 px-2.5 font-normal text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee]">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#f9f9f9]">
                  <td className="py-2 px-2.5 font-mono text-[11px] text-blue-700 border-r border-[#eee] whitespace-nowrap">
                    {inc.id}
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] whitespace-nowrap">
                    <p className="font-semibold text-slate-800">{inc.customerName}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Phone size={10} /> {inc.phone}
                    </p>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {inc.channel}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] font-medium text-slate-800 max-w-[180px]">
                    <span className="line-clamp-1" title={inc.issueTitle}>{inc.issueTitle}</span>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] text-gray-600 max-w-[240px]">
                    <span className="line-clamp-2 text-[11px]" title={inc.aiSummary}>
                      {inc.aiSummary}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] whitespace-nowrap">
                    <span
                      className={`text-[11px] font-medium ${
                        inc.assignee === 'Chưa phân công' ? 'text-red-500 italic' : 'text-slate-700'
                      }`}
                    >
                      {inc.assignee}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 border-r border-[#eee] text-center whitespace-nowrap">
                    {inc.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px]">
                        Chờ xử lý
                      </span>
                    )}
                    {inc.status === 'in_progress' && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px]">
                        Đang xử lý
                      </span>
                    )}
                    {inc.status === 'resolved' && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px]">
                        Đã giải quyết
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-2 py-1 bg-[#337ab7] hover:bg-[#286090] text-white rounded text-[11px] cursor-pointer"
                    >
                      Chi tiết & Phân công
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT SỰ CỐ & PHÂN CÔNG CSKH TẠI NHÀ */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans text-xs text-[#333]">
          <div className="bg-white w-full max-w-lg border border-[#999] shadow-xl">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs flex items-center gap-1.5 text-slate-800">
                <MessageSquare size={14} className="text-purple-600" />
                <span>Chi tiết ca khiếu nại: {selectedIncident.id}</span>
              </h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-3.5 space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="bg-slate-50 p-2.5 border border-slate-200 rounded space-y-1">
                <p>
                  <strong>Khách hàng:</strong> {selectedIncident.customerName} - <strong>SĐT:</strong> {selectedIncident.phone}
                </p>
                <p>
                  <strong>Nguồn hội thoại:</strong> {selectedIncident.channel} ({selectedIncident.createdAt})
                </p>
                <p className="text-red-700 font-bold">
                  Vấn đề: {selectedIncident.issueTitle}
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold block text-purple-900">Báo cáo tóm tắt từ AI Agent:</label>
                <div className="bg-purple-50/60 border border-purple-200 p-2.5 rounded text-purple-950 leading-relaxed text-xs">
                  {selectedIncident.aiSummary}
                </div>
              </div>

              {/* Lựa chọn hành động của Admin */}
              <div className="space-y-2 pt-2 border-t border-[#eee]">
                <label className="font-bold block">Phân công người phụ trách:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleAssignToRemoteStaff(selectedIncident.id, 'Admin (Trực tiếp giải quyết)')}
                    className="p-2 border border-slate-300 hover:bg-slate-100 rounded text-left font-medium cursor-pointer"
                  >
                    👑 Admin tự giải quyết
                  </button>
                  <button
                    onClick={() => handleAssignToRemoteStaff(selectedIncident.id, 'CTV CSKH Nguyễn Mai (Tại nhà)')}
                    className="p-2 border border-blue-200 hover:bg-blue-50 text-blue-800 rounded text-left font-medium cursor-pointer"
                  >
                    🏠 Giao CTV Nguyễn Mai (Tại nhà)
                  </button>
                  <button
                    onClick={() => handleAssignToRemoteStaff(selectedIncident.id, 'CTV CSKH Lê Trang (Tại nhà)')}
                    className="p-2 border border-blue-200 hover:bg-blue-50 text-blue-800 rounded text-left font-medium cursor-pointer"
                  >
                    🏠 Giao CTV Lê Trang (Tại nhà)
                  </button>
                  <button
                    onClick={() => handleResolveIncident(selectedIncident.id)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-center cursor-pointer"
                  >
                    ✓ Đánh dấu đã giải quyết
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-[#ddd] flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-3 py-1 bg-white border border-[#ccc] hover:bg-slate-100 text-xs rounded cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
