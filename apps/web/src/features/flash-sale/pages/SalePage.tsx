import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  Zap,
  Ticket,
  Copy,
  Check,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  ArrowDown,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import heroVideo from "@/assets/video/bannerSale.mp4";
import { flashSaleApi } from "../api/flashSaleApi";
import { couponApi } from "@/features/checkout/api/couponApi";
import { productApi } from "@/features/product/api/productApi";
import { useAppDispatch } from "@/store/hooks";
import { addToCart, openCart } from "@/features/cart/store/cartSlice";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";
import type { Product, FlashSaleItemResponse } from "@hoangbao/types";

// Danh sách mã giảm giá độc quyền
interface Voucher {
  code: string;
  discount: string;
  minOrder: string;
  desc: string;
  tag: string;
  tagColor: string;
  expires: string;
}

const VOUCHERS: readonly Voucher[] = [
  {
    code: "MEGA30K",
    discount: "30.000₫",
    minOrder: "Đơn từ 299K",
    desc: "Áp dụng toàn sàn mỹ phẩm",
    tag: "HOT DEAL",
    tagColor: "bg-pink-500 text-white",
    expires: "Còn 3 ngày",
  },
  {
    code: "BEAUTY50K",
    discount: "50.000₫",
    minOrder: "Đơn từ 499K",
    desc: "Cho combo skincare & serum",
    tag: "BÁN CHẠY",
    tagColor: "bg-rose-400 text-white",
    expires: "Còn 2 ngày",
  },
  {
    code: "VIP100K",
    discount: "100.000₫",
    minOrder: "Đơn từ 899K",
    desc: "Ưu đãi dành cho thành viên VIP",
    tag: "SIÊU TIẾT KIỆM",
    tagColor: "bg-fuchsia-500 text-white",
    expires: "Còn 1 ngày",
  },
  {
    code: "FREESHIP",
    discount: "FREESHIP",
    minOrder: "Đơn từ 199K",
    desc: "Miễn phí giao hàng toàn quốc",
    tag: "TOÀN QUỐC",
    tagColor: "bg-gradient-to-r from-pink-400 to-rose-400 text-white",
    expires: "Còn 3 ngày",
  },
];

// Danh mục lọc deal
const CATEGORY_TABS = [
  { id: "all", label: "🔥 Tất Cả Deal" },
  { id: "duong-am", label: "Dưỡng Ẩm & Phục Hồi" },
  { id: "cham-soc-da", label: "Chăm Sóc Da" },
  { id: "tre-em", label: "Dịu Nhẹ Trẻ Em" },
  { id: "combo", label: "Combo Tiết Kiệm" },
] as const;

