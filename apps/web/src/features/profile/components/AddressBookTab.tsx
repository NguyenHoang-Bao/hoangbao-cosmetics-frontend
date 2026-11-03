import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Edit3, X, Home, Briefcase } from 'lucide-react';
import type { UserAddress, UserProfile } from '@hoangbao/types';
import { addressService } from '../services/addressService';

interface AddressBookTabProps {
  profile: UserProfile;
}

export const AddressBookTab: React.FC<AddressBookTabProps> = ({ profile }) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: 'TP. Hồ Chí Minh',
    district: '',
    ward: '',
    address: '',
    label: 'Nhà riêng' as 'Nhà riêng' | 'Văn phòng',
    isDefault: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      const list = addressService.initSampleAddressesIfEmpty(profile);
      setAddresses(list);
    }
  }, [profile]);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: profile.fullName || '',
      phone: profile.phoneNumber || '',
      province: 'TP. Hồ Chí Minh',
      district: '',
      ward: '',
      address: '',
      label: 'Nhà riêng',
      isDefault: addresses.length === 0,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: UserAddress) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      province: addr.province || 'TP. Hồ Chí Minh',
      district: addr.district || '',
      ward: addr.ward || '',
      address: addr.address || '',
      label: addr.label || 'Nhà riêng',
      isDefault: Boolean(addr.isDefault),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      addressService.deleteAddress(profile, id);
      setAddresses(addressService.getAddresses(profile));
    }
  };

  const handleSetDefault = (id: string) => {
    addressService.setDefault(profile, id);
    setAddresses(addressService.getAddresses(profile));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên người nhận.';
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09).';
    }
    if (!formData.province.trim()) errors.province = 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố.';
    if (!formData.district.trim()) errors.district = 'Vui lòng nhập Quận/Huyện.';
    if (!formData.ward.trim()) errors.ward = 'Vui lòng nhập Phường/Xã.';
    if (!formData.address.trim()) errors.address = 'Vui lòng nhập số nhà, tên đường cụ thể.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAddress) {
      addressService.updateAddress(profile, {
        ...editingAddress,
        ...formData,
      });
    } else {
      addressService.addAddress(profile, formData);
    }

    setAddresses(addressService.getAddresses(profile));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Sổ địa chỉ nhận hàng</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Quản lý các địa chỉ nhận hàng để thanh toán nhanh hơn</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      {/* Danh sách địa chỉ */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <MapPin size={36} className="mx-auto text-neutral-300 mb-2" />
          <p className="text-sm font-semibold text-neutral-600">Bạn chưa có địa chỉ nhận hàng nào</p>
          <p className="text-xs text-neutral-400 mt-1">Hãy thêm địa chỉ để thuận tiện giao hàng khi mua mỹ phẩm.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {addresses.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.isDefault
                  ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900">{item.fullName}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-xs font-medium text-neutral-600">{item.phone}</span>
                    {item.label && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {item.label === 'Nhà riêng' ? <Home size={12} /> : <Briefcase size={12} />}
                        {item.label}
                      </span>
                    )}
                    {item.isDefault && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        Mặc định
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.address}, {item.ward}, {item.district}, {item.province}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    title="Chỉnh sửa địa chỉ"
                  >
                    <Edit3 size={16} />
                  </button>

                  {!item.isDefault && (
                    <>
                      <button
                        onClick={() => handleDeleteAddress(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa địa chỉ"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => handleSetDefault(item.id)}
                        className="px-2.5 py-1 text-xs font-medium text-neutral-600 border border-neutral-200 hover:border-neutral-400 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Đặt làm mặc định
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm / Chỉnh sửa Địa chỉ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h4 className="text-base font-bold text-neutral-900">
                {editingAddress ? 'Cập nhật địa chỉ nhận hàng' : 'Thêm địa chỉ nhận hàng mới'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.fullName && <p className="text-[11px] text-rose-500 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0359490221"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tỉnh / TP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.province && <p className="text-[11px] text-rose-500 mt-1">{formErrors.province}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Quận / Huyện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Quận Tân Phú"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.district && <p className="text-[11px] text-rose-500 mt-1">{formErrors.district}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phường / Xã <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Phường Tây Thạnh"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
                  />
                  {formErrors.ward && <p className="text-[11px] text-rose-500 mt-1">{formErrors.ward}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="140 Lê Trọng Tấn"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
                />
                {formErrors.address && <p className="text-[11px] text-rose-500 mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Loại địa chỉ</label>
                <div className="flex items-center gap-3">
                  {(['Nhà riêng', 'Văn phòng'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: l })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                        formData.label === l
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {l === 'Nhà riêng' ? <Home size={14} /> : <Briefcase size={14} />}
                      <span>{l}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                  />
                  <span className="text-xs text-neutral-700 font-medium">Đặt làm địa chỉ nhận hàng mặc định</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
