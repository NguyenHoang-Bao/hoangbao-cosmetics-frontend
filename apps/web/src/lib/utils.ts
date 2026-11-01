import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Cau hinh class name, xu ly boolean/mang/object va tailwind-mergeConfigs(xung dot class tailwin)
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// URL Cloudinary mac dinh
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || "https://res.cloudinary.com/hb22fnuq/image/upload";

// Anh mac dinh dang SVG Data URI sang trong, tinh te theo chuan luxury cosmetics (thay the chu canh bao do gay mat tham my)
export const DEFAULT_PRODUCT_IMAGE =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF8"/>
      <stop offset="100%" stop-color="#F4ECE6"/>
    </linearGradient>
    <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E8DBD5"/>
      <stop offset="50%" stop-color="#F2EAE6"/>
      <stop offset="100%" stop-color="#DFCEC7"/>
    </linearGradient>
  </defs>
  <rect width="300" height="400" fill="url(#bgGrad)"/>
  
  <!-- Hoa tiet chai serum my pham toi gian thanh lich -->
  <g transform="translate(150, 165)" text-anchor="middle">
    <!-- Nap bop cao su cua ong hut serum -->
    <path d="M-10 -72 C-10 -78 10 -78 10 -72 L10 -58 L-10 -58 Z" fill="#D4A396"/>
    <!-- Vong kim loai ma vang hong -->
    <rect x="-13" y="-58" width="26" height="8" rx="2" fill="#BA8274"/>
    <!-- Co chai thuy tinh -->
    <rect x="-10" y="-50" width="20" height="12" fill="#E8DBD5"/>
    <!-- Than chai serum thuy tinh -->
    <path d="M-28 -38 C-28 -38 -15 -38 -10 -38 L10 -38 C15 -38 28 -38 28 -38 C32 -38 35 -35 35 -30 L35 38 C35 44 31 48 25 48 L-25 48 C-31 48 -35 44 -35 38 L-35 -30 C-35 -35 -32 -38 -28 -38 Z" fill="url(#bottleGrad)" stroke="#D6C4BD" stroke-width="1.5"/>
    <!-- Ong hut thuy tinh ben trong -->
    <line x1="0" y1="-38" x2="0" y2="30" stroke="#CBB7AF" stroke-width="2" stroke-linecap="round"/>
    <!-- Muc dung dich tinh chat nhe nhang -->
    <path d="M-30 8 C-15 12 15 4 30 8 L30 38 C30 42 27 45 23 45 L-23 45 C-27 45 -30 42 -30 38 Z" fill="#E4CAC1" fill-opacity="0.5"/>
    <!-- Ngoi sao lap lanh tinh chat -->
    <path d="M38 -45 Q38 -37 46 -37 Q38 -37 38 -29 Q38 -37 30 -37 Q38 -37 38 -45 Z" fill="#E2A898"/>
  </g>

  <!-- Typography nhan dien thuong hieu Hoang Bao Cosmetics -->
  <text x="150" y="260" text-anchor="middle" fill="#8C7A70" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" letter-spacing="1.5">
    HOÀNG BẢO COSMETICS
  </text>
  <text x="150" y="278" text-anchor="middle" fill="#B5A59E" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="400" letter-spacing="0.5">
    Hình ảnh đang cập nhật
  </text>
</svg>
`);

// Chuan hoa URL hinh anh tu Cloudinary hoac URL tuyet doi
export const getProductImageUrl = (path?: string): string => {
    if (!path || path.trim() === "") return DEFAULT_PRODUCT_IMAGE;

    // Tu dong khac phuc URL Unsplash bi loi photo id trong cache/localStorage
    if (path.includes("photo-1608248597359-5484831f50c6")) {
        return "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&auto=format&fit=crop&q=80";
    }

    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${CLOUDINARY_BASE_URL}/${cleanPath}`;
};

// Dinh dang tien te Viet Nam (VND)
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

// Tach du lieu mang tu DB (JSON string hoac chuoi phan cach xuong dong/dau gach)
export const parseProductArrayData = (raw?: string | null): string[] => {
    if (!raw || typeof raw !== "string") return [];
    const trimmed = raw.trim();
    if (!trimmed) return [];

    // Neu bat dau bang '[' va ket thuc bang ']' -> parse JSON array
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed
                    .map((item) => (typeof item === "string" ? item.trim() : String(item)))
                    .filter(Boolean);
            }
        } catch {
            // Fallback neu loi JSON
        }
    }

    // Fallback: tach theo xuong dong hoac dau cham/gach dau dong
    return trimmed
        .split(/\r?\n/)
        .map((line) => line.replace(/^[•\-*✦\d\.]\s*/, "").trim())
        .filter(Boolean);
};
