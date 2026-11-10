import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bot,
  MessageSquare,
  Phone,
  Mail,
  ShieldAlert,
  Filter,
  Trash2,
  Check,
  Eye,
  Inbox
} from 'lucide-react';
import { adminService, type AdminFeedbackItem } from '@/services/adminService';

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
  assignee: string;
  resolutionNote?: string;
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
  const [activeSubTab, setActiveSubTab] = useState<'feedbacks' | 'ai_incidents'>('feedbacks');

  // State cho Feedback thực tế từ Database
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedbackItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State cho Sự cố AI
  const [incidents, setIncidents] = useState<AIIncident[]>(mockIncidents);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<AIIncident | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');

  const loadFeedbacks = async () => {
    setFeedbackLoading(true);
    try {
      const data = await adminService.getAdminFeedbacks(0, 50);
      setFeedbacks(data);
    } catch (err: any) {
      console.warn('[AIReportsManagement] Lỗi khi tải feedbacks:', err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await adminService.markFeedbackAsRead(id);
      setFeedbacks((prev) => prev.map((f) => (f.idFeedback === id ? { ...f, isRead: true } : f)));
      if (selectedFeedback?.idFeedback === id) {
        setSelectedFeedback((prev) => (prev ? { ...prev, isRead: true } : null));
      }
      setToastMessage({ type: 'success', text: 'Đã đánh dấu đã đọc phản hồi.' });
    } catch (err: any) {
      setToastMessage({ type: 'error', text: 'Không thể cập nhật trạng thái phản hồi.' });
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;
    try {
      await adminService.deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((f) => f.idFeedback !== id));
      if (selectedFeedback?.idFeedback === id) {
        setSelectedFeedback(null);
      }
      setToastMessage({ type: 'success', text: 'Đã xóa phản hồi thành công.' });
    } catch (err: any) {
      setToastMessage({ type: 'error', text: 'Lỗi khi xóa phản hồi.' });
    }
  };

  const handleOpenIncidentModal = (inc: AIIncident) => {
    setSelectedIncident(inc);
    setResolutionNote(inc.resolutionNote || '');
  };

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
        item.id === id
          ? {
              ...item,
              status: 'resolved',
              resolutionNote: resolutionNote.trim() || 'Đã giải quyết thỏa đáng cho khách hàng'
            }
          : item
      )
    );
    setSelectedIncident(null);
  };

  const unreadFeedbacksCount = feedbacks.filter((f) => !f.isRead).length;

  const filteredIncidents = incidents.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-3 font-sans text-xs text-[#333]">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-2.5 border text-xs flex items-center justify-between ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs font-bold px-1 hover:opacity-75 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Banner thống kê hiệu suất CSKH & AI */}
      <div className="bg-white border border-[#ccc] p-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#eee]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111] flex items-center gap-2">
                <span>Trung Tâm Phản Hồi Khách Hàng & Giám Sát CSKH</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  Hệ thống CSKH Online
                </span>
              </h2>
              <p className="text-[11px] text-[#666]">
                Quản lý thư liên hệ, đóng góp ý kiến từ khách hàng và tiếp nhận các ca khiếu nại chất lượng sản phẩm
              </p>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-[#f0f2f5] p-1 rounded border border-[#ddd]">
            <button
              onClick={() => setActiveSubTab('feedbacks')}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeSubTab === 'feedbacks'
                  ? 'bg-white text-[#337ab7] shadow-xs'
                  : 'text-[#666] hover:text-[#111]'
              }`}
            >
              <Inbox size={13} />
              <span>Hòm thư Phản hồi</span>
              {unreadFeedbacksCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white font-bold text-[10px] rounded-full">
                  {unreadFeedbacksCount} mới
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('ai_incidents')}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeSubTab === 'ai_incidents'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-[#666] hover:text-[#111]'
              }`}
            >
              <AlertTriangle size={13} />
              <span>Sự cố & Khiếu nại Đơn</span>
              <span className="px-1.5 py-0.2 bg-amber-500 text-black font-bold text-[10px] rounded-full">
                {incidents.filter((i) => i.status !== 'resolved').length} ca
              </span>
            </button>
          </div>
        </div>

        {/* 3 Thẻ số liệu đo lường */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Hòm thư khách hàng gửi</p>
              <p className="text-lg font-bold text-[#337ab7] mt-0.5">{feedbacks.length} phản hồi</p>
              <p className="text-[10px] text-gray-400">
                {unreadFeedbacksCount > 0 ? `${unreadFeedbacksCount} tin nhắn chưa đọc` : 'Tất cả đã được tiếp nhận'}
              </p>
            </div>
            <MessageSquare className="text-[#337ab7]" size={24} />
          </div>

          <div className="p-2.5 bg-[#fff8e6] border border-[#fde68a] rounded flex items-center justify-between">
            <div>
              <p className="text-[11px] text-amber-800 font-medium">Sự cố cần con người can thiệp</p>
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

      {/* ================= SUB-TAB 1: HÒM THƯ PHẢN HỒI KHÁCH HÀNG (DATABASE API) ================= */}
      {activeSubTab === 'feedbacks' && (
        <div className="bg-white border border-[#ccc]">
          <div className="p-2.5 bg-[#f5f5f5] border-b border-[#ddd] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs">Hòm thư Góp ý & Liên hệ từ Khách hàng</span>
              <span className="text-[11px] text-gray-500">(Dữ liệu đồng bộ trực tiếp từ Database)</span>
            </div>
            <button
              onClick={loadFeedbacks}
              className="px-2 py-0.5 border border-[#ccc] bg-white hover:bg-[#e6e6e6] text-[#333] cursor-pointer"
            >
              Làm mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#ccc] text-[#333]">
                  <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Khách hàng</th>
                  <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Liên hệ</th>
                  <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Chủ đề</th>
                  <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Nội dung tin nhắn</th>
                  <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Thời gian</th>
                  <th className="py-2 px-2.5 font-semibold text-center border-r border-[#eee]">Trạng thái</th>
                  <th className="py-2 px-2.5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee]">
                {feedbackLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                      Đang tải danh sách phản hồi...
                    </td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                      Chưa có phản hồi hoặc tin nhắn liên hệ nào từ khách hàng.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((f) => (
                    <tr
                      key={f.idFeedback}
                      className={`hover:bg-[#fcfcfc] ${!f.isRead ? 'bg-amber-50/40 font-medium' : ''}`}
                    >
                      <td className="py-2 px-2.5 border-r border-[#eee] font-semibold text-[#222]">
                        {f.name}
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] text-[#555]">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Mail size={11} className="text-gray-400" />
                          <span>{f.email}</span>
                        </div>
                        {f.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Phone size={11} className="text-gray-400" />
                            <span>{f.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] text-[#333] max-w-[150px] truncate">
                        {f.subject || 'Liên hệ chung'}
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] text-gray-600 max-w-xs truncate">
                        {f.message}
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] text-gray-500 text-[11px]">
                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                      </td>
                      <td className="py-2 px-2.5 text-center border-r border-[#eee]">
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                            f.isRead
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {f.isRead ? 'Đã xem' : 'Chưa đọc'}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 text-[11px]">
                          <button
                            onClick={() => {
                              setSelectedFeedback(f);
                              if (!f.isRead) handleMarkAsRead(f.idFeedback);
                            }}
                            className="text-[#337ab7] hover:underline cursor-pointer flex items-center gap-0.5"
                            title="Xem chi tiết"
                          >
                            <Eye size={11} />
                            <span>Xem</span>
                          </button>
                          {!f.isRead && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleMarkAsRead(f.idFeedback)}
                                className="text-emerald-600 hover:underline cursor-pointer flex items-center gap-0.5"
                                title="Đánh dấu đã đọc"
                              >
                                <Check size={11} />
                                <span>Đã đọc</span>
                              </button>
                            </>
                          )}
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeleteFeedback(f.idFeedback)}
                            className="text-rose-600 hover:underline cursor-pointer flex items-center gap-0.5"
                            title="Xóa phản hồi"
                          >
                            <Trash2 size={11} />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: SỰ CỐ AI & KHIẾU NẠI ĐƠN HÀNG ================= */}
      {activeSubTab === 'ai_incidents' && (
        <div className="space-y-3">
          {/* CẢNH BÁO SẢN PHẨM CÓ VẤN ĐỀ TỪ AI */}
          <div className="bg-white border border-[#ccc] p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-[#eee] pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 uppercase">
                <ShieldAlert size={15} />
                <span>Sản phẩm bị phát hiện phàn nàn nhiều (Cần kiểm tra)</span>
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

          {/* DANH SÁCH CÁC CA KHIẾU NẠI */}
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
                  className="h-6 px-1.5 border border-[#ccc] bg-white text-xs cursor-pointer focus:outline-none"
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
                  <tr className="bg-[#fff] border-b border-[#ccc] text-[#333]">
                    <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Mã sự cố</th>
                    <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Khách hàng</th>
                    <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Loại sự cố</th>
                    <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Tóm tắt nội dung</th>
                    <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Thời gian</th>
                    <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Phân công</th>
                    <th className="py-2 px-2.5 font-normal text-center border-r border-[#eee]">Trạng thái</th>
                    <th className="py-2 px-2.5 font-normal text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee]">
                  {filteredIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-[#f9f9f9]">
                      <td className="py-2 px-2.5 font-bold font-mono text-[#337ab7] border-r border-[#eee]">
                        {inc.id}
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee]">
                        <div className="font-semibold text-slate-800">{inc.customerName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Phone size={10} />
                          <span>{inc.phone}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee]">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {inc.issueType}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] max-w-xs">
                        <div className="font-medium text-slate-800 truncate">{inc.issueTitle}</div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{inc.aiSummary}</div>
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] text-gray-500 text-[11px]">
                        {inc.createdAt}
                      </td>
                      <td className="py-2 px-2.5 border-r border-[#eee] text-gray-700">
                        {inc.assignee}
                      </td>
                      <td className="py-2 px-2.5 text-center border-r border-[#eee]">
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                            inc.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inc.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inc.status === 'resolved'
                            ? 'Đã xử lý'
                            : inc.status === 'in_progress'
                            ? 'Đang xử lý'
                            : 'Chờ xử lý'}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenIncidentModal(inc)}
                          className="text-[#337ab7] hover:underline cursor-pointer font-medium"
                        >
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi Tiết Phản Hồi Khách Hàng */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg border border-[#999] shadow-lg">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#222] flex items-center gap-1.5">
                <Mail size={14} className="text-[#337ab7]" />
                <span>Chi tiết phản hồi từ khách hàng</span>
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-3 space-y-3 text-xs text-[#333]">
              <div className="bg-slate-50 p-2.5 border border-slate-200 rounded grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-500">Khách hàng:</span>{' '}
                  <span className="font-semibold">{selectedFeedback.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{' '}
                  <a
                    href={`mailto:${selectedFeedback.email}`}
                    className="text-[#337ab7] hover:underline font-mono"
                  >
                    {selectedFeedback.email}
                  </a>
                </div>
                {selectedFeedback.phone && (
                  <div>
                    <span className="text-gray-500">SĐT:</span>{' '}
                    <a
                      href={`tel:${selectedFeedback.phone}`}
                      className="text-[#337ab7] hover:underline font-mono"
                    >
                      {selectedFeedback.phone}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Ngày gửi:</span>{' '}
                  <span>
                    {selectedFeedback.createdAt
                      ? new Date(selectedFeedback.createdAt).toLocaleString('vi-VN')
                      : 'Mới'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold block mb-1">
                  Chủ đề: {selectedFeedback.subject || 'Liên hệ chung'}
                </span>
                <div className="bg-gray-50 p-3 border border-gray-200 rounded text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedFeedback.message}
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteFeedback(selectedFeedback.idFeedback)}
                  className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded cursor-pointer flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>Xóa</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFeedback(null)}
                    className="px-3 py-1 bg-white border border-[#ccc] hover:bg-[#e6e6e6] text-[#333] cursor-pointer"
                  >
                    Đóng
                  </button>
                  <a
                    href={`mailto:${selectedFeedback.email}?subject=Phản hồi từ Hoàng Bảo Cosmetics về "${selectedFeedback.subject || 'Liên hệ'}"`}
                    className="px-3 py-1 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Mail size={12} />
                    <span>Gửi Email phản hồi</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xử Lý Sự Cố AI */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md border border-[#999] shadow-lg">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#222]">
                Xử lý sự cố: {selectedIncident.id} ({selectedIncident.customerName})
              </h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-3 space-y-2.5 text-xs text-[#333]">
              <div className="bg-amber-50 p-2 border border-amber-200 rounded text-[11px] text-amber-900">
                <span className="font-bold">Tóm tắt sự cố từ AI:</span> {selectedIncident.aiSummary}
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Phân công người xử lý</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAssignToRemoteStaff(selectedIncident.id, 'Admin (Ưu tiên)')}
                    className="flex-1 py-1 border border-[#ccc] hover:bg-[#eee] cursor-pointer"
                  >
                    Admin xử lý ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignToRemoteStaff(selectedIncident.id, 'CTV CSKH Nguyễn Mai')}
                    className="flex-1 py-1 border border-[#ccc] hover:bg-[#eee] cursor-pointer"
                  >
                    Giao CTV Mai
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Ghi chú giải quyết</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Nhập ghi chú hướng xử lý (ví dụ: Đã gọi điện xin lỗi và gửi đổi sản phẩm mới)..."
                  className="w-full p-2 border border-[#ccc] text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#eee] flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedIncident(null)}
                  className="px-3 py-1 bg-white border border-[#ccc] hover:bg-[#e6e6e6] text-[#333] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveIncident(selectedIncident.id)}
                  className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                >
                  Hoàn tất xử lý
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
