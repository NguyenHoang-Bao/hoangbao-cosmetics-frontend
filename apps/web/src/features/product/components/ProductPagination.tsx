import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProductPaginationProps {
  /** Trang hiện tại (0-indexed theo chuẩn Spring Boot) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Callback chuyển trang (trả về 0-indexed) */
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Chuyển sang 1-indexed để hiển thị giao diện người dùng
  const currentDisplayPage = currentPage + 1;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentDisplayPage - 1);
      let end = Math.min(totalPages - 1, currentDisplayPage + 1);

      if (currentDisplayPage <= 2) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentDisplayPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Phân trang" className="flex justify-center items-center mt-10 mb-6">
      <ul className="flex items-center gap-1.5">
        {/* Nút Trang Trước */}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              currentPage === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </li>

        {/* Danh sách các số trang */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(Number(page) - 1)}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentDisplayPage === page
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Nút Trang Kế Tiếp */}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              currentPage >= totalPages - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
            aria-label="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default ProductPagination;
