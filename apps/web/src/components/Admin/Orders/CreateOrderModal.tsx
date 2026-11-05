import { useState } from 'react';
import type { OrderType } from './OrderManagement';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: OrderType) => void;
  availableProducts?: Array<{ id: string | number; name: string; price: number; image?: string }>;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
  availableProducts = []
}: CreateOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Thu tiền tận nơi - COD');
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string | number; name: string; price: number; quantity: number }>>([
    {
      id: availableProducts[0]?.id || 1,
      name: availableProducts[0]?.name || 'Serum Phục Hồi B5 Hoàng Bảo',
      price: availableProducts[0]?.price || 450000,
      quantity: 1
    }
  ]);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleAddItem = () => {
    const prod = availableProducts[0] || { id: Date.now(), name: 'Sản phẩm mới', price: 100000 };
    setSelectedItems([
      ...selectedItems,
      { id: prod.id, name: prod.name, price: prod.price, quantity: 1 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: string | number) => {
    const found = availableProducts.find((p) => String(p.id) === String(productId));
    if (found) {
      const copy = [...selectedItems];
      copy[index] = {
        ...copy[index],
        id: found.id,
        name: found.name,
        price: found.price
      };
      setSelectedItems(copy);
    }
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const copy = [...selectedItems];
    copy[index].quantity = Math.max(1, qty);
    setSelectedItems(copy);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ!');
      return;
    }
    if (selectedItems.length === 0) {
      alert('Đơn hàng phải có ít nhất 1 sản phẩm!');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `#ORDER00${randomNum}`;

    const newOrder: OrderType = {
      id: newOrderId,
      date: `${dateStr} ${timeStr}`,
      source: 'ADMIN_MANUAL',
      channelName: 'Admin Tạo Hộ',
      customerName: customerName.trim(),
      phone: phone.trim(),
      shippingAddress: address.trim(),
      paymentMethod,
      total: totalAmount,
      status: 'processing',
      statusText: 'Đã chuyển Kho đóng gói',
      paymentStatus: paymentMethod.includes('COD') ? 'unpaid' : 'paid',
      codStatus: paymentMethod.includes('COD') ? 'pending_cod_transfer' : 'store_collected',
      codStatusText: paymentMethod.includes('COD') ? 'Bưu điện đang giữ COD' : 'Đã thanh toán',
      items: selectedItems.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity
      })),
      note
    };

    onOrderCreated(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans text-xs text-[#333]">
      <div className="bg-white w-full max-w-lg border border-[#999] shadow-lg">
        {/* Header */}
        <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
          <h3 className="font-bold text-xs">Tạo đơn hàng mới</h3>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-3 space-y-3 max-h-[80vh] overflow-y-auto">
          {/* Thông tin khách */}
          <div className="space-y-1.5">
            <p className="font-bold border-b border-[#eee] pb-0.5">1. Thông tin người nhận:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-0.5">Họ tên *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-0.5">Điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-0.5">Địa chỉ nhận hàng *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-7 px-2 border border-[#ccc] bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Chọn sản phẩm */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-[#eee] pb-0.5">
              <span className="font-bold">2. Mặt hàng đã mua:</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[#337ab7] hover:underline cursor-pointer"
              >
                + Thêm dòng
              </button>
            </div>

            <div className="space-y-1">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <select
                    value={item.id}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="flex-1 h-7 px-1.5 border border-[#ccc] bg-white text-xs"
                  >
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.price.toLocaleString('vi-VN')} đ)
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    className="w-14 h-7 px-1 text-center border border-[#ccc] bg-white"
                  />

                  <div className="w-20 text-right font-medium">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </div>

                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-[#d9534f] hover:underline px-1 cursor-pointer"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="p-1.5 bg-[#f9f9f9] border border-[#eee] flex justify-between font-bold">
              <span>Tổng tiền:</span>
              <span className="text-[#b94a48]">{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-0.5">Thanh toán:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-7 px-1.5 border border-[#ccc] bg-white text-xs"
              >
                <option value="Thu tiền tận nơi - COD">Thu tiền tận nơi - COD</option>
                <option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</option>
              </select>
            </div>

            <div>
              <label className="block mb-0.5">Ghi chú:</label>
              <input
                type="text"
                placeholder="Ghi chú giao hàng..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-7 px-2 border border-[#ccc] bg-white text-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 border-t border-[#eee] flex justify-end gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-white border border-[#ccc] hover:bg-[#e6e6e6] text-[#333] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3.5 py-1 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer"
            >
              Lưu đơn hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
