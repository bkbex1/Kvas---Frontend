import { useState, useMemo, useEffect } from 'react';
import { categories, type Product } from '@/mocks/products';
import { apiGet, apiSend, apiUploadImage, normalizeProduct, toImageSrc, type PageResponse } from '@/lib/api';

const CATEGORY_OPTIONS = categories.filter(c => c.id !== 'all');

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const perPage = 25;

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'tools',
    categoryLabel: 'Инструменти',
    price: '',
    oldPrice: '',
    badge: '',
    stock: '',
    desc: '',
    description: '',
    imgQuery: '',
    images: [] as string[],
    limited: false,
    rating: 4.5,
    reviewCount: 0,
    specs: {} as Record<string, string>,
    features: [] as string[],
  });

  const loadProducts = (page: number) => {
    apiGet<PageResponse<any>>(`/api/admin/products?page=${page}&size=${perPage}&sort=name,asc`)
      .then((data) => {
        setProducts((Array.isArray(data?.content) ? data.content : []).map(normalizeProduct) as Product[]);
        setCurrentPage(Number(data?.number || 0));
        setTotalPages(Math.max(1, Number(data?.totalPages || 1)));
        setTotalElements(Number(data?.totalElements || 0));
      })
      .catch(() => {
        setProducts([]);
        setCurrentPage(0);
        setTotalPages(1);
        setTotalElements(0);
      });
  };

  useEffect(() => {
    loadProducts(0);
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, filterCategory]);

  const handleDelete = async (id: number) => {
    await apiSend<void>(`/api/admin/products/${id}`, 'DELETE');
    loadProducts(currentPage);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    const saved = await apiSend<any>(`/api/admin/products/${editingProduct.id}`, 'PUT', editingProduct);
    const normalized = normalizeProduct(saved) as Product;
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? normalized : p));
    setEditingProduct(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    const catLabel = categories.find(c => c.id === newProduct.category)?.name || 'Инструменти';
    const id = Math.max(...products.map(p => p.id), 0) + 1;
    const product: Product = {
      id,
      name: newProduct.name,
      category: newProduct.category,
      categoryLabel: catLabel,
      desc: newProduct.desc,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : undefined,
      badge: newProduct.badge || undefined,
      stock: parseInt(newProduct.stock) || 0,
      limited: newProduct.limited,
      rating: newProduct.rating,
      reviewCount: newProduct.reviewCount,
      imgQuery: newProduct.imgQuery || 'artisan baking product studio photography clean white background',
      images: (newProduct.images.length > 0 ? newProduct.images : [newProduct.imgQuery]).filter(Boolean),
      specs: newProduct.specs,
      features: newProduct.features,
    };
    const saved = await apiSend<any>('/api/admin/products', 'POST', product);
    const normalized = normalizeProduct(saved) as Product;
    setProducts(prev => [...prev, normalized]);
    setShowAddModal(false);
    setNewProduct({
      name: '', category: 'tools', categoryLabel: 'Инструменти',
      price: '', oldPrice: '', badge: '', stock: '', desc: '', description: '',
      imgQuery: '', images: [], limited: false, rating: 4.5, reviewCount: 0, specs: {}, features: [],
    });
    loadProducts(0);
  };

  const handleUploadNewProductImage = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      setNewProduct(prev => ({
        ...prev,
        imgQuery: prev.imgQuery || response.url,
        images: [...prev.images, response.url],
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadEditProductImage = async (file: File | null) => {
    if (!file || !editingProduct) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      setEditingProduct(prev => prev ? {
        ...prev,
        imgQuery: prev.imgQuery || response.url,
        images: [...(Array.isArray((prev as any).images) ? (prev as any).images : []), response.url],
      } : null);
    } finally {
      setUploadingImage(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      tools: 'bg-amber-100 text-amber-800',
      equipment: 'bg-sky-100 text-sky-800',
      flour: 'bg-green-100 text-green-800',
      kits: 'bg-rose-100 text-rose-800',
    };
    return map[cat] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Продукти</h2>
          <p className="text-gray-600">Управление на продуктовия каталог</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <i className="ri-add-line"></i>
          Добави Продукт
        </button>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <i className="ri-checkbox-circle-line"></i>
          Промените са запазени успешно!
        </div>
      )}

      <div className="bg-white rounded-xl p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              placeholder="Търси продукт..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(0); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setFilterCategory(cat.id); setCurrentPage(0); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${filterCategory === cat.id ? 'bg-[#2C1810] text-white' : 'bg-[#F5F1EB] text-[#2C1810] hover:bg-[#EBE5DD]'}`}
              >
                <i className={`${cat.icon} mr-1`}></i>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Продукт</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Категория</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Цена</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Наличност</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Badge</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={toImageSrc((product as any).images?.[0] || product.imgQuery, product.name)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-[#2C1810] text-sm">{product.name}</span>
                        <p className="text-xs text-gray-400">{product.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                      {product.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-medium text-sm">{product.price.toFixed(2)} лв</span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">{product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : product.stock < 20 ? 'text-amber-600' : 'text-green-600'}`}>
                      {product.stock} бр
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.badge ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#D4AF37]/20 text-[#8B6914]">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingProduct({ ...product })}
                        className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        title="Редактирай"
                      >
                        <i className="ri-edit-line text-gray-600"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Изтрий"
                      >
                        <i className="ri-delete-bin-line text-red-500"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Показани {filtered.length} от {totalElements} продукта
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadProducts(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600 whitespace-nowrap">Страница {currentPage + 1} от {totalPages}</span>
            <button
              onClick={() => loadProducts(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактирай Продукт</h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={toImageSrc((editingProduct as any).images?.[0] || editingProduct.imgQuery, editingProduct.name)}
                    alt={editingProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Снимка (URL или upload)</label>
                  <textarea
                    rows={3}
                    value={editingProduct.imgQuery}
                    maxLength={500}
                    onChange={e => setEditingProduct(prev => prev ? { ...prev, imgQuery: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                  />
                  <textarea
                    rows={3}
                    value={Array.isArray((editingProduct as any).images) ? (editingProduct as any).images.join('\n') : ''}
                    onChange={e => setEditingProduct(prev => prev ? ({ ...prev, images: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) } as any) : null)}
                    placeholder="По един image URL на ред"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => Array.from(e.target.files || []).forEach(file => void handleUploadEditProductImage(file))}
                    className="mt-2 block w-full text-sm text-gray-600"
                  />
                  {uploadingImage && <p className="text-xs text-gray-500 mt-1">Качване на снимка...</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Кратко описание</label>
                <input
                  type="text"
                  value={editingProduct.desc}
                  onChange={e => setEditingProduct(prev => prev ? { ...prev, desc: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => {
                      const catLabel = categories.find(c => c.id === e.target.value)?.name || '';
                      setEditingProduct(prev => prev ? { ...prev, category: e.target.value, categoryLabel: catLabel } : null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  >
                    {CATEGORY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge (незадължително)</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={e => setEditingProduct(prev => prev ? { ...prev, badge: e.target.value } : null)}
                    placeholder="Хит, Ново, Промоция..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена (лв)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Стара цена (незадълж.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.oldPrice || ''}
                    onChange={e => setEditingProduct(prev => prev ? { ...prev, oldPrice: parseFloat(e.target.value) || undefined } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Наличност</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Пълно описание</label>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={editingProduct.description}
                  onChange={e => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="limitedCheck"
                  checked={editingProduct.limited}
                  onChange={e => setEditingProduct(prev => prev ? { ...prev, limited: e.target.checked } : null)}
                  className="rounded"
                />
                <label htmlFor="limitedCheck" className="text-sm text-gray-700 cursor-pointer">Ограничено количество</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm">Отказ</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm">Запази Промените</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Добави Нов Продукт</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Кратко описание</label>
                <input
                  type="text"
                  value={newProduct.desc}
                  onChange={e => setNewProduct(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  >
                    {CATEGORY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge (незадължително)</label>
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={e => setNewProduct(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="Хит, Ново..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена (лв) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Стара цена</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.oldPrice}
                    onChange={e => setNewProduct(prev => ({ ...prev, oldPrice: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Наличност</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Снимка (URL или upload)</label>
                <input
                  type="text"
                  value={newProduct.imgQuery}
                  onChange={e => setNewProduct(prev => ({ ...prev, imgQuery: e.target.value }))}
                  placeholder="artisan baking tool studio photography white background..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
                <textarea
                  rows={3}
                  value={newProduct.images.join('\n')}
                  onChange={e => setNewProduct(prev => ({ ...prev, images: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) }))}
                  placeholder="По един image URL на ред"
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => Array.from(e.target.files || []).forEach(file => void handleUploadNewProductImage(file))}
                  className="mt-2 block w-full text-sm text-gray-600"
                />
                {uploadingImage && <p className="text-xs text-gray-500 mt-1">Качване на снимка...</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Пълно описание</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={newProduct.description}
                  onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm">Отказ</button>
              <button onClick={handleAddProduct} className="flex-1 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm">Добави Продукт</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
