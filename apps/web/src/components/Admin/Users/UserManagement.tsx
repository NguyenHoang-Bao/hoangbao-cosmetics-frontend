import { useState, useEffect } from 'react';

export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'OFFLINE_STAFF' | 'WAREHOUSE_MANAGER' | 'REMOTE_CSKH';
  roleName: string;
  active: boolean;
  createdAt: string;
}

const STORAGE_USERS_KEY = 'hb_admin_users_list_v2';

const defaultUsers: AdminUser[] = [
  {
    id: 1,
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
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'OFFLINE_STAFF' as AdminUser['role']
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        setUsers(JSON.parse(stored));
        return;
      }
    } catch {}
    setUsers(defaultUsers);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
  }, []);

  const saveUsers = (list: AdminUser[]) => {
    setUsers(list);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(list));
  };

  const handleToggleActive = (id: string | number) => {
    const updated = users.map((u) => (u.id === id ? { ...u, active: !u.active } : u));
    saveUsers(updated);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const roleNameMap: Record<AdminUser['role'], string> = {
      ADMIN: 'Quản trị viên cấp cao',
      OFFLINE_STAFF: 'Nhân viên Thu ngân (App POS)',
      WAREHOUSE_MANAGER: 'Quản lý Kho & Đóng gói (App Kho)',
      REMOTE_CSKH: 'CTV CSKH & Xử lý khiếu nại tại nhà'
    };

    const created: AdminUser = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      roleName: roleNameMap[newUser.role],
      active: true,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    const updated = [...users, created];
    saveUsers(updated);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', phone: '', role: 'OFFLINE_STAFF' });
  };

  return (
    <div className="space-y-2 text-xs text-[#333] font-sans">
      <div className="bg-white p-2 border border-[#ccc] flex items-center justify-between">
        <div>
          <span className="font-bold text-xs">Danh sách nhân viên & phân quyền</span>
          <span className="text-[#777] ml-2 text-[11px]">(Đặc quyền Admin)</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2.5 py-1 bg-[#f4f4f4] hover:bg-[#e6e6e6] border border-[#ccc] text-[#333] cursor-pointer"
        >
          + Thêm tài khoản
        </button>
      </div>

      <div className="bg-white border border-[#ccc]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#fff] border-b border-[#ccc] text-[#333]">
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Họ và tên</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Email & SĐT</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Vai trò</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Ngày tạo</th>
              <th className="py-2 px-2.5 font-normal text-center border-r border-[#eee]">Trạng thái</th>
              <th className="py-2 px-2.5 font-normal text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#f9f9f9]">
                <td className="py-2 px-2.5 font-medium border-r border-[#eee]">{u.name}</td>
                <td className="py-2 px-2.5 border-r border-[#eee] text-[#555]">
                  <div>{u.email}</div>
                  <div className="text-[11px] text-[#777]">{u.phone}</div>
                </td>
                <td className="py-2 px-2.5 border-r border-[#eee]">
                  <span className="font-medium">{u.roleName}</span>
                </td>
                <td className="py-2 px-2.5 text-[#666] border-r border-[#eee]">{u.createdAt}</td>
                <td className="py-2 px-2.5 text-center border-r border-[#eee]">
                  <span className={u.active ? 'text-[#3c763d]' : 'text-[#a94442]'}>
                    {u.active ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="py-2 px-2.5 text-right">
                  <button
                    onClick={() => handleToggleActive(u.id)}
                    className="text-[#337ab7] hover:underline cursor-pointer"
                  >
                    {u.active ? 'Khóa' : 'Mở khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md border border-[#999] shadow-lg">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs">Thêm tài khoản nhân viên</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-3 space-y-2.5 text-xs text-[#333]">
              <div>
                <label className="block mb-0.5 font-medium">Họ và tên *</label>
                <input
                  type="text"
                  required
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
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Số điện thoại</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5 font-medium">Vai trò *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser['role'] })}
                  className="w-full h-7 px-1.5 border border-[#ccc] bg-white text-xs cursor-pointer"
                >
                  <option value="ADMIN">Quản trị viên cấp cao (Admin)</option>
                  <option value="OFFLINE_STAFF">Nhân viên Thu ngân (App POS)</option>
                  <option value="WAREHOUSE_MANAGER">Quản lý Kho & Đóng gói (App Kho)</option>
                  <option value="REMOTE_CSKH">CTV CSKH & Xử lý khiếu nại tại nhà (Nhận ca lỗi từ AI)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#eee] flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-white border border-[#ccc] hover:bg-[#e6e6e6] text-[#333] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
