import React from "react";

interface ProductSkeletonProps {
    /** Số lượng card khung xương muốn hiển thị (mặc định 8) */
    count?: number;
}

/**
 * Component hiển thị khung xương shimmer cho lưới sản phẩm khi đang tải (Loading state)
 */
export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-xs animate-pulse flex flex-col"
                >
                    {/* 1. Khung ảnh tỷ lệ 3/4 */}
                    <div className="aspect-[3/4] bg-neutral-200 w-full relative" />

                    {/* 2. Phần thông tin text bên dưới */}
                    <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2.5">
                        {/* Thương hiệu */}
                        <div className="h-3 bg-neutral-200 rounded-sm w-1/3" />

                        {/* Tên sản phẩm (2 dòng) */}
                        <div className="space-y-1.5">
                            <div className="h-4 bg-neutral-200 rounded-sm w-full" />
                            <div className="h-4 bg-neutral-200 rounded-sm w-2/3" />
                        </div>

                        {/* Giá tiền */}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                            <div className="h-5 bg-neutral-200 rounded-sm w-24" />
                            <div className="w-8 h-8 rounded-full bg-neutral-200" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
