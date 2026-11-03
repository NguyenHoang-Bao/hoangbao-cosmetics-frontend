import React, { useState, useEffect, useRef } from "react";
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
  Clock,
  Sparkles,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { orderApi, type PaymentQrResponse } from "../api/orderApi";

export const OrderSuccessPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const [searchParams] = useSearchParams();

  const paymentMethod = searchParams.get("payment") || "COD";
  const amount = Number(searchParams.get("amount")) || 0;
  const customerName = searchParams.get("name") || "Quý khách";
  const phoneNumber = searchParams.get("phone") || "";

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [vietQrData, setVietQrData] = useState<PaymentQrResponse | null>(null);
  const [isPaidConfirmed, setIsPaidConfirmed] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [pollingCountdown, setPollingCountdown] = useState<number>(600); // 10 phut dem nguoc

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Thong tin ngan hang du phong (neu API gap su co ket noi)
  const fallbackBankInfo = {
    bankName: "Ngân hàng Quân Đội (MBBank)",
    accountNo: "14580886868",
    accountName: "NGUYEN HOANG BAO",
    content: `${orderCode || "HOANGBAO"}`,
    qrUrl: `https://img.vietqr.io/image/MBBank-14580886868-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
      orderCode || "HOANGBAO",
    )}&accountName=${encodeURIComponent("NGUYEN HOANG BAO")}`,
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 1. Goi API lay ma VietQR dong tu backend
  useEffect(() => {
    if ((paymentMethod === "BANK_TRANSFER" || paymentMethod === "VIETQR") && orderCode) {
      orderApi
        .getVietQr(orderCode)
        .then((data) => {
          setVietQrData(data);
        })
        .catch((err) => {
          console.warn("[VietQR] Khong the lay du lieu VietQR dong tu backend, dung fallback:", err);
        });
    }
  }, [orderCode, paymentMethod]);

  // 2. Polling tu dong kiem tra trang thai thanh toan SePay moi 3 giay
  useEffect(() => {
    if ((paymentMethod === "BANK_TRANSFER" || paymentMethod === "VIETQR") && orderCode && !isPaidConfirmed) {
      const checkStatus = async () => {
        try {
          setIsCheckingStatus(true);
          const res = await orderApi.checkPaymentStatus(orderCode);
          if (res && (res.isPaid || res.status === "PROCESSING" || res.status === "SHIPPING" || res.status === "DELIVERED")) {
            setIsPaidConfirmed(true);
            if (res.transactionId) setTransactionId(res.transactionId);
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        } catch {
          // Bo qua loi tam thoi cua polling
        } finally {
          setIsCheckingStatus(false);
        }
      };

      // Kiem tra ngay lap tuc
      checkStatus();

      // Lap lai moi 3 giay
      pollingRef.current = setInterval(checkStatus, 3000);

      // Dem nguoc thoi gian cho thanh toan
      const countdownTimer = setInterval(() => {
        setPollingCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            if (pollingRef.current) clearInterval(pollingRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        clearInterval(countdownTimer);
      };
    }
  }, [orderCode, paymentMethod, isPaidConfirmed]);

  const qrImageUrl = vietQrData?.qrCodeUrl || fallbackBankInfo.qrUrl;
  const accountNumber = vietQrData?.accountNumber || fallbackBankInfo.accountNo;
  const accountName = vietQrData?.accountName || fallbackBankInfo.accountName;
  const bankName = vietQrData?.bankId ? `${vietQrData.bankId} (MBBank)` : fallbackBankInfo.bankName;
  const transferContent = vietQrData?.content || fallbackBankInfo.content;
  const displayAmount = vietQrData?.totalAmount || amount;

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        {/* Icon thanh cong */}
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

        {/* ── THONG BAO TRANG THAI THANH TOAN SEPAY DA XAC NHAN ── */}
        {isPaidConfirmed && (
          <div className="my-6 p-5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-left flex items-start gap-4 animate-in fade-in zoom-in duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-emerald-900 font-bold text-sm sm:text-base flex items-center gap-2">
                <span>Thanh Toán Thành Công Qua SePay!</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Đã Khớp Lệnh
                </span>
              </h4>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                Hệ thống ngân hàng SePay đã tự động nhận diện và xác nhận số tiền chuyển khoản cho đơn hàng{" "}
                <strong>{orderCode}</strong>. Đơn hàng đang được bộ phận kho chuẩn bị đóng gói!
              </p>
              {transactionId && (
                <p className="text-[11px] text-emerald-600 font-mono mt-1">
                  Mã giao dịch SePay: <strong>{transactionId}</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── NẾU CHỌN THANH TOÁN VIETQR NGÂN HÀNG (CHƯA XÁC NHẬN) ── */}
        {(paymentMethod === "BANK_TRANSFER" || paymentMethod === "VIETQR") && !isPaidConfirmed && (
          <div className="my-8 p-6 bg-rose-50/40 border border-rose-200 rounded-2xl text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-rose-200">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
                  Thông Tin Chuyển Khoản Qua VietQR
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                <span>Thời gian thanh toán còn lại: <strong>{formatCountdown(pollingCountdown)}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Ảnh Mã QR */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-rose-200 shadow-2xs">
                <img
                  src={qrImageUrl}
                  alt="Mã VietQR Thanh Toán"
                  className="w-full max-w-[240px] aspect-square object-contain"
                  loading="lazy"
                />
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-3 text-center">
                  <RefreshCw className={`w-3 h-3 text-rose-500 ${isCheckingStatus ? "animate-spin" : ""}`} />
                  <span>Hệ thống tự động duyệt đơn khi nhận tiền</span>
                </div>
              </div>

              {/* Chi tiết tài khoản ngân hàng */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Ngân hàng:</span>
                  <strong className="text-neutral-900 text-sm">{bankName}</strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Số tài khoản:</span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 mt-0.5">
                    <span className="font-mono font-bold text-base text-rose-600">
                      {accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(accountNumber, "acc")}
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
                  <strong className="text-neutral-900">{accountName}</strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Số tiền thanh toán:</span>
                  <strong className="text-rose-600 text-base font-extrabold">
                    {formatCurrency(displayAmount)}
                  </strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Nội dung chuyển khoản (bắt buộc):</span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200 mt-0.5">
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {transferContent}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(transferContent, "content")}
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

        {/* ── NẾU CHỌN THANH TOÁN VÍ MOMO ── */}
        {paymentMethod === "MOMO" && (
          <div className="my-8 p-5 bg-pink-50/50 border border-pink-200 rounded-2xl flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-pink-900 text-sm">
                Thanh toán Ví Điện Tử MoMo
              </h4>
              <p className="text-xs text-pink-700 mt-0.5">
                Đơn hàng trị giá <strong className="font-bold">{formatCurrency(amount)}</strong> đã được ghi nhận. Quý khách có thể chuyển số tiền này qua số MoMo cửa hàng: <strong>0359 490 221</strong> (NGUYEN HOANG BAO) với nội dung: <strong>{orderCode}</strong>.
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
            to={`/order-tracking?orderCode=${encodeURIComponent(orderCode || "")}&phone=${encodeURIComponent(phoneNumber || "")}`}
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
