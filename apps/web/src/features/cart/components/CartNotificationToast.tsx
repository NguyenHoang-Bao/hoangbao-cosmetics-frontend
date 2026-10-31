import React, { useEffect, useRef } from "react";
import { CheckCircle2, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissNotification, openCart } from "../store/cartSlice";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";

export const CartNotificationToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.cart.notification);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notification) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Tự động đóng toast sau 3.5 giây
    timerRef.current = setTimeout(() => {
      dispatch(dismissNotification());
    }, 3500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [notification?.timestamp, dispatch]);

  const handleMouseEnter = () => {
    // Tạm dừng timer khi người dùng rê chuột vào toast
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Tiếp tục đếm lùi khi rời chuột
    timerRef.current = setTimeout(() => {
      dispatch(dismissNotification());
    }, 2000);
  };

  const handleOpenCart = () => {
    dispatch(dismissNotification());
    dispatch(openCart());
  };

  if (!notification) return null;

  const { item, quantityAdded } = notification;
  const itemImg = getProductImageUrl(item.image);

  return (
    <div
      className="fixed top-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-rose-100 p-4 transition-all duration-300 animate-in slide-in-from-top-4 fade-in-50"
      role="status"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header Toast */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Đã thêm vào giỏ hàng
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(dismissNotification())}
          className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Thông tin sản phẩm vừa thêm */}
      <div className="flex gap-3 items-center">
        <div className="w-14 h-16 rounded-xl bg-neutral-50 overflow-hidden border border-neutral-200/80 shrink-0">
          <img
            src={itemImg}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          {item.brandName && (
            <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider line-clamp-1 mb-0.5">
              {item.brandName}
            </p>
          )}
          <h4 className="text-xs font-medium text-neutral-900 line-clamp-1 mb-1">
            {item.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600">
              {formatCurrency(item.price)}
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              x{quantityAdded}
            </span>
            {item.capacity && (
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-medium">
                {item.capacity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nút Xem giỏ hàng nhanh */}
      <div className="mt-3 pt-2">
        <button
          type="button"
          onClick={handleOpenCart}
          className="w-full py-2 px-3 bg-neutral-900 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs group"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Xem giỏ hàng & Thanh toán</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
