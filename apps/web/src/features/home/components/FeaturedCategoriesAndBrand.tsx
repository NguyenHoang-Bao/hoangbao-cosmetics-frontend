import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { productApi } from "@/features/product/api/productApi";
import { getProductImageUrl } from "@/lib/utils";

export const FeaturedCategoriesAndBrand: React.FC = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["home-categories"],
    queryFn: () => productApi.getCategories(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["home-brands"],
    queryFn: () => productApi.getBrands(),
  });

  return (
    <>
      {/* ── 1. DANH MỤC NỔI BẬT ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <span className="text-rose-500">✿</span>
            <span>DANH MỤC NỔI BẬT</span>
          </h2>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4">
          {categories.slice(0, 14).map((cat) => {
            const catImg = cat.thumbnail ? getProductImageUrl(cat.thumbnail) : "";
            return (
              <Link
                key={cat.idCategory}
                to={`/products?categoryId=${cat.idCategory}`}
                className="flex flex-col items-center gap-2.5 group py-3 px-1 rounded-2xl hover:bg-rose-50/50 transition-colors"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white rounded-full shadow-2xs border border-neutral-100 group-hover:border-rose-200 group-hover:shadow-md transition-all overflow-hidden p-2">
                  {catImg ? (
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-bold text-rose-400 group-hover:scale-110 transition-transform">
                      {cat.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-center text-neutral-800 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 2. THƯƠNG HIỆU NỔI BẬT ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-neutral-800 flex items-center gap-2">
            <span className="text-orange-500">⊞</span>
            <span>THƯƠNG HIỆU NỔI BẬT</span>
          </h2>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-neutral-500 hover:text-orange-500 transition-colors flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 border border-pink-100 rounded-3xl overflow-hidden p-3 sm:p-4 bg-white shadow-2xs">
          {/* Card banner bên trái */}
          <div className="hidden md:flex w-48 shrink-0 flex-col justify-between bg-gradient-to-br from-pink-50 to-rose-100/70 rounded-2xl p-4 border border-pink-100">
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5 font-bold">
                Cam kết hàng chính hãng
              </p>
              <p className="text-sm font-extrabold text-neutral-800 leading-snug">
                Thương hiệu mỹ phẩm uy tín toàn cầu
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1.5 my-3">
              {brands.slice(0, 9).map((b) => {
                const logoSrc = b.logoUrl || b.logo;
                return (
                  <div
                    key={b.idBrand}
                    className="bg-white rounded-lg p-1 flex items-center justify-center h-9 shadow-2xs border border-neutral-100/60"
                  >
                    {logoSrc ? (
                      <img
                        src={getProductImageUrl(logoSrc)}
                        alt={b.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[9px] font-bold text-neutral-400">
                        {b.name.slice(0, 3)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-rose-600 font-bold text-center tracking-wider uppercase">
              100% AUTHENTIC
            </p>
          </div>

          {/* Grid brand logos bên phải */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {brands.slice(0, 16).map((brand) => {
              const brandLogo = (brand.logoUrl || brand.logo) ? getProductImageUrl(brand.logoUrl || brand.logo) : "";
              return (
                <Link
                  key={brand.idBrand}
                  to={`/products?brandId=${brand.idBrand}`}
                  className="flex flex-col items-center justify-center bg-white hover:bg-rose-50/60 hover:shadow-sm border border-neutral-100 rounded-2xl p-2.5 aspect-square group transition-all duration-200"
                  title={brand.name}
                >
                  {brandLogo ? (
                    <img
                      src={brandLogo}
                      alt={brand.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs font-bold text-neutral-700 text-center">
                      {brand.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedCategoriesAndBrand;
