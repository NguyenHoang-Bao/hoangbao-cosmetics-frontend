import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Truck } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-pink-50 text-gray-800 border-t border-pink-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* ── 5 CỘT THÔNG TIN THƯƠNG HIỆU THỰC TẾ ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Cột 1: Logo & Slogan */}
          <div className="lg:col-span-2 flex flex-col justify-start items-start space-y-3">
            <Link to="/">
              <img
                src={logo}
                alt="Hoàng Bảo Cosmetics"
                className="w-32 h-auto object-contain hover:opacity-95 transition-opacity"
              />
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mỹ phẩm chính hãng cao cấp, phác đồ chăm sóc làn da chuẩn chuyên gia.
            </p>
          </div>

          {/* Cột 2: Danh sách chi nhánh & Mạng xã hội */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-sm">
              HOÀNG BẢO COSMETICS
            </h5>
            <div className="space-y-3 text-xs md:text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <MapPin className="text-pink-500 mt-0.5 shrink-0 w-4 h-4" />
                <span>
                  <strong>Chi nhánh Tân Phú:</strong> 140 Lê Trọng Tấn, Tây Thạnh, Tân Phú, TP.Hồ Chí Minh
                </span>
              </p>
            </div>
            
            {/* 4 Icon Mạng Xã Hội dạng hình tròn màu sắc chuẩn mẫu ảnh */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook - Xanh dương đậm */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Theo dõi trên Facebook"
                className="w-8 h-8 rounded-full bg-[#3b5998] hover:bg-[#2d4373] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X - Xanh da trời */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                title="Theo dõi trên Twitter"
                className="w-8 h-8 rounded-full bg-[#00acee] hover:bg-[#0087ba] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                </svg>
              </a>

              {/* Instagram - Hồng cánh sen */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Theo dõi trên Instagram"
                className="w-8 h-8 rounded-full bg-[#c13584] hover:bg-[#a62a6f] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube - Đỏ */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                title="Theo dõi trên YouTube"
                className="w-8 h-8 rounded-full bg-[#e62117] hover:bg-[#b8160e] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cột 3: Chăm sóc khách hàng */}
          <div className="lg:col-span-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">
              Chăm sóc khách hàng
            </h5>
            <ul className="space-y-2.5 text-xs md:text-sm text-gray-600">
              <li>
                <Link to="/policy/returns" className="hover:text-pink-600 transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/policy/warranty" className="hover:text-pink-600 transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="/policy/privacy" className="hover:text-pink-600 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/policy/shipping" className="hover:text-pink-600 transition-colors">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-pink-600 transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Giờ mở cửa & Góp ý */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h5 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-2">
                Giờ mở cửa
              </h5>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                Từ 9:00 - 22:00 tất cả các ngày trong tuần (bao gồm cả các ngày lễ, ngày Tết).
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-2">
                Góp ý - Khiếu nại
              </h5>
              <p className="flex items-center gap-2 text-xs md:text-sm text-gray-700 mb-1.5">
                <Phone className="text-pink-500 w-4 h-4 shrink-0" />
                <strong>0359 490 221</strong>
              </p>
              <p className="flex items-center gap-2 text-xs md:text-sm text-gray-700 mb-3">
                <Mail className="text-pink-500 w-4 h-4 shrink-0" />
                <span>hbao4142@gmail.com</span>
              </p>
              <Link
                to="/contact"
                className="text-pink-600 hover:text-pink-700 text-xs md:text-sm font-semibold flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" /> HỆ THỐNG CỬA HÀNG
              </Link>
            </div>
          </div>

          {/* Cột 5: Về Hoàng Bảo Cosmetics */}
          <div className="lg:col-span-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">
              Về Hoàng Bảo Cosmetics
            </h5>
            <ul className="space-y-2.5 text-xs md:text-sm text-gray-600">
              <li>
                <Link to="/about" className="hover:text-pink-600 transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-600 transition-colors">
                  Liên hệ góp ý
                </Link>
              </li>
              <li>
                <Link to="/skin-quiz" className="hover:text-pink-600 transition-colors">
                  Trắc nghiệm da & Routine
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pink-600 transition-colors">
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── KHỐI PHƯƠNG THỨC THANH TOÁN (PAYMENT METHODS) ── */}
        <div className="border-t border-pink-200 mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              THANH TOÁN:
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 1. Ví MoMo */}
              <div
                className="bg-white border border-gray-200 px-3 py-1 rounded shadow-2xs flex items-center justify-center h-8 hover:border-[#a50064] hover:shadow-xs transition-all cursor-default"
                title="Thanh toán qua Ví MoMo"
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                  alt="Ví MoMo"
                  className="h-5 w-auto object-contain rounded-xs"
                />
              </div>

              {/* 2. Vietcombank */}
              <div
                className="bg-white border border-gray-200 px-3 py-1 rounded shadow-2xs flex items-center justify-center h-8 hover:border-green-600 hover:shadow-xs transition-all cursor-default"
                title="Chuyển khoản Vietcombank"
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-Vietcombank.png"
                  alt="Vietcombank"
                  className="h-4.5 w-auto object-contain"
                />
              </div>

              {/* 3. MB Bank */}
              <div
                className="bg-white border border-gray-200 px-3 py-1 rounded shadow-2xs flex items-center justify-center h-8 hover:border-blue-600 hover:shadow-xs transition-all cursor-default"
                title="Chuyển khoản MB Bank"
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-MB-Bank-MBB.png"
                  alt="MB Bank"
                  className="h-4.5 w-auto object-contain"
                />
              </div>

              {/* 4. COD */}
              <div
                className="bg-white border border-gray-200 px-3.5 py-1 rounded shadow-2xs flex items-center justify-center h-8 gap-1.5 hover:border-gray-400 hover:shadow-xs transition-all cursor-default"
                title="Thanh toán khi nhận hàng (COD)"
              >
                <Truck className="text-gray-700 w-4 h-4" />
                <span className="text-[11px] font-black text-gray-800 tracking-wider">
                  COD
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            © 2026 Hoàng Bảo Cosmetics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