export const SalePage: React.FC = () => {
  const dispatch = useAppDispatch();

  // 1. Lấy dữ liệu chiến dịch Flash Sale đang diễn ra từ Backend API
  const { data: activeCoupons = [] } = useQuery({
    queryKey: ["active-coupons-sale-page"],
    queryFn: couponApi.getActiveCoupons,
    staleTime: 1000 * 60 * 5,
  });

  const { data: flashSale, isLoading: isLoadingSale } = useQuery({
    queryKey: ["active-flash-sale-page"],
    queryFn: flashSaleApi.getActiveFlashSale,
    staleTime: 1000 * 60, // Cache 1 phút
  });

  const hasFlashSaleItems = Boolean(
    flashSale && flashSale.status === "ACTIVE" && flashSale.items && flashSale.items.length > 0
  );

  // 2. Query fallback danh sách sản phẩm giảm giá/nổi bật nếu chưa có campaign trong DB
  const { data: fallbackProductsData, isLoading: isLoadingFallback } = useQuery({
    queryKey: ["sale-page-fallback-products"],
    queryFn: () => productApi.getProducts({ size: 24, sortBy: "newest" }),
  });

  const isLoading = isLoadingSale || isLoadingFallback;

  // 3. Đồng hồ đếm ngược đồng bộ từ Server (Server-Authoritative Countdown)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    return (hasFlashSaleItems && typeof flashSale?.remainingSeconds === "number") ? flashSale.remainingSeconds : 0;
  });

  useEffect(() => {
    if (flashSale?.remainingSeconds !== undefined && flashSale.remainingSeconds > 0) {
      setRemainingSeconds(flashSale.remainingSeconds);
    }
  }, [flashSale?.remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const days = String(Math.floor(remainingSeconds / 86400)).padStart(2, "0");
  const hours = String(Math.floor((remainingSeconds % 86400) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  // 4. Tab lọc danh mục
  const [activeTab, setActiveTab] = useState<string>("all");

  // 5. Chuẩn bị danh sách sản phẩm Flash Sale Highlights
  const flashSaleHighlights: FlashSaleItemResponse[] = useMemo(() => {
    if (hasFlashSaleItems && flashSale?.items) {
      return flashSale.items.slice(0, 4);
    }
    // Fallback nếu chưa có campaign DB: biến đổi tạm từ fallback products
    const raw = fallbackProductsData?.content || [];
    return raw.slice(0, 4).map((p, index) => {
      const v = p.variants?.[0];
      const regularPrice = v?.price ?? 250000;
      const originalPrice = v?.originalPrice && v.originalPrice > regularPrice
        ? v.originalPrice
        : Math.round(regularPrice * (1.3 + (index % 4) * 0.1));
      const salePrice = Math.round(regularPrice * 0.7);
      const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
      const soldQuantity = 45 + (index * 17) % 150;
      const totalStock = soldQuantity + 10 + (index % 5);
      const soldPercentage = Math.min(95, Math.round((soldQuantity / totalStock) * 100));

      return {
        idItem: index + 1,
        idProduct: p.idProduct,
        productName: p.name,
        thumbnail: p.thumbnail,
        categoryName: p.category?.name,
        brandName: p.brand?.name,
        idVariant: v?.idVariant ?? 1,
        sku: v?.sku ?? `SKU-SALE-${p.idProduct}`,
        capacity: v?.capacity,
        originalPrice,
        regularPrice,
        salePrice,
        discountPercent,
        stockQuantity: totalStock,
        soldQuantity,
        soldPercentage,
        isSoldOut: false,
      };
    });
  }, [hasFlashSaleItems, flashSale?.items, fallbackProductsData?.content]);

  // 6. Lọc sản phẩm ở lưới ưu đãi chính
  const mainProducts = useMemo(() => {
    const raw = fallbackProductsData?.content || [];
    if (activeTab === "all") return raw;
    if (activeTab === "duong-am") {
      return raw.filter((p) =>
        p.name.toLowerCase().includes("ẩm") ||
        p.category?.name.toLowerCase().includes("ẩm") ||
        p.description?.toLowerCase().includes("ẩm")
      );
    }
    if (activeTab === "cham-soc-da") {
      return raw.filter((p) =>
        p.category?.name.toLowerCase().includes("chăm sóc") ||
        p.category?.name.toLowerCase().includes("da")
      );
    }
    if (activeTab === "tre-em") {
      return raw.filter((p) =>
        p.name.toLowerCase().includes("bé") ||
        p.category?.name.toLowerCase().includes("trẻ em") ||
        p.description?.toLowerCase().includes("dịu nhẹ")
      );
    }
    if (activeTab === "combo") {
      return raw.filter((p) => {
        const pr = p.variants?.[0]?.price ?? 0;
        return pr > 350000;
      });
    }
    return raw;
  }, [activeTab, fallbackProductsData?.content]);

  // 7. Xử lý copy mã giảm giá
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  // 8. Thêm sản phẩm Flash Sale vào giỏ
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddFlashSaleItemToCart = (item: FlashSaleItemResponse, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const syntheticProduct: Product = {
      idProduct: item.idProduct,
      name: item.productName,
      thumbnail: item.thumbnail || "",
      category: { idCategory: 0, name: item.categoryName || "" },
      brand: { idBrand: 0, name: item.brandName || "Mỹ phẩm chính hãng" },
      description: "",
      images: item.thumbnail ? [item.thumbnail] : [],
      variants: [
        {
          idVariant: item.idVariant,
          sku: item.sku,
          capacity: item.capacity,
          price: item.salePrice,
          originalPrice: item.originalPrice,
          stockQuantity: item.stockQuantity - item.soldQuantity,
        },
      ],
    };

    dispatch(
      addToCart({
        product: syntheticProduct,
        quantity: 1,
        openDrawer: true,
      })
    );
    setToastMessage(`Đã thêm "${item.productName}" vào giỏ hàng!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddProductToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch(
      addToCart({
        product,
        quantity: 1,
        openDrawer: true,
      })
    );
    setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="bg-rose-50/40 text-neutral-800 min-h-screen relative selection:bg-rose-500 selection:text-white font-sans">
      {/* ── 1. STICKY COUNTDOWN BAR (Chỉ hiển thị khi CÓ ĐỢT SALE THẬT ĐANG DIỄN RA) ── */}
      {hasFlashSaleItems && Number(remainingSeconds) > 0 && (
      <aside
        aria-label="Thanh đếm ngược sự kiện khuyến mãi"
        className="sticky top-[58px] sm:top-[68px] lg:top-[74px] z-40 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white shadow-md py-2 px-3 sm:px-6 backdrop-blur-md border-b border-rose-300/40"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
            </span>
            <span className="text-white uppercase flex items-center gap-1.5 font-extrabold text-[11px] sm:text-sm drop-shadow-sm">
              <Flame size={16} className="text-yellow-300 animate-bounce shrink-0" />
              ĐẠI TIỆC MEGA SALE - KẾT THÚC SAU:
            </span>
          </div>

          {/* Bộ đếm thời gian thực */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/40 text-center min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="font-extrabold text-sm sm:text-base text-white">{days}</span>
              <span className="block text-[9px] uppercase tracking-wider text-rose-100 font-sans">Ngày</span>
            </div>
            <span className="font-black text-white text-sm">:</span>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/40 text-center min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="font-extrabold text-sm sm:text-base text-white">{hours}</span>
              <span className="block text-[9px] uppercase tracking-wider text-rose-100 font-sans">Giờ</span>
            </div>
            <span className="font-black text-white text-sm">:</span>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/40 text-center min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="font-extrabold text-sm sm:text-base text-white">{minutes}</span>
              <span className="block text-[9px] uppercase tracking-wider text-rose-100 font-sans">Phút</span>
            </div>
            <span className="font-black text-white text-sm">:</span>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/40 text-center min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="font-extrabold text-sm sm:text-base text-yellow-300 animate-pulse">{seconds}</span>
              <span className="block text-[9px] uppercase tracking-wider text-rose-100 font-sans">Giây</span>
            </div>

            <button
              onClick={() => scrollToSection("flash-sale")}
              className="hidden md:inline-flex items-center gap-1 ml-3 px-4 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-rose-950 font-extrabold text-xs uppercase tracking-wider rounded-full transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              <Zap size={13} fill="currentColor" /> Săn Ngay
            </button>
          </div>
        </div>
      </aside>
      )}

      {/* ── 2. HERO BANNER SANG TRỌNG CÓ VIDEO NỀN ── */}
      <section className="relative min-h-[68vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden">
        {/* Video nền */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 filter blur-[1px]"
          poster="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80&auto=format&fit=crop"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Lớp overlay gradient Rose/Pink chuyển tiếp mượt mà */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/75 via-rose-900/55 to-rose-50/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.3)_0,transparent_70%)]"></div>

        {/* Nội dung trung tâm Hero */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <Breadcrumb
            items={[
              { label: "Trang chủ", link: "/" },
              { label: "Săn Sale Khủng" },
            ]}
            className="justify-center text-pink-100 mb-6 drop-shadow-md"
          />

{hasFlashSaleItems ? (
            <>
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-500/30 border border-rose-300/50 text-white text-xs sm:text-sm font-bold uppercase tracking-[2px] sm:tracking-[3px] mb-5 backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                ✨ SIÊU ĐẠI HỘI LÀM ĐẸP CHÍNH HÃNG
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none mb-4 drop-shadow-[0_4px_15px_rgba(190,24,93,0.7)]">
                MEGA BEAUTY <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-pink-300 via-white to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                  SALE UP TO 70%
                </span>
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-rose-50 max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-10 text-balance drop-shadow-md">
                Cơn lốc giảm giá nghìn deal sốc cho toàn bộ mỹ phẩm chính hãng, serum chuyên sâu và các dòng dưỡng ẩm phục hồi độc quyền. Đừng bỏ lỡ!
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-500/30 border border-rose-300/50 text-white text-xs sm:text-sm font-bold uppercase tracking-[2px] mb-5 backdrop-blur-md">
                ✨ ĐẠI TIỆC MỸ PHẨM CHÍNH HÃNG
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-4 drop-shadow-[0_4px_15px_rgba(190,24,93,0.7)]">
                CHƯA CÓ ĐỢT FLASH SALE <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-pink-300 via-white to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                  ĐANG DIỄN RA
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-rose-50 max-w-2xl mx-auto font-medium leading-relaxed mb-8 text-balance drop-shadow-md">
                Các đợt giảm giá chớp nhoáng với deal sốc sẽ được mở vào các khung giờ vàng đặc biệt. Bạn có thể tham khảo các dòng mỹ phẩm chính hãng giá tốt dưới đây nhé!
              </p>
            </>
          )}

          {/* Nút hành động nổi bật */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("flash-sale")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base sm:text-lg uppercase tracking-wider rounded-full shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:shadow-[0_0_40px_rgba(244,63,94,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer border border-rose-400"
            >
              <Flame size={22} className="animate-bounce text-yellow-300" />
              <span>SĂN SALE NGAY</span>
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection("vouchers-zone")}
              className="w-full sm:w-auto px-7 py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-full border border-rose-200/50 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Ticket size={18} />
              <span>Lấy Voucher 100K</span>
            </button>
          </div>

          {/* Cam kết thương hiệu */}
          <div className="mt-12 pt-8 border-t border-rose-200/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm text-white font-semibold max-w-4xl mx-auto drop-shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-yellow-300 shrink-0" />
              <span>100% Chính Hãng</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck size={18} className="text-yellow-300 shrink-0" />
              <span>Freeship Từ 199K</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RotateCcw size={18} className="text-yellow-300 shrink-0" />
              <span>Đổi Trả 7 Ngày</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Gift size={18} className="text-yellow-300 shrink-0" />
              <span>Quà Tặng Mọi Đơn</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. VOUCHERS & COUPONS ZONE (Vé viền răng cưa) ── */}
      <section id="vouchers-zone" className="py-14 sm:py-20 bg-white border-y border-rose-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 text-rose-600 font-extrabold uppercase text-xs tracking-widest mb-2 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200">
              <Ticket size={15} /> KHO VOUCHER ĐỘC QUYỀN
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-rose-950 uppercase tracking-tight">
              Lưu Mã Giảm Giá Liền Tay
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-3 max-w-lg mx-auto font-medium">
              Thu thập tất cả mã giảm giá bên dưới trước khi thanh toán để được áp dụng ưu đãi tối đa. Số lượng có hạn!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(activeCoupons.length > 0
              ? activeCoupons.map((c, idx) => ({
                  code: c.code,
                  discount: c.discountType === 'PERCENTAGE' ? ("Giảm " + c.discountValue + "%") : ("Giảm " + (Number(c.discountValue)/1000).toFixed(0) + "K"),
                  minOrder: c.minOrderAmount && Number(c.minOrderAmount) > 0 ? ("Đơn từ " + (Number(c.minOrderAmount)/1000).toFixed(0) + "K") : 'Mọi đơn hàng',
                  desc: c.description || 'Áp dụng khi thanh toán',
                  tag: idx === 0 ? 'BÁN CHẠY' : 'ƯU ĐÃI',
                  tagColor: idx === 0 ? 'bg-rose-400 text-white' : 'bg-pink-500 text-white',
                  expires: 'Đang áp dụng'
                }))
              : VOUCHERS
            ).map((voucher) => (
              <div
                key={voucher.code}
                className="relative bg-gradient-to-br from-white to-rose-50/50 rounded-2xl p-5 border-2 border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)] transition-all duration-300 group flex flex-col justify-between overflow-hidden"
              >
                {/* Vết cắt voucher 2 bên cạnh */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r-2 border-rose-100 group-hover:border-rose-300 transition-colors"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l-2 border-rose-100 group-hover:border-rose-300 transition-colors"></div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${voucher.tagColor}`}>
                      {voucher.tag}
                    </span>
                    <span className="text-[11px] text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                      {voucher.expires}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight drop-shadow-xs">
                      {voucher.discount}
                    </span>
                    <p className="text-neutral-800 font-bold text-sm mt-1">{voucher.minOrder}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{voucher.desc}</p>
                  </div>
                </div>

                {/* Đường viền đứt đoạn phong cách vé coupon */}
                <div className="border-t-2 border-dashed border-rose-200 my-4"></div>

                <div className="flex items-center justify-between gap-2">
                  <div className="bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-xs text-rose-600 tracking-wider shadow-inner">
                    {voucher.code}
                  </div>

                  <button
                    onClick={() => handleCopyCode(voucher.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      copiedCode === voucher.code
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 active:scale-95"
                    }`}
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <Check size={14} /> Đã Lưu!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Lưu Mã
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FLASH SALE HIGHLIGHT (SẢN PHẨM TÂM ĐIỂM CHÁY HÀNG) ── */}
      <section id="flash-sale" className="py-16 sm:py-24 bg-rose-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider mb-3">
                <Flame size={15} className="text-red-500 animate-pulse" /> SỐ LƯỢNG CÓ HẠN
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-rose-950 uppercase tracking-tight flex items-center gap-3">
                ⚡ DEAL TÂM ĐIỂM CHÁY HÀNG
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm font-medium">
              Giá giảm độc quyền chỉ áp dụng trong phiên flash sale hiện tại. Đơn hàng tự động hủy nếu không kịp thanh toán!
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-white rounded-2xl animate-pulse border border-rose-100/60"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashSaleHighlights.map((item) => (
                <div
                  key={item.idItem}
                  className="bg-white rounded-2xl overflow-hidden border border-rose-100 hover:border-rose-300 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(244,63,94,0.18)] group flex flex-col justify-between"
                >
                  <div>
                    {/* Ảnh sản phẩm */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-50 p-2">
                      <img
                        src={getProductImageUrl(item.thumbnail)}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge Giảm Giá */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-lg shadow-rose-500/30 flex items-center gap-1">
                        <Flame size={13} fill="currentColor" />
                        -{item.discountPercent}%
                      </div>

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-amber-500 text-xs font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1 border border-amber-100">
                        <Star size={12} fill="currentColor" /> 4.9
                      </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="p-4 sm:p-5">
                      <span className="text-[11px] font-extrabold text-rose-500 uppercase tracking-wider block mb-1.5 bg-rose-50 w-fit px-2 py-0.5 rounded">
                        {item.brandName || "CHÍNH HÃNG"}
                      </span>

                      <Link to={`/products/${item.idProduct}`} className="block">
                        <h3 className="text-neutral-800 font-bold text-sm sm:text-base line-clamp-2 hover:text-rose-600 transition-colors mb-3 leading-snug">
                          {item.productName}
                        </h3>
                      </Link>

                      {/* Giá bán */}
                      <div className="flex items-baseline gap-2.5 mb-4">
                        <span className="text-rose-600 font-black text-xl sm:text-2xl drop-shadow-xs">
                          {formatCurrency(item.salePrice)}
                        </span>
                        <span className="text-neutral-400 line-through text-xs sm:text-sm font-medium">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      </div>

                      {/* Thanh tiến độ số lượng đã bán (FOMO Progress bar) */}
                      <div className="mb-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
                        <div className="flex justify-between items-center text-xs font-semibold mb-2">
                          <span className="flex items-center gap-1 text-rose-600 font-bold">
                            <Flame size={14} className="text-rose-500 animate-bounce" /> Đã bán {item.soldPercentage}%
                          </span>
                          <span className="text-neutral-500 text-[11px]">
                            Còn {Math.max(1, item.stockQuantity - item.soldQuantity)} suất
                          </span>
                        </div>
                        <div className="w-full bg-rose-200/50 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 h-full rounded-full transition-all duration-1000 relative"
                            style={{ width: `${item.soldPercentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-[pulse_1.5s_infinite]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút thêm giỏ hàng */}
                  <div className="p-4 sm:p-5 pt-0">
                    <button
                      onClick={(e) => handleAddFlashSaleItemToCart(item, e)}
                      disabled={item.isSoldOut}
                      className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold uppercase text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={16} /> Thêm Vào Giỏ Hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. DYNAMIC CATEGORY TABS (Tab lọc danh mục deal) ── */}
      <section
        id="sale-products"
        className="py-5 bg-white/90 backdrop-blur-md sticky top-[106px] sm:top-[116px] lg:top-[122px] z-30 border-y border-rose-100 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/50 scale-105"
                    : "bg-white text-neutral-600 hover:bg-rose-50 hover:text-rose-600 border border-rose-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. MAIN PRODUCT GRID (Lưới sản phẩm Sale mở rộng) ── */}
      <section className="py-14 sm:py-20 bg-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-rose-950 uppercase tracking-tight flex items-center gap-2">
              <TrendingUp size={22} className="text-rose-500" />
              Danh Sách Ưu Đãi Đang Áp Dụng ({mainProducts.length})
            </h3>
            <span className="text-xs text-rose-600 font-semibold bg-rose-100 px-3 py-1 rounded-full hidden sm:inline">
              Giá đã tự động giảm
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white rounded-xl animate-pulse border border-rose-100/60"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
              {mainProducts.map((product) => {
                const variant = product.variants?.[0];
                const price = variant?.price ?? 200000;
                const originalPrice = variant?.originalPrice && variant.originalPrice > price
                  ? variant.originalPrice
                  : Math.round(price * 1.3);
                const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

                return (
                  <div
                    key={product.idProduct}
                    className="bg-white rounded-xl overflow-hidden border border-rose-100 hover:border-rose-300 transition-all duration-300 shadow-xs hover:shadow-[0_8px_25px_rgba(244,63,94,0.15)] group flex flex-col justify-between"
                  >
                    <div>
                      {/* Khung ảnh */}
                      <div className="relative aspect-square overflow-hidden bg-neutral-50 p-2">
                        <img
                          src={getProductImageUrl(product.thumbnail)}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badge Giảm Giá */}
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] sm:text-xs font-black px-2 py-0.5 rounded shadow-xs">
                          -{discount}%
                        </div>

                        {/* Nút thêm giỏ hàng trượt lên trên desktop khi hover */}
                        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                          <button
                            onClick={(e) => handleAddProductToCart(product, e)}
                            className="w-full py-2.5 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-rose-200 font-bold uppercase text-xs rounded-lg shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                          >
                            <ShoppingCart size={14} /> Thêm vào giỏ
                          </button>
                        </div>
                      </div>

                      {/* Nội dung card */}
                      <div className="p-3 sm:p-4">
                        <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block mb-1 truncate bg-rose-50 w-fit px-1.5 py-0.5 rounded">
                          {product.category?.name || "Mỹ phẩm"}
                        </span>

                        <Link to={`/products/${product.idProduct}`} className="block">
                          <h4 className="text-neutral-800 text-xs sm:text-sm font-semibold line-clamp-2 hover:text-rose-600 transition-colors mb-2 leading-snug">
                            {product.name}
                          </h4>
                        </Link>

                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                          <span className="text-rose-600 font-black text-sm sm:text-base">
                            {formatCurrency(price)}
                          </span>
                          <span className="text-neutral-400 line-through text-[11px] sm:text-xs">
                            {formatCurrency(originalPrice)}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-rose-50 text-[10px] text-neutral-500 flex items-center justify-between font-medium">
                          <span>Chính hãng 100%</span>
                          <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                            <Star size={10} fill="currentColor" /> 4.9
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nút giỏ hàng dành riêng cho thiết bị Mobile */}
                    <div className="p-3 pt-0 md:hidden">
                      <button
                        onClick={(e) => handleAddProductToCart(product, e)}
                        className="w-full py-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white font-bold text-xs rounded-lg transition-colors border border-rose-200 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShoppingCart size={13} /> Thêm giỏ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 7. TOAST PHẢN HỒI THÊM VÀO GIỎ HÀNG ── */}
      {toastMessage && (
        <aside
          aria-live="assertive"
          className="fixed top-28 right-4 sm:right-8 z-50 bg-white border border-rose-200 text-neutral-800 px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.2)] flex items-center gap-3 animate-in slide-in-from-top-3 duration-200"
        >
          <div className="bg-emerald-100 p-1.5 rounded-full">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
          </div>
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-emerald-600 mb-0.5">Thành công!</p>
            <p className="text-neutral-600 line-clamp-1 font-medium">{toastMessage}</p>
          </div>
          <button
            onClick={() => dispatch(openCart())}
            className="ml-2 pl-2 border-l border-rose-100 text-xs font-bold text-rose-600 hover:text-rose-500 whitespace-nowrap cursor-pointer"
          >
            Xem giỏ
          </button>
        </aside>
      )}
    </main>
  );
};

export default SalePage;
