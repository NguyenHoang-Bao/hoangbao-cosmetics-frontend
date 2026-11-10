import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Tag
} from 'lucide-react';
import { adminService, type CategoryItem, type ProductItem } from '@/services/adminService';

interface CategoryManagementProps {
  categories: CategoryItem[];
  products: ProductItem[];
  onRefresh: () => void;
}

export default function CategoryManagement({
  categories,
  products,
  onRefresh
}: CategoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    slug: '',
    description: '',
    banner: '',
    featured: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      banner: '',
      featured: false
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      banner: category.banner,
      featured: category.featured ?? false
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingCategory ? adminService.createSlug(val) : prev.slug
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Vui lòng nhập tên danh mục' });
      return;
    }

    if (editingCategory) {
      await adminService.updateCategory(editingCategory.id, formData);
    } else {
      await adminService.createCategory(formData);
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: number | string) => {
    await adminService.deleteCategory(id);
    setDeleteConfirmId(null);
    onRefresh();
  };

  const getProductCountByCategory = (categoryName: string) => {
    return products.filter(
      (p) => p.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-2 text-xs text-[#333] font-sans">
      {/* THANH ĐIỀU KHIỂN & TÌM KIẾM ĐƠN GIẢN */}
      <div className="bg-white p-2.5 border border-[#ccc] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục theo tên, slug..."
              className="w-full h-8 pl-8 pr-3 text-xs border border-[#ccc] bg-white focus:outline-none"
            />
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
          </div>
          <span className="text-[11px] text-gray-500 whitespace-nowrap">
            Tổng: <strong>{categories.length}</strong> danh mục
          </span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="h-8 px-3 text-xs bg-[#f4f4f4] hover:bg-[#e6e6e6] text-[#333] border border-[#ccc] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={13} />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* BẢNG DANH MỤC DẠNG TABLE TỐI GIẢN */}
      <div className="bg-white border border-[#ccc] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white border-b border-[#ccc] text-[#555]">
              <th className="py-2 px-2.5 font-normal border-r border-[#eee] w-12 text-center">STT</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Tên danh mục</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Đường dẫn (Slug)</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee] text-center w-28">Số lượng SP</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee]">Mô tả tóm tắt</th>
              <th className="py-2 px-2.5 font-normal border-r border-[#eee] text-center w-24">Trạng thái</th>
              <th className="py-2 px-2.5 font-normal text-right w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee]">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => {
                const productCount = getProductCountByCategory(category.name);

                return (
                  <tr key={category.id} className="hover:bg-[#f9f9f9]">
                    {/* STT */}
                    <td className="py-2 px-2.5 text-center text-gray-400 font-mono text-[11px] border-r border-[#eee]">
                      {index + 1}
                    </td>

                    {/* Tên danh mục */}
                    <td className="py-2 px-2.5 font-bold text-slate-800 border-r border-[#eee] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} className="text-[#3c8dbc]" />
                        <span>{category.name}</span>
                        {category.featured && (
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-2 px-2.5 font-mono text-[11px] text-gray-600 border-r border-[#eee] whitespace-nowrap">
                      /{category.slug}
                    </td>

                    {/* Số lượng sản phẩm */}
                    <td className="py-2 px-2.5 text-center border-r border-[#eee] whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">
                        {productCount} sản phẩm
                      </span>
                    </td>

                    {/* Mô tả */}
                    <td className="py-2 px-2.5 text-gray-500 border-r border-[#eee] max-w-xs">
                      <span className="line-clamp-1" title={category.description}>
                        {category.description || '—'}
                      </span>
                    </td>

                    {/* Trạng thái hiển thị */}
                    <td className="py-2 px-2.5 text-center border-r border-[#eee] whitespace-nowrap">
                      {category.featured ? (
                        <span className="text-emerald-700 font-medium text-[11px]">Trang chủ</span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Tiêu chuẩn</span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/products?cat=${encodeURIComponent(category.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                          title="Xem trên website"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-1 text-gray-500 hover:text-blue-600 cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(category.id)}
                          className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  Không tìm thấy danh mục nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM / SỬA GỌN NHẸ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans text-xs text-[#333]">
          <div className="bg-white w-full max-w-md border border-[#999] shadow-xl">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd] flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-800">
                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Mới Danh Mục'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888] hover:text-[#000] font-bold text-sm px-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-3.5 space-y-3">
              <div>
                <label className="block mb-1 font-medium">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Chăm sóc da, Son môi..."
                  className={`w-full h-8 px-2 border text-xs bg-white focus:outline-none ${
                    errors.name ? 'border-red-500' : 'border-[#ccc]'
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-[11px] mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Đường dẫn Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="cham-soc-da"
                  className="w-full h-8 px-2 font-mono border border-[#ccc] bg-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về nhóm mỹ phẩm này..."
                  className="w-full p-2 border border-[#ccc] bg-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="cursor-pointer select-none font-medium">
                  Đánh dấu là Danh mục nổi bật (hiển thị trang chủ)
                </label>
              </div>

              <div className="pt-3 border-t border-[#eee] flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-[#ccc] hover:bg-[#f5f5f5] cursor-pointer text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white font-medium cursor-pointer text-xs"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA GỌN GÀNG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans text-xs text-[#333]">
          <div className="bg-white w-full max-w-xs border border-[#999] shadow-xl p-4 space-y-3">
            <h4 className="font-bold text-sm text-red-600">Xác nhận xóa danh mục?</h4>
            <p className="text-gray-600">
              Danh mục này sẽ bị xóa khỏi hệ thống. Các sản phẩm liên quan sẽ chuyển về chưa phân loại.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eee]">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1 bg-white border border-[#ccc] hover:bg-slate-100 cursor-pointer text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer text-xs"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
