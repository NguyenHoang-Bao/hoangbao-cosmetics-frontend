import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  link?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {item.link ? (
              <Link
                to={item.link}
                onClick={item.onClick}
                className="hover:text-rose-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {item.label}
              </span>
            )}

            {/* Dấu gạch chéo phân cách */}
            {!isLast && (
              <span className="text-gray-300 select-none">/</span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
