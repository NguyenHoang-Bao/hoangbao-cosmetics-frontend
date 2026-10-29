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
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Các route Auth toàn màn hình độc lập (chuẩn giao diện cũ) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Các route chính có Header & Footer */}
            <Route element={<MainLayout />}>
              <Route
                index
                element={
                  <div className="py-20 text-center text-neutral-400 text-sm">
                    Trang chủ Hoàng Bảo Cosmetics
                  </div>
                }
              />
              {/* Trang danh mục sản phẩm (Product Catalog UI) */}
              <Route path="/products" element={<ProductListPage />} />
              {/* Trang chi tiết sản phẩm */}
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* Trang thanh toán */}
              <Route
                path="/checkout"
                element={
                  <div className="py-20 text-center text-neutral-700 text-sm font-medium">
                    Trang Thanh Toán Đơn Hàng (Sẵn sàng cho Module Checkout)
                  </div>
                }
              />

              {/* Các route yêu cầu phải đăng nhập */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/profile"
                  element={
                    <div className="py-20 text-center text-neutral-700 text-sm font-medium">
                      Trang Thông Tin Cá Nhân
                    </div>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <div className="py-20 text-center text-neutral-700 text-sm font-medium">
                      Trang Lịch Sử Đơn Hàng
                    </div>
                  }
                />
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
