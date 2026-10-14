import React from "react";
import { NavLink, Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/config/navigation";

export const Navbar: React.FC = () => {
  return (
    <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
      {NAVIGATION_ITEMS.map((item) => {
        // TRƯỜNG HỢP 1: Menu có Dropdown danh mục đa cấp
        if (item.subCategories) {
          return (
            <div key={item.path} className="relative group/nav py-3">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold tracking-wide transition-colors",
                    isActive
                      ? "text-rose-600 bg-rose-50"
                      : "text-neutral-700 hover:text-rose-600 hover:bg-neutral-50",
                  )
                }
              >
                <span>{item.label}</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/nav:rotate-180" />
              </NavLink>

              {/* Submenu Cấp 1 */}
              <div className="absolute top-full left-0 w-64 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                {item.subCategories.map((group) => (
                  <div key={group.label} className="relative group/sub">
                    <Link
                      to={group.path}
                      className="flex items-center justify-between px-4 py-2.5 text-xs xl:text-sm text-neutral-700 hover:text-rose-600 hover:bg-rose-50/80 transition-colors"
                    >
                      <span>{group.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover/sub:text-rose-500" />
                    </Link>

                    {/* Submenu Cấp 2 */}
                    <div className="absolute top-0 left-full w-60 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 ml-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                      {group.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="block px-4 py-2 text-xs xl:text-sm text-neutral-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Đường gạch ngang & Link Xem tất cả */}
                <div className="border-t border-neutral-100 my-1.5" />
                <Link
                  to="/products"
                  className="flex items-center gap-2 px-4 py-2 text-xs xl:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <span>Xem tất cả sản phẩm</span>
                </Link>
              </div>
            </div>
          );
        }

        // TRƯỜNG HỢP 2: Link đơn (Trang chủ, Sale, Quiz, Đơn hàng, Liên hệ)
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold tracking-wide transition-colors",
                item.isHighlight &&
                  "text-rose-500 hover:text-rose-600 font-bold",
                isActive
                  ? "text-rose-600 bg-rose-50 font-bold"
                  : "text-neutral-700 hover:text-rose-600 hover:bg-neutral-50",
              )
            }
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};
