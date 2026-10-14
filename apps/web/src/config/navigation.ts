export interface SubCategoryItem {
  readonly label: string;
  readonly path: string;
}

export interface CategoryGroup {
  readonly label: string;
  readonly path: string;
  readonly items: readonly SubCategoryItem[];
}

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly isHighlight?: boolean;
  readonly subCategories?: readonly CategoryGroup[];
}

export const NAVIGATION_ITEMS: readonly NavItem[] = [
  {
    label: "TRANG CHỦ",
    path: "/",
  },
  {
    label: "ĐANG SALE",
    path: "/sale",
    isHighlight: true,
  },
  {
    label: "DANH MỤC SẢN PHẨM",
    path: "/products",
    subCategories: [
      {
        label: "Chăm sóc da",
        path: "/products?cat=Chăm sóc da",
        items: [
          { label: "Chăm sóc da mặt", path: "/products?cat=Chăm sóc da mặt" },
          { label: "Chăm sóc da & Cơ thể", path: "/products?cat=Chăm sóc da & Cơ thể" },
          { label: "Chăm sóc mắt", path: "/products?cat=Chăm sóc mắt" },
          { label: "Chăm sóc môi", path: "/products?cat=Chăm sóc môi" },
        ],
      },
      {
        label: "Tóc & Cơ thể",
        path: "/products?cat=Tóc & Cơ thể",
        items: [
          { label: "Chăm sóc tóc", path: "/products?cat=Chăm sóc tóc" },
          { label: "Chăm sóc cơ thể", path: "/products?cat=Chăm sóc cơ thể" },
          { label: "Cá nhân & Trẻ em", path: "/products?cat=Cá nhân & Trẻ em" },
        ],
      },
      {
        label: "Trang điểm & Mùi hương",
        path: "/products?cat=Trang điểm & Mùi hương",
        items: [
          { label: "Trang điểm", path: "/products?cat=Trang điểm" },
          { label: "Nước hoa", path: "/products?cat=Nước hoa" },
        ],
      },
    ],
  },
  {
    label: "CHẨN ĐOÁN DA",
    path: "/skin-quiz",
  },
  {
    label: "TRA CỨU ĐƠN HÀNG",
    path: "/order-tracking",
  },
  {
    label: "LIÊN HỆ",
    path: "/contact",
  },
] as const;