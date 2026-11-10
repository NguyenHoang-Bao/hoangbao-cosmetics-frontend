import { useState, useEffect } from 'react';
import { adminService, type AdminStaffUser } from '../../../services/adminService';

export type AdminUser = AdminStaffUser;

const STORAGE_USERS_KEY = 'hb_admin_users_list_v2';

const defaultUsers: AdminStaffUser[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Nguyễn Hoàng Bảo',
    email: 'hbao4142@gmail.com',
    phone: '0359490221',
    role: 'ADMIN',
    roleName: 'Quản trị viên cấp cao',
    active: true,
    createdAt: '01/01/2026'
  },
  {
    id: 2,
    username: 'pos_tanphu',
    name: 'Trần Thị Thu Ngân (POS Quầy)',
    email: 'pos.tanphu@hoangbao.vn',
    phone: '0901234567',
    role: 'OFFLINE_STAFF',
    roleName: 'Nhân viên Thu ngân (App POS)',
    active: true,
    createdAt: '10/01/2026'
  },
  {
    id: 3,
    username: 'kho_tanphu',
    name: 'Lê Văn Kho (Thủ kho)',
    email: 'kho.tanphu@hoangbao.vn',
    phone: '0912345678',
    role: 'WAREHOUSE_MANAGER',
    roleName: 'Quản lý Kho & Đóng gói (App Kho)',
    active: true,
    createdAt: '15/01/2026'
  },
  {
    id: 4,
    username: 'cskh_mai',
    name: 'Nguyễn Thị Mai (CSKH Tại Nhà)',
    email: 'cskh.mai@hoangbao.vn',
    phone: '0987654321',
    role: 'REMOTE_CSKH',
    roleName: 'CTV CSKH & Xử lý khiếu nại tại nhà (Nhận ca lỗi từ AI)',
    active: true,
    createdAt: '20/01/2026'
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<AdminStaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal tạo nhân sự
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'OFFLINE_STAFF',
    password: ''
  });

  // Modal Reset Password
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<AdminStaffUser | null>(null);
  const [newPassword, setNewPassword] = useState('HoangBao@123');

  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminUsers({
        keyword: keyword.trim() || undefined,
        role: roleFilter || undefined
      });
      if (data && data.length > 0) {
        setUsers(data);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(data));
      } else if (!keyword && !roleFilter) {
        const stored = localStorage.getItem(STORAGE_USERS_KEY);
        if (stored) {
          setUsers(JSON.parse(stored));
        } else {
          setUsers(defaultUsers);
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
        }
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      console.warn('[UserManagement] Không thể tải từ API, sử dụng dữ liệu cục bộ:', err);
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      setUsers(stored ? JSON.parse(stored) : defaultUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleActive = async (u: AdminStaffUser) => {
    if (u.role === 'ADMIN' && (String(u.id) === '1' || u.username === 'admin')) {
      setStatusMessage({ type: 'error', text: 'Không thể vô hiệu hóa tài khoản Quản trị viên cấp cao (Root Admin)!' });
      return;
    }

    const actionText = u.active ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${u.name}"?`)) {
      return;
    }

    try {
      const updated = await adminService.toggleUserStatus(u.id);
      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, active: updated.active } : item)));
      setStatusMessage({ type: 'success', text: `Đã ${actionText} tài khoản "${u.name}" thành công!` });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const created = await adminService.createStaffUser({
        username: newUser.username.trim() || newUser.email.split('@')[0],
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        phone: newUser.phone.trim() || undefined,
        role: newUser.role,
        password: newUser.password.trim() || 'HoangBao@123'
      });

      setUsers((prev) => [created, ...prev]);
      setIsModalOpen(false);
      const defaultPass = newUser.password.trim() || 'HoangBao@123';
      setNewUser({ username: '', name: '', email: '', phone: '', role: 'OFFLINE_STAFF', password: '' });
      setStatusMessage({
        type: 'success',
        text: `Tạo tài khoản nhân sự "${created.name}" thành công! Mật khẩu khởi tạo: ${defaultPass}`
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi khi tạo tài khoản nhân sự';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenResetModal = (u: AdminStaffUser) => {
    setSelectedUserForReset(u);
    setNewPassword('HoangBao@123');
    setIsResetModalOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset) return;

    setSubmitting(true);
    try {
      await adminService.resetUserPassword(selectedUserForReset.id, newPassword.trim() || 'HoangBao@123');
      setStatusMessage({
        type: 'success',
        text: `Đã đặt lại mật khẩu cho "${selectedUserForReset.name}" thành công! Mật khẩu mới: ${newPassword.trim() || 'HoangBao@123'}`
      });
      setIsResetModalOpen(false);
      setSelectedUserForReset(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi khi đặt lại mật khẩu';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2 text-xs text-[#333] font-sans">
      {/* Alert Banner */}
      {statusMessage && (
        <div
          className={`p-2.5 border text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold px-1 hover:opacity-75 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Top Filter & Action Bar */}
      <div className="bg-white p-2.5 border border-[#ccc] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs">Danh sách nhân viên & phân quyền</span>
          <span className="text-[#777] text-[11px]">(Đặc quyền Admin)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bộ lọc vai trò */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-7 px-2 border border-[#ccc] bg-white text-xs cursor-pointer focus:outline-none"
          >
            <option value="">-- Tất cả vai trò --</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
            <option value="STAFF">Thu ngân (POS)</option>
            <option value="WAREHOUSE_MANAGER">Quản lý kho</option>
            <option value="ONLINE_STAFF">CSKH trực tuyến</option>
          </select>

          {/* Tìm kiếm */}
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-7 px-2 border border-[#ccc] border-r-0 bg-white text-xs focus:outline-none w-48"
            />
            <button
              type="submit"
              className="h-7 px-2.5 bg-[#f4f4f4] hover:bg-[#e6e6e6] border border-[#ccc] text-[#333] cursor-pointer"
            >
              Tìm
            </button>
          </form>

          <button
            onClick={() => setIsModalOpen(true)}
            className="h-7 px-3 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer"
          >
            + Thêm nhân sự
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white border border-[#ccc] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#ccc] text-[#333]">
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Họ và tên</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Username</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Email & SĐT</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Vai trò</th>
              <th className="py-2 px-2.5 font-semibold border-r border-[#eee]">Ngày tạo</th>
              <th className="py-2 px-2.5 font-semibold text-center border-r border-[#eee]">Trạng thái</th>
              <th className="py-2 px-2.5 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500 italic">
                  Đang tải danh sách nhân sự...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400 italic">
                  Không tìm thấy nhân viên nào phù hợp.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isRootAdmin = u.role === 'ADMIN' && (String(u.id) === '1' || u.username === 'admin');
                return (
                  <tr key={u.id} className="hover:bg-[#fcfcfc]">
                    <td className="py-2 px-2.5 font-medium border-r border-[#eee]">{u.name}</td>
                    <td className="py-2 px-2.5 text-gray-600 border-r border-[#eee] font-mono text-[11px]">
                      {u.username || '—'}
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee] text-[#555]">
                      <div>{u.email}</div>
                      {u.phone && <div className="text-[11px] text-[#777]">{u.phone}</div>}
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#eee]">
                      <span className="font-medium text-[#222]">{u.roleName || u.role}</span>
                    </td>
                    <td className="py-2 px-2.5 text-[#666] border-r border-[#eee]">{u.createdAt}</td>
                    <td className="py-2 px-2.5 text-center border-r border-[#eee]">
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded ${
                          u.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.active ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      {!isRootAdmin ? (
                        <div className="flex items-center justify-end gap-2 text-[11px]">
                          <button
                            onClick={() => handleOpenResetModal(u)}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            Đặt lại MK
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleToggleActive(u)}
                            className={`cursor-pointer hover:underline font-medium ${
                              u.active ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {u.active ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Root Admin</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Thêm tài khoản nhân sự */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md border border-[#999] shadow-lg">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#222]">Thêm tài khoản nhân viên</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-3 space-y-2.5 text-xs text-[#333]">
              <div>
                <label className="block mb-0.5 font-medium">Tên đăng nhập (Username) *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: cskh_hoangbao"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Họ và tên nhân viên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Email đăng nhập *</label>
                <input
                  type="email"
                  required
                  placeholder="nhanvien@hoangbao.vn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Vai trò & Phân quyền *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full h-7 px-1.5 border border-[#ccc] bg-white text-xs cursor-pointer"
                >
                  <option value="ADMIN">Quản trị viên cấp cao (Admin)</option>
                  <option value="OFFLINE_STAFF">Nhân viên Thu ngân (App POS)</option>
                  <option value="WAREHOUSE_MANAGER">Quản lý Kho & Đóng gói (App Kho)</option>
                  <option value="REMOTE_CSKH">CTV CSKH & Xử lý khiếu nại tại nhà (Nhận ca lỗi từ AI)</option>
                </select>
              </div>

              <div>
                <label className="block mb-0.5 font-medium">
                  Mật khẩu khởi tạo <span className="text-gray-400 font-normal">(Mặc định: HoangBao@123)</span>
                </label>
                <input
                  type="text"
                  placeholder="HoangBao@123"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none font-mono"
                />
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
                  {submitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Đặt lại mật khẩu (Reset Password) */}
      {isResetModalOpen && selectedUserForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-sm border border-[#999] shadow-lg">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#222]">Đặt lại mật khẩu</h3>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-3 space-y-2.5 text-xs text-[#333]">
              <div className="bg-gray-50 p-2 border border-gray-200 text-[11px] space-y-1">
                <div>
                  <span className="text-gray-500">Nhân viên:</span>{' '}
                  <span className="font-semibold">{selectedUserForReset.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span> <span>{selectedUserForReset.email}</span>
                </div>
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Mật khẩu mới *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">Tối thiểu 6 ký tự. Hãy gửi mật khẩu này cho nhân sự.</p>
              </div>

              <div className="pt-2 border-t border-[#eee] flex justify-end gap-1.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-3 py-1 bg-white border border-[#ccc] hover:bg-[#e6e6e6] text-[#333] cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-1 bg-[#d9534f] hover:bg-[#c9302c] text-white font-medium cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
