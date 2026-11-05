import type { UserAddress } from '@hoangbao/types';

const STORAGE_PREFIX = 'user_addresses_';

export const addressService = {
  // Lấy key định danh user an toàn
  getUserKey: (user: any): string => {
    if (!user) return 'guest';
    return String(user.idUser || user.id || user.username || user.email || 'guest');
  },

  // Đọc danh sách địa chỉ của user từ localStorage
  getAddresses: (user: any): UserAddress[] => {
    if (!user) return [];
    const key = `${STORAGE_PREFIX}${addressService.getUserKey(user)}`;
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Lỗi khi đọc địa chỉ từ localStorage:', e);
    }
    return [];
  },

  // Lưu danh sách địa chỉ
  saveAddresses: (user: any, addresses: UserAddress[]): void => {
    if (!user) return;
    const key = `${STORAGE_PREFIX}${addressService.getUserKey(user)}`;
    try {
      localStorage.setItem(key, JSON.stringify(addresses));
    } catch (e) {
      console.error('Lỗi khi lưu địa chỉ vào localStorage:', e);
    }
  },

  // Lấy địa chỉ mặc định của user
  getDefaultAddress: (user: any): UserAddress | null => {
    if (!user) return null;
    const list = addressService.getAddresses(user);
    const def = list.find((a) => a.isDefault);
    return def || (list.length > 0 ? list[0] : null);
  },

  // Thêm địa chỉ mới
  addAddress: (user: any, data: Omit<UserAddress, 'id'>): UserAddress => {
    const list = addressService.getAddresses(user);
    const newId = `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const isFirst = list.length === 0;
    const shouldBeDefault = isFirst || Boolean(data.isDefault);

    const updatedList: UserAddress[] = list.map((item) => ({
      ...item,
      isDefault: shouldBeDefault ? false : Boolean(item.isDefault),
    }));

    const newAddress: UserAddress = {
      ...data,
      id: newId,
      isDefault: shouldBeDefault,
    };

    updatedList.unshift(newAddress);
    addressService.saveAddresses(user, updatedList);
    return newAddress;
  },

  // Cập nhật địa chỉ hiện có
  updateAddress: (user: any, updatedData: UserAddress): void => {
    const list = addressService.getAddresses(user);
    const updatedList = list.map((item) => {
      if (item.id === updatedData.id) {
        return updatedData;
      }
      if (updatedData.isDefault) {
        return { ...item, isDefault: false };
      }
      return item;
    });

    addressService.saveAddresses(user, updatedList);
  },

  // Xóa địa chỉ
  deleteAddress: (user: any, addressId: string): void => {
    const list = addressService.getAddresses(user);
    const updatedList = list.filter((item) => item.id !== addressId);

    // Nếu xóa trúng địa chỉ mặc định, chuyển địa chỉ đầu tiên còn lại làm mặc định
    if (updatedList.length > 0 && !updatedList.some((a) => a.isDefault)) {
      updatedList[0].isDefault = true;
    }

    addressService.saveAddresses(user, updatedList);
  },

  // Đặt làm mặc định
  setDefault: (user: any, addressId: string): void => {
    const list = addressService.getAddresses(user);
    const updatedList = list.map((item) => ({
      ...item,
      isDefault: item.id === addressId,
    }));
    addressService.saveAddresses(user, updatedList);
  },
};
