import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Cau hinh class name, xu ly boolean/mang/object va tailwind-mergeConfigs(xung dot class tailwin)
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// URL Cloudinary mac dinh
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || "https://res.cloudinary.com/hb22fnuq/image/upload";

// Anh mac dinh dang SVG Data URI the hien ro trang thai loi anh (khong phu thuoc server ngoai)
export const DEFAULT_PRODUCT_IMAGE =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="none">
  <rect width="300" height="400" fill="#F3F4F6"/>
  <g transform="translate(110, 140)">
    <rect x="0" y="0" width="80" height="65" rx="8" stroke="#9CA3AF" stroke-width="2.5" fill="#E5E7EB"/>
    <circle cx="25" cy="22" r="6" fill="#9CA3AF"/>
    <path d="M8 55 L32 32 L52 48 L62 40 L72 55" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="68" cy="12" r="12" fill="#EF4444"/>
    <path d="M68 6 V13 M68 16 V18" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
  </g>
  <text x="150" y="240" text-anchor="middle" fill="#EF4444" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="0.5">
    ẢNH BỊ LỖI
  </text>
  <text x="150" y="262" text-anchor="middle" fill="#6B7280" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500">
    (Không tải được ảnh)
  </text>
</svg>
`);

// Chuan hoa URL hinh anh tu Cloudinary hoac URL tuyet doi
export const getProductImageUrl = (path?: string): string => {
    if (!path) return DEFAULT_PRODUCT_IMAGE;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
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
