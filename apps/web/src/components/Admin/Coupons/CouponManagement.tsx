import { useState, useEffect } from 'react';
import { adminService, type AdminCouponItem, type CreateCouponPayload } from '@/services/adminService';
import { Ticket, Plus, Search, CheckCircle, AlertCircle, Trash2, Power } from 'lucide-react';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<AdminCouponItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal tạo mã giảm giá
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCouponPayload>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: undefined,
    usageLimit: 100,
    isActive: true
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminCoupons(0, 50);
      setCoupons(data);
    } catch (err: any) {
      console.warn('[CouponManagement] Lỗi khi tải mã giảm giá:', err);
      setStatusMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ mã giảm giá.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggleStatus = async (coupon: AdminCouponItem) => {
    const actionText = coupon.isActive ? 'tạm dừng' : 'kích hoạt lại';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} mã "${coupon.code}"?`)) {
      return;
    }

    try {
      const updated = await adminService.toggleAdminCouponStatus(coupon.idCoupon);
      setCoupons((prev) =>
        prev.map((c) => (c.idCoupon === coupon.idCoupon ? { ...c, isActive: updated.isActive } : c))
      );
      setStatusMessage({
        type: 'success',
        text: `Đã ${actionText} mã giảm giá "${coupon.code}" thành công!`
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi khi cập nhật trạng thái mã giảm giá.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleDelete = async (coupon: AdminCouponItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá "${coupon.code}"?`)) {
      return;
    }

    try {
      await adminService.deleteAdminCoupon(coupon.idCoupon);
      setCoupons((prev) => prev.filter((c) => c.idCoupon !== coupon.idCoupon));
      setStatusMessage({
        type: 'success',
        text: `Đã xóa mã giảm giá "${coupon.code}" thành công!`
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi khi xóa mã giảm giá.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập mã voucher!' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const payload: CreateCouponPayload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description?.trim() || undefined,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00` : undefined,
        endDate: formData.endDate ? `${formData.endDate}T23:59:59` : undefined,
        isActive: formData.isActive
      };

      const created = await adminService.createAdminCoupon(payload);
      setCoupons((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 0,
        maxDiscountAmount: undefined,
        usageLimit: 100,
        isActive: true
      });
      setStatusMessage({
        type: 'success',
        text: `Đã tạo mã giảm giá "${created.code}" thành công!`
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi khi tạo mã giảm giá.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(keyword.trim().toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(keyword.trim().toLowerCase()))
  );

  return (
    <div className="space-y-2 text-xs text-[#333] font-sans">
      {/* Thông báo Alert */}
      {statusMessage && (
        <div
          className={`p-2.5 border text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle size={14} className="text-emerald-600" />
            ) : (
              <AlertCircle size={14} className="text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold px-1 hover:opacity-75 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white p-2.5 border border-[#ccc] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Ticket size={16} className="text-[#f39c12]" />
          <span className="font-bold text-xs text-[#222]">Quản lý Mã Giảm Giá & Voucher</span>
          <span className="text-[#777] text-[11px]">({coupons.length} mã trên hệ thống)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tìm kiếm */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm theo mã hoặc mô tả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-7 pl-7 pr-2 border border-[#ccc] bg-white text-xs focus:outline-none w-52"
            />
            <Search size={12} className="absolute left-2 text-gray-400" />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="h-7 px-3 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Thêm voucher</span>
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white border border-[#ccc] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#ccc] text-[#333]">
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Mã Voucher</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Mô tả & Loại giảm</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Mức giảm</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Đơn tối thiểu</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Lượt dùng</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Thời hạn</th>
              <th className="py-2 px-2.5 font-semibold text-center border-r border-[#eee]">Trạng thái</th>
              <th className="py-2 px-2.5 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee]">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500 italic">
                  Đang tải danh sách voucher...
                </td>
              </tr>
            ) : filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-400 italic">
                  Không tìm thấy mã giảm giá nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredCoupons.map((c) => {
                const isExpired = c.endDate && new Date(c.endDate) < new Date();
                return (
                  <tr key={c.idCoupon} className="hover:bg-[#fcfcfc]">
                    <td className="py-2 px-2.5 font-bold text-[#b33939] font-mono border-r border-[#eee]">
                      <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee]">
                      <div className="font-medium text-[#222]">{c.description || 'Không có mô tả'}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {c.discountType === 'PERCENTAGE' ? 'Giảm theo phần trăm' : 'Giảm tiền mặt cố định'}
                      </div>
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee] font-semibold text-[#2980b9]">
                      {c.discountType === 'PERCENTAGE' ? (
                        <div>
                          <span>{c.discountValue}%</span>
                          {c.maxDiscountAmount && (
                            <span className="text-[10px] text-gray-500 block font-normal">
                              Tối đa: {Number(c.maxDiscountAmount).toLocaleString('vi-VN')}₫
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>{Number(c.discountValue).toLocaleString('vi-VN')}₫</span>
                      )}
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee] text-[#555]">
                      {c.minOrderAmount && Number(c.minOrderAmount) > 0
                        ? `${Number(c.minOrderAmount).toLocaleString('vi-VN')}₫`
                        : 'Không giới hạn'}
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee] text-gray-600">
                      <span className="font-medium">{c.usedCount || 0}</span> /{' '}
                      <span>{c.usageLimit ? c.usageLimit : '∞'}</span>
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee] text-[11px] text-[#666]">
                      {c.startDate ? new Date(c.startDate).toLocaleDateString('vi-VN') : 'Bắt đầu ngay'}{' '}
                      →{' '}
                      {c.endDate ? (
                        <span className={isExpired ? 'text-red-600 font-bold' : ''}>
                          {new Date(c.endDate).toLocaleDateString('vi-VN')}
                        </span>
                      ) : (
                        'Vô thời hạn'
                      )}
                    </td>
                    <td className="py-2 px-2.5 text-center border-r border-[#eee]">
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded ${
                          c.isActive && !isExpired
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isExpired ? 'Hết hạn' : c.isActive ? 'Kích hoạt' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 text-[11px]">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`cursor-pointer hover:underline font-medium flex items-center gap-0.5 ${
                            c.isActive ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                          title={c.isActive ? 'Tạm dừng mã' : 'Kích hoạt mã'}
                        >
                          <Power size={11} />
                          <span>{c.isActive ? 'Tạm dừng' : 'Bật lại'}</span>
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(c)}
                          className="text-rose-600 hover:underline cursor-pointer flex items-center gap-0.5"
                          title="Xóa voucher"
                        >
                          <Trash2 size={11} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm mã giảm giá */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg border border-[#999] shadow-lg">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#222] flex items-center gap-1.5">
                <Ticket size={14} className="text-[#f39c12]" />
                <span>Thêm mã giảm giá mới</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-3 space-y-2.5 text-xs text-[#333]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-0.5 font-medium">Mã Voucher *</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: BEAUTY50K"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block mb-0.5 font-medium">Loại giảm giá *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT'
                      })
                    }
                    className="w-full h-7 px-1.5 border border-[#ccc] bg-white text-xs cursor-pointer"
                  >
                    <option value="PERCENTAGE">Giảm theo phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Giảm số tiền cố định (₫)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Mô tả chương trình</label>
                <input
                  type="text"
                  placeholder="Giảm 10% cho đơn hàng mỹ phẩm chăm sóc da"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-0.5 font-medium">
                    Giá trị giảm * {formData.discountType === 'PERCENTAGE' ? '(%)' : '(₫)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-0.5 font-medium">Đơn hàng tối thiểu (₫)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.minOrderAmount || ''}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="block mb-0.5 font-medium">Giảm tối đa (₫)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Không giới hạn"
                      value={formData.maxDiscountAmount || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined
                        })
                      }
                      className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block mb-0.5 font-medium">Số lượt sử dụng tối đa</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="100"
                    value={formData.usageLimit || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: e.target.value ? Number(e.target.value) : undefined
                      })
                    }
                    className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-0.5 font-medium">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full h-7 px-2 border border-[#ccc] bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-0.5 font-medium">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full h-7 px-2 border border-[#ccc] bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee] flex justify-end gap-1.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-white border border-[#ccc] hover:bg-[#e6e6e6] text-[#333] cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-1 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Đang tạo...' : 'Lưu mã giảm giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
