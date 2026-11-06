/**
 * src/utils/imageHelper.ts
 * 
 * Tiện ích tạo URL ảnh Cloudinary cho dự án React + TypeScript (Vite)
 * Tự động tối ưu định dạng (WebP/AVIF), nén nhẹ và resize theo kích thước mong muốn.
 */

const CLOUDINARY_CLOUD_NAME = 'hb22fnuq';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'limit';
  quality?: 'auto' | 'auto:eco' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

/**
 * Hàm tạo URL ảnh Cloudinary tổng quát
 * @param relativePath Đường dẫn tương đối từ products.json (ví dụ: 'chamsocda-anh/anessa/...')
 * @param options Các tùy chọn kích thước, chất lượng
 */
export function getImageUrl(relativePath?: string, options: ImageTransformOptions = {}): string {
  if (!relativePath) return '';

  // Nếu đã là link online (bắt đầu bằng http/https) thì giữ nguyên
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  const {
    width,
    height,
    crop = (width && height) ? 'fill' : undefined,
    quality = 'auto',
    format = 'auto',
  } = options;

  const transforms: string[] = [];

  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);

  const transformStr = transforms.length > 0 ? `${transforms.join(',')}/` : '';
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;

  return `${CLOUDINARY_BASE_URL}${transformStr}${cleanPath}`;
}

/**
 * Lấy ảnh thu nhỏ hình vuông cho Product Card / Danh sách sản phẩm (350x350)
 */
export function getThumbnailUrl(relativePath?: string): string {
  return getImageUrl(relativePath, { width: 350, height: 350, crop: 'fill', quality: 'auto' });
}

/**
 * Lấy ảnh lớn chất lượng cao cho Trang chi tiết sản phẩm (Product Detail)
 */
export function getDetailImageUrl(relativePath?: string): string {
  return getImageUrl(relativePath, { width: 900, quality: 'auto' });
}

/**
 * Lấy ảnh Banner / Hero cho Trang chủ
 */
export function getBannerUrl(relativePath?: string): string {
  return getImageUrl(relativePath, { width: 1400, quality: 'auto' });
}

