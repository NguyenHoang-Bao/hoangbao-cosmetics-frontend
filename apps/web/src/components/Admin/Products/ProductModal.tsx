import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Check } from 'lucide-react';
import { adminService, type ProductItem, type CategoryItem } from '@/services/adminService';
import { getImageUrl } from '@/utils/imageHelper';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<ProductItem, 'id'> | ProductItem) => void;
  editingProduct: ProductItem | null;
  categories: CategoryItem[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<ProductItem, 'id'>>({
    sku: '',
    slug: '',
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    price: 0,
    originalPrice: 0,
    capacity: '',
    description: '',
    benefits: [],
    keyIngredients: [],
    usage: '',
    thumbnail: '',
    images: [],
    inStock: true
  });

  const [newBenefit, setNewBenefit] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newImage, setNewImage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        sku: editingProduct.sku || '',
        slug: editingProduct.slug || '',
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        category: editingProduct.category || (categories[0]?.name || ''),
        subCategory: editingProduct.subCategory || '',
        price: editingProduct.price || 0,
        originalPrice: editingProduct.originalPrice || 0,
        capacity: editingProduct.capacity || '',
        description: editingProduct.description || '',
        benefits: editingProduct.benefits || [],
        keyIngredients: editingProduct.keyIngredients || [],
        usage: editingProduct.usage || '',
        thumbnail: editingProduct.thumbnail || '',
        images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [editingProduct.thumbnail].filter(Boolean),
        inStock: editingProduct.inStock ?? true
      });
    } else {
      setFormData({
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        slug: '',
        name: '',
        brand: '',
        category: categories[0]?.name || 'Chăm sóc da',
        subCategory: '',
        price: 0,
        originalPrice: 0,
        capacity: '50ml',
        description: '',
        benefits: [],
        keyIngredients: [],
        usage: '',
        thumbnail: '',
        images: [],
        inStock: true
      });
    }
    setErrors({});
  }, [editingProduct, categories, isOpen]);

  // Tự động tạo slug khi người dùng nhập tên (chỉ khi thêm mới)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingProduct ? adminService.createSlug(val) : prev.slug
    }));
  };

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!formData.name.trim()) err.name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.sku.trim()) err.sku = 'Vui lòng nhập mã SKU';
    if (!formData.brand.trim()) err.brand = 'Vui lòng nhập thương hiệu';
    if (formData.price <= 0) err.price = 'Giá bán phải lớn hơn 0đ';
    if (!formData.thumbnail.trim()) err.thumbnail = 'Vui lòng nhập đường dẫn ảnh Cloudinary';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Đảm bảo thumbnail luôn có trong images
    let finalImages = [...formData.images];
    if (formData.thumbnail && !finalImages.includes(formData.thumbnail)) {
      finalImages.unshift(formData.thumbnail);
    }

    const payload = {
      ...formData,
      images: finalImages
    };

    if (editingProduct) {
      onSave({ ...payload, id: editingProduct.id });
    } else {
      onSave(payload);
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== idx)
    }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        keyIngredients: [...(prev.keyIngredients || []), newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      keyIngredients: (prev.keyIngredients || []).filter((_, i) => i !== idx)
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Mới Sản Phẩm Vào Kho'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Điền các thông số cơ bản, giá bán, biến thể và hình ảnh Cloudinary
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Nhóm 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Định danh & Phân loại
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên sản phẩm */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên sản phẩm <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Kem Dưỡng Ẩm Chuyên Sâu Cetaphil..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-rose-500'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã SKU / Barcode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ví dụ: CTP-CRM-566"
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none transition-colors ${
                    errors.sku ? 'border-rose-400' : 'border-slate-300 focus:border-rose-500'
                  }`}
                />
                {errors.sku && <p className="text-[11px] text-rose-500 mt-1">{errors.sku}</p>}
              </div>

              {/* Slug URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="kem-duong-am-cetaphil"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục chính
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  {/* Option tự thêm nếu không trùng */}
                  {formData.category && !categories.some((c) => c.name === formData.category) && (
                    <option value={formData.category}>{formData.category}</option>
                  )}
                </select>
              </div>

              {/* Thương hiệu */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thương hiệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ví dụ: La Roche-Posay, Cetaphil, Innisfree..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none transition-colors ${
                    errors.brand ? 'border-rose-400' : 'border-slate-300 focus:border-rose-500'
                  }`}
                />
                {errors.brand && <p className="text-[11px] text-rose-500 mt-1">{errors.brand}</p>}
              </div>
            </div>
          </div>

          {/* Nhóm 2: Giá & Biến thể & Tồn kho */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Giá bán, Dung tích / Biến thể & Tồn kho
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Giá bán lẻ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giá bán hiện tại (₫) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none transition-colors ${
                    errors.price ? 'border-rose-400' : 'border-slate-300 focus:border-rose-500'
                  }`}
                />
                {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
              </div>

              {/* Giá niêm yết (gốc) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giá gốc niêm yết (₫)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Dung tích / Biến thể */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dung tích / Biến thể
                </label>
                <input
                  type="text"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Ví dụ: 50ml, 100ml, 566g, Màu #01"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Trạng thái kho hàng */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <input
                type="checkbox"
                id="inStockCheck"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="inStockCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Đang có sẵn hàng trong kho (cho phép khách đặt online & bán tại quầy)
              </label>
            </div>
          </div>

          {/* Nhóm 3: Hình ảnh Cloudinary */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Image size={15} /> 3. Quản lý Ảnh Cloudinary
              </h3>
              <span className="text-[11px] text-slate-400">Cloud: hb22fnuq</span>
            </div>

            {/* Ảnh đại diện (Thumbnail) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div className="md:col-span-3 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Ảnh đại diện chính (Thumbnail path hoặc link online) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="Ví dụ: cham-soc-toc-ca-nhan/cetaphil/duong-am/hu-kem-duong-am-2.jpg hoặc https://..."
                  className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none transition-colors ${
                    errors.thumbnail ? 'border-rose-400' : 'border-slate-300 focus:border-rose-500'
                  }`}
                />
                {errors.thumbnail && <p className="text-[11px] text-rose-500">{errors.thumbnail}</p>}
                <p className="text-[11px] text-slate-400">
                  Nhập đường dẫn tương đối trên Cloudinary hoặc URL ảnh HTTPS đầy đủ.
                </p>
              </div>

              {/* Preview Thumbnail */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-medium mb-1">Xem trước</span>
                <div className="w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shadow-xs">
                  {formData.thumbnail ? (
                    <img
                      src={getImageUrl(formData.thumbnail, { width: 100, height: 100, crop: 'fill' })}
                      alt="Thumbnail preview"
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/100x100?text=No+Img';
                      }}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center px-1">Chưa có ảnh</span>
                  )}
                </div>
              </div>
            </div>

            {/* Ảnh phụ (Gallery images) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Thư viện ảnh chi tiết (Images Gallery)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Nhập đường dẫn ảnh phụ Cloudinary..."
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Thêm ảnh
                </button>
              </div>

              {/* Danh sách ảnh phụ */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-50 aspect-square flex items-center justify-center p-1"
                    >
                      <img
                        src={getImageUrl(img, { width: 80, height: 80, crop: 'fill' })}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/80x80?text=Img';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Xoá ảnh này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nhóm 4: Mô tả & Công dụng & Thành phần */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              4. Mô tả & Chi tiết sản phẩm
            </h3>

            {/* Mô tả tóm tắt */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập thông tin tổng quan, đặc điểm nổi bật của mỹ phẩm..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500 leading-relaxed"
              ></textarea>
            </div>

            {/* Công dụng (Benefits) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Công dụng chính</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Thêm một công dụng (Ví dụ: Cấp ẩm 48h, kiềm dầu...)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(formData.benefits || []).map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(i)}
                      className="text-rose-400 hover:text-rose-700 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Thành phần chính */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thành phần hoạt chất nổi bật
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Ví dụ: Niacinamide, BHA 2%, Vitamin C, Ceramide..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addIngredient();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(formData.keyIngredients || []).map((ing, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-cyan-50 text-cyan-700 border border-cyan-200"
                  >
                    <span>{ing}</span>
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="text-cyan-400 hover:text-cyan-700 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hướng dẫn sử dụng
              </label>
              <textarea
                rows={2}
                value={formData.usage || ''}
                onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                placeholder="Ví dụ: Sau bước toner, lấy 3-4 giọt thoa đều lên mặt..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>
          </div>

          {/* Form Footer Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={16} />
              <span>{editingProduct ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
