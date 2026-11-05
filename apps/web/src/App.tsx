import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "@/store";
import { queryClient } from "@/lib/queryClient";
import { MainLayout } from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ProductListPage from "@/features/product/pages/ProductListPage";
import ProductDetailPage from "@/features/product/pages/ProductDetailPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/features/checkout/pages/OrderSuccessPage";
import OrderTrackingPage from "@/features/order/pages/OrderTrackingPage";
import AboutPage from "@/features/about/pages/AboutPage";
import ContactPage from "@/features/contact/pages/ContactPage";
import WishlistPage from "@/features/product/pages/WishlistPage";
import HomePage from "@/features/home/pages/HomePage";
import { SalePage } from "@/features/flash-sale";
import { ProfilePage } from "@/features/profile";
import { MyOrdersPage } from "@/features/order";
import { AdminLayout, DashboardPage, OrderListPage, ProductAdminPage } from "@/features/admin";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoute from "@/routes/AdminRoute";
import { ScrollToTop } from "@/components/common/ScrollToTop";

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Các route Auth toàn màn hình độc lập (chuẩn giao diện cũ) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Các route chính có Header & Footer */}
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              {/* Trang đại tiệc khuyến mãi Flash Sale */}
              <Route path="/sale" element={<SalePage />} />
              <Route path="/flash-sale" element={<SalePage />} />
              {/* Trang danh mục sản phẩm (Product Catalog UI) */}
              <Route path="/products" element={<ProductListPage />} />
              {/* Trang chi tiết sản phẩm */}
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* Trang thanh toán & Hoàn tất đơn hàng */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderCode" element={<OrderSuccessPage />} />
              {/* Trang giới thiệu (About Page) */}
              <Route path="/about" element={<AboutPage />} />

              {/* Trang liên hệ (Contact Page) */}
              <Route path="/contact" element={<ContactPage />} />

              {/* Trang danh sách yêu thích (Wishlist) */}
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Các route yêu cầu BẮT BUỘC PHẢI ĐĂNG NHẬP */}
              <Route element={<ProtectedRoute />}>
                {/* Trang tra cứu tiến độ đơn hàng (Chỉ cho phép thành viên đã đăng nhập) */}
                <Route path="/order-tracking" element={<OrderTrackingPage />} />
                {/* Trang thông tin tài khoản cá nhân & Sổ địa chỉ & Bảo mật */}
                <Route path="/profile" element={<ProfilePage />} />
                {/* Trang lịch sử đơn hàng của tôi */}
                <Route path="/my-orders" element={<MyOrdersPage />} />
              </Route>
            </Route>

            {/* Phân hệ Quản Trị Hệ Thống & Vận Hành Đơn Hàng (Admin Portal) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="orders" element={<OrderListPage />} />
                <Route path="products" element={<ProductAdminPage />} />
                <Route path="categories" element={<ProductAdminPage />} />
                <Route path="warehouse" element={<OrderListPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
