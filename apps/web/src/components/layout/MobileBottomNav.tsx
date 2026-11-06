import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Package, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openCart } from '@/features/cart/store/cartSlice';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentPath = location.pathname;

  // Lấy tổng số lượng sản phẩm trong giỏ hàng để hiển thị huy hiệu (badge)
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      label: 'Trang chủ',
      to: '/',
      icon: Home,
      isActive: currentPath === '/',
    },
    {
      label: 'Sản phẩm',
      to: '/products',
      icon: ShoppingBag,
      isActive: currentPath.startsWith('/products') || currentPath.startsWith('/product/'),
    },
    {
      label: 'Flash Sale',
      to: '/sale',
      icon: Flame,
      isActive: currentPath === '/sale' || currentPath === '/flash-sale',
      isHot: true,
    },
    {
      label: 'Đơn mua',
      to: '/my-orders',
      icon: Package,
      isActive: currentPath.startsWith('/my-orders') || currentPath.startsWith('/order-tracking'),
    },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-15 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                item.isActive
                  ? 'text-rose-600 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={item.isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
                {item.isHot && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full uppercase leading-none shadow-xs">
                    Hot
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none tracking-tight">{item.label}</span>
              {item.isActive && (
                <span className="w-1 h-1 bg-rose-600 rounded-full mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}

        {/* Nút Giỏ Hàng mở Cart Drawer nhanh chóng */}
        <button
          type="button"
          onClick={() => dispatch(openCart())}
          className="flex flex-col items-center justify-center flex-1 py-1 text-neutral-500 hover:text-rose-600 font-medium transition-all relative cursor-pointer"
          aria-label="Mở giỏ hàng"
        >
          <div className="relative">
            <ShoppingCart size={20} className="stroke-[1.8]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs">
                {totalCartCount > 99 ? '99+' : totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 leading-none tracking-tight">Giỏ hàng</span>
        </button>
      </div>
    </nav>
  );
};
