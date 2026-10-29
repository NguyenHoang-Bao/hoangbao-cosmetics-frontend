import React, { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  QrCode,
  Truck,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const OrderSuccessPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const [searchParams] = useSearchParams();

  const paymentMethod = searchParams.get("payment") || "COD";
  const amount = Number(searchParams.get("amount")) || 0;
  const customerName = searchParams.get("name") || "Quý khách";
  const phoneNumber = searchParams.get("phone") || "";

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankInfo = {
    bankName: "Ngân hàng Quân Đội (MBBank)",
    accountNo: "14580886868",
    accountName: "NGUYEN HOANG BAO",
    content: `${orderCode || "HOANGBAO"}`,
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Link ảnh VietQR tự động
  const vietQrUrl = `https://img.vietqr.io/image/MBBank-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    bankInfo.content,
  )}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        {/* Icon thành công */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-500 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Đặt Hàng Thành Công
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-3 mb-2">
          Cảm ơn {customerName}!
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
          Đơn hàng của bạn đã được tiếp nhận và đang được đóng gói. Mã đơn hàng của bạn là{" "}
          <strong className="text-neutral-900 font-bold">{orderCode}</strong>.
        </p>

        {/* ── NẾU CHỌN THANH TOÁN VIETQR NGÂN HÀNG ── */}
        {paymentMethod === "BANK_TRANSFER" && (
          <div className="my-8 p-6 bg-rose-50/40 border border-rose-200 rounded-2xl text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-rose-200">
              <QrCode className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
                Thông Tin Chuyển Khoản Qua VietQR
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Ảnh Mã QR */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
                <img
                  src={vietQrUrl}
                  alt="Mã VietQR Thanh Toán"
                  className="w-full max-w-[240px] aspect-square object-contain"
                />
                <p className="text-[11px] text-neutral-500 mt-2 text-center">
                  Quét mã qua mọi App Ngân hàng hoặc Ví điện tử
                </p>
              </div>

              {/* Chi tiết tài khoản ngân hàng */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Ngân hàng:</span>
                  <strong className="text-neutral-900 text-sm">{bankInfo.bankName}</strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Số tài khoản:</span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 mt-0.5">
                    <span className="font-mono font-bold text-base text-rose-600">
                      {bankInfo.accountNo}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankInfo.accountNo, "acc")}
                      className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === "acc" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Chủ tài khoản:</span>
                  <strong className="text-neutral-900">{bankInfo.accountName}</strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Số tiền thanh toán:</span>
                  <strong className="text-rose-600 text-base font-extrabold">
                    {formatCurrency(amount)}
                  </strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Nội dung chuyển khoản:</span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 mt-0.5">
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {bankInfo.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankInfo.content, "content")}
                      className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {copiedField === "content" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── NẾU CHỌN THANH TOÁN TIỀN MẶT COD ── */}
        {paymentMethod === "COD" && (
          <div className="my-8 p-5 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">
                Thanh toán tiền mặt khi nhận hàng (COD)
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Tổng số tiền cần thanh toán cho shipper là{" "}
                <strong className="text-rose-600 font-bold">{formatCurrency(amount)}</strong>. Quý khách vui lòng để ý điện thoại {phoneNumber} để nhận hàng sớm nhất.
              </p>
            </div>
          </div>
        )}

        {/* Cam kết giao hàng */}
        <div className="border-t border-neutral-100 pt-6 mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Bảo đảm 100% hàng chính hãng
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-rose-600" />
            Hotline hỗ trợ: 0359 490 221
          </span>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tiếp Tục Mua Sắm</span>
          </Link>
          <Link
            to="/my-orders"
            className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Tra Cứu Đơn Hàng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
