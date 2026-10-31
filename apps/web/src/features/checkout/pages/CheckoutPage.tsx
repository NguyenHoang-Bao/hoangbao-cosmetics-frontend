import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/features/cart/store/cartSlice";
import { formatCurrency, getProductImageUrl, DEFAULT_PRODUCT_IMAGE } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { orderApi, type CreateOrderPayload } from "../api/orderApi";

const AVAILABLE_VOUCHERS = [
  { code: "MEGA30K", discount: 30000, minOrder: 299000, desc: "Giảm 30K cho đơn từ 299K" },
  { code: "BEAUTY50K", discount: 50000, minOrder: 499000, desc: "Giảm 50K cho đơn từ 499K" },
  { code: "FREESHIP", discountType: "shipping", minOrder: 199000, desc: "Miễn phí vận chuyển từ 199K" },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  // Form State
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [province, setProvince] = useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [note, setNote] = useState("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER" | "MOMO">("COD");

  // Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [voucherError, setVoucherError] = useState("");

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Tính toán số tiền
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rawShippingFee = subtotal >= 299000 ? 0 : 30000;
  const shippingDiscount =
    appliedVoucher?.code === "FREESHIP" ? rawShippingFee : 0;
  const finalShippingFee = Math.max(0, rawShippingFee - shippingDiscount);
  const voucherDiscount =
    appliedVoucher && appliedVoucher.code !== "FREESHIP"
      ? appliedVoucher.discount
      : 0;
  const finalTotal = Math.max(0, subtotal + finalShippingFee - voucherDiscount);

  // Xử lý áp dụng voucher
  const handleApplyVoucher = (codeToApply?: string) => {
    const code = (codeToApply || voucherCode).trim().toUpperCase();
    setVoucherError("");

    const found = AVAILABLE_VOUCHERS.find((v) => v.code === code);
    if (!found) {
      setVoucherError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (subtotal < found.minOrder) {
      setVoucherError(
        `Đơn hàng chưa đạt mức tối thiểu ${formatCurrency(found.minOrder)} để dùng mã này.`,
      );
      return;
    }

    if (found.discountType === "shipping") {
      setAppliedVoucher({ code: found.code, discount: rawShippingFee });
    } else {
      setAppliedVoucher({ code: found.code, discount: found.discount || 0 });
    }
    setVoucherCode(code);
  };

  // Xử lý đặt hàng
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate form
    if (!customerName.trim()) {
      setFormError("Vui lòng nhập họ và tên người nhận hàng.");
      return;
    }
    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (!cleanPhone || !/^(0|\+84)[0-9]{9}$/.test(cleanPhone)) {
      setFormError("Vui lòng nhập số điện thoại hợp lệ (10 chữ số).");
      return;
    }
    if (!specificAddress.trim()) {
      setFormError("Vui lòng nhập địa chỉ chi tiết nhận hàng.");
      return;
    }

    try {
      setIsSubmitting(true);
      const fullDeliveryAddress = `${specificAddress.trim()}${district ? `, ${district}` : ""}, ${province}`;

      const invalidItem = items.find((item) => !item.variantId);
      if (invalidItem) {
        setFormError(`Sản phẩm "${invalidItem.name}" chưa chọn phân loại hợp lệ. Vui lòng kiểm tra lại giỏ hàng!`);
        setIsSubmitting(false);
        return;
      }

      const payload: CreateOrderPayload = {
        customerName: customerName.trim(),
        phoneNumber: cleanPhone,
        email: email.trim() || undefined,
        deliveryAddress: fullDeliveryAddress,
        paymentMethod: paymentMethod,
        note: note.trim() || undefined,
        items: items.map((item) => ({
          idVariant: item.variantId!,
          quantity: item.quantity,
        })),
      };

      const result = await orderApi.createOrder(payload);

      // Đặt hàng thành công -> Xóa giỏ hàng Redux
      dispatch(clearCart());

      // Chuyển hướng sang trang hoàn tất đơn hàng
      navigate(
        `/order-success/${result.orderCode}?payment=${paymentMethod}&amount=${finalTotal}&name=${encodeURIComponent(customerName)}&phone=${encodeURIComponent(cleanPhone)}`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TRƯỜNG HỢP: Giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-neutral-50 border border-neutral-200 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng để tiến hành thanh toán.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Khám phá sản phẩm ngay</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ── BREADCRUMB ── */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/" },
          { label: "Sản phẩm", link: "/products" },
          { label: "Thanh toán đơn hàng" },
        ]}
      />

      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-tight my-4">
        Thanh Toán Đơn Hàng
      </h1>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ══════════════════════════════════════════════════════════
              CỘT TRÁI (7 cols): THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KHỐI 1: THÔNG TIN NGƯỜI NHẬN HÀNG */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Thông Tin Giao Hàng
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Họ và tên người nhận <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0359xxxxxx"
                      className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email nhận thông báo đơn hàng
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                  />
                </div>

                {/* Tỉnh / Thành phố & Quận Huyện */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Tỉnh / Thành phố
                    </label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Hồ Chí Minh, Hà Nội..."
                      className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Quận / Huyện
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Quận Tân Phú, Quận 1..."
                      className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                    />
                  </div>
                </div>

                {/* Địa chỉ chi tiết */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Địa chỉ nhà cụ thể (Số nhà, tên đường, phường/xã) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    placeholder="140 Lê Trọng Tấn, Tây Thạnh"
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                  />
                </div>

                {/* Ghi chú đơn hàng */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Ghi chú giao hàng
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* KHỐI 2: PHƯƠNG THỨC VẬN CHUYỂN */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Phương Thức Vận Chuyển
              </h3>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Giao hàng tiêu chuẩn toàn quốc
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Nhận hàng dự kiến trong 1 - 3 ngày làm việc (Nội thành TP.HCM hỗ trợ giao 2h)
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-rose-600 shrink-0">
                  {rawShippingFee === 0 ? "Miễn phí" : formatCurrency(rawShippingFee)}
                </span>
              </div>
            </div>

            {/* KHỐI 3: PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Phương Thức Thanh Toán
              </h3>

              <div className="space-y-3">
                {/* 1. COD */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-rose-500 bg-rose-50/40 ring-1 ring-rose-300"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-4 h-4 text-rose-600 accent-rose-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-5 h-5 text-neutral-700" />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Nhận hàng, kiểm tra sản phẩm trước khi thanh toán tiền mặt cho shipper
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 2. CHUYỂN KHOẢN NGÂN HÀNG VIETQR */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-rose-500 bg-rose-50/40 ring-1 ring-rose-300"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      className="w-4 h-4 text-rose-600 accent-rose-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-2.5">
                      <QrCode className="w-5 h-5 text-rose-600" />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 block flex items-center gap-1.5">
                          <span>Chuyển khoản qua mã VietQR Ngân hàng</span>
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase">
                            Khuyên dùng
                          </span>
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Quét mã QR tự động điền số tài khoản và nội dung chuyển khoản qua mọi App ngân hàng
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 3. VÍ MOMO */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "MOMO"
                      ? "border-rose-500 bg-rose-50/40 ring-1 ring-rose-300"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MOMO"
                      checked={paymentMethod === "MOMO"}
                      onChange={() => setPaymentMethod("MOMO")}
                      className="w-4 h-4 text-rose-600 accent-rose-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-neutral-700" />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                          Thanh toán Ví điện tử MoMo
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Thanh toán an toàn, nhanh chóng qua ứng dụng Ví MoMo
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              CỘT PHẢI (5 cols): TÓM TẮT ĐƠN HÀNG & MÃ VOUCHER
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                Đơn Hàng ({items.length} món)
              </h3>

              {/* Danh sách món hàng */}
              <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 divide-y divide-neutral-100">
                {items.map((item) => {
                  const imgUrl = getProductImageUrl(item.image);
                  return (
                    <div
                      key={`${item.idProduct}-${item.variantId || "default"}`}
                      className="flex items-center gap-3 pt-3 first:pt-0"
                    >
                      <div className="w-14 h-16 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                        <img
                          src={imgUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_PRODUCT_IMAGE) {
                              target.src = DEFAULT_PRODUCT_IMAGE;
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
                          <span>
                            SL: <strong>x{item.quantity}</strong>
                          </span>
                          <span className="font-bold text-neutral-800">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Khối Nhập Mã Giảm Giá */}
              <div className="pt-4 mt-4 border-t border-neutral-200">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-rose-500" />
                  <span>Mã Voucher / Khuyến Mãi</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã (VD: MEGA30K)"
                    className="flex-1 px-3 py-2 text-xs uppercase font-semibold bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher()}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>

                {voucherError && (
                  <p className="text-[11px] text-red-500 mt-1.5">{voucherError}</p>
                )}
                {appliedVoucher && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã áp dụng mã {appliedVoucher.code} (-{formatCurrency(voucherDiscount || finalShippingFee)})
                  </p>
                )}

                {/* Gợi ý mã có sẵn */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {AVAILABLE_VOUCHERS.map((v) => (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => handleApplyVoucher(v.code)}
                      className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-dashed border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                      title={v.desc}
                    >
                      {v.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bảng Chi Phí Đơn Hàng */}
              <div className="pt-4 mt-4 border-t border-neutral-200 space-y-2 text-xs sm:text-sm text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Tiền hàng:</span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {rawShippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold">Miễn phí</span>
                    ) : (
                      formatCurrency(rawShippingFee)
                    )}
                  </span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex items-center justify-between text-rose-600 font-semibold">
                    <span>Giảm giá voucher:</span>
                    <span>-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                {shippingDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Miễn phí vận chuyển:</span>
                    <span>-{formatCurrency(shippingDiscount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900 uppercase">
                    Tổng thanh toán:
                  </span>
                  <span className="text-xl font-extrabold text-rose-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Nút Submit Đặt Hàng */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider text-sm transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{isSubmitting ? "Đang xử lý đơn hàng..." : "Xác Nhận Đặt Hàng"}</span>
              </button>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo mật thanh toán SSL 256-bit chuẩn quốc tế</span>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
