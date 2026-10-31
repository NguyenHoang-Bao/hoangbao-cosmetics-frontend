import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/cartSlice";
import { formatCurrency, getProductImageUrl, DEFAULT_PRODUCT_IMAGE } from "@/lib/utils";

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate("/checkout");
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?")) {
      dispatch(clearCart());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" aria-modal="true" role="dialog">
      {/* Backdrop mờ */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs transition-opacity duration-300"
        onClick={() => dispatch(closeCart())}
        aria-hidden="true"
      />

      {/* Drawer Panel trượt từ phải */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900">
              Giỏ Hàng ({totalQuantity})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeCart())}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md transition-colors cursor-pointer"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung danh sách sản phẩm */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-800 mb-1">
                Giỏ hàng của bạn đang trống
              </h3>
              <p className="text-xs text-neutral-500 mb-6 max-w-xs">
                Hãy lựa chọn các sản phẩm chăm sóc da và làm đẹp chính hãng tại Hoàng Bảo Cosmetics.
              </p>
              <Link
                to="/products"
                onClick={() => dispatch(closeCart())}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs"
              >
                Khám phá sản phẩm ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemImg = getProductImageUrl(item.image);
                return (
                  <div
                    key={`${item.idProduct}-${item.variantId || "default"}`}
                    className="flex gap-3 pb-4 border-b border-neutral-100 last:border-0"
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="w-20 h-24 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                      <img
                        src={itemImg}
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

                    {/* Thông tin sản phẩm */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {item.brandName && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                            {item.brandName}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        {item.capacity && (
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Quy cách: {item.capacity}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Giá */}
                        <div>
                          <span className="text-sm font-bold text-rose-600">
                            {formatCurrency(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-neutral-400 line-through ml-2">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Nút tăng giảm số lượng & Nút Xóa */}
                        {(() => {
                          const isAtMaxStock =
                            item.stockQuantity !== undefined &&
                            item.quantity >= item.stockQuantity;
                          return (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        idProduct: item.idProduct,
                                        variantId: item.variantId,
                                        quantity: item.quantity - 1,
                                      }),
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                                  aria-label="Giảm số lượng"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={isAtMaxStock}
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        idProduct: item.idProduct,
                                        variantId: item.variantId,
                                        quantity: item.quantity + 1,
                                      }),
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  aria-label="Tăng số lượng"
                                  title={
                                    isAtMaxStock
                                      ? `Đã đạt giới hạn tồn kho (${item.stockQuantity})`
                                      : "Tăng số lượng"
                                  }
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    removeFromCart({
                                      idProduct: item.idProduct,
                                      variantId: item.variantId,
                                    }),
                                  )
                                }
                                className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Drawer: Tạm tính & Nút Đặt hàng */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 font-medium">Tạm tính:</span>
              <span className="text-lg font-bold text-rose-600">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500 text-center">
              Phí vận chuyển và voucher giảm giá sẽ được tính tại bước thanh toán.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-colors cursor-pointer"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={handleClearCart}
                className="text-neutral-400 hover:text-red-500 transition-colors"
              >
                Xóa tất cả
              </button>
              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
