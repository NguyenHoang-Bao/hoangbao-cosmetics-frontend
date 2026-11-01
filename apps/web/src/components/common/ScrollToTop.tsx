import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component tự động cuộn lên đầu trang (Top: 0) mỗi khi:
 * - Chuyển sang route mới (pathname thay đổi)
 * - Đổi bộ lọc, danh mục, phân trang (search query thay đổi)
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
