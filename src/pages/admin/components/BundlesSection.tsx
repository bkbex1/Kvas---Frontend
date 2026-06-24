import { useEffect, useState } from 'react';
import { apiGet, apiSend, apiUploadImage, toImageSrc } from '@/lib/api';

type Bundle = any;
type BundleItem = any;

export default function BundlesSection() {
  const [bundleList, setBundleList] = useState<Bundle[]>([]);
  const [editing, setEditing] = useState<Bundle | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newBundle, setNewBundle] = useState<Partial<Bundle>>({
    name: '', subtitle: '', price: 0, oldPrice: 0, badge: '', highlight: '', color: '#F5C842', imgQuery: '', items: []
  });

  const loadBundles = () => {
    apiGet<any>('/api/admin/content/bundles')
      .then((data) => setBundleList(Array.isArray(data.bundles) ? data.bundles : []))
      .catch(() => setBundleList([]));
  };

  useEffect(() => {
    loadBundles();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    await apiSend(`/api/admin/content/bundles/${editing.id}`, 'PUT', editing);
    setEditing(null);
    loadBundles();
  };

  const handleAdd = async () => {
    const bundle: Bundle = { ...newBundle as Bundle, imgQuery: newBundle.imgQuery || 'sourdough baking kit tools arrangement warm studio' };
    await apiSend('/api/admin/content/bundles', 'POST', bundle);
    setShowAdd(false);
    setNewBundle({ name: '', subtitle: '', price: 0, oldPrice: 0, badge: '', highlight: '', color: '#F5C842', imgQuery: '', items: [] });
    loadBundles();
  };

  const handleDelete = async (id: number) => {
    await apiSend(`/api/admin/content/bundles/${id}`, 'DELETE');
    setDeleteConfirm(null);
    loadBundles();
  };

  const uploadNewBundleImage = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      setNewBundle(prev => ({ ...prev, imgQuery: response.url }));
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadEditingBundleImage = async (file: File | null) => {
    if (!file || !editing) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      setEditing(prev => prev ? ({ ...prev, imgQuery: response.url }) : null);
    } finally {
      setUploadingImage(false);
    }
  };

  const addItemToEditing = () => {
    if (!editing) return;
    const newItem = { name: '', qty: 1, icon: 'ri-box-3-line' };
    setEditing(p => p ? ({ ...p, items: p.items.concat([newItem]) }) : null);
  };

  const removeItemFromEditing = (idx: number) => {
    if (!editing) return;
    setEditing(p => p ? ({ ...p, items: p.items.filter((item, i) => i !== idx) }) : null);
  };

  const updateEditingItem = (idx: number, field: keyof BundleItem, value: string | number) => {
    if (!editing) return;
    setEditing(p => p ? ({
      ...p,
      items: p.items.map((item, i) => {
        if (i !== idx) return item;
        return { name: field === 'name' ? String(value) : item.name, qty: field === 'qty' ? Number(value) : item.qty, icon: item.icon };
      })
    }) : null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Комплекти</h2>
          <p className="text-gray-600 mt-1">Управление на готови комплекти и bundles</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white rounded-xl font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          Нов Комплект
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bundleList.map(bundle => (
          <div key={bundle.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="relative h-48">
              <img
                src={toImageSrc(bundle.imgQuery, bundle.name)}
                alt={bundle.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white mb-1"
                    style={{ backgroundColor: bundle.color }}>
                    {bundle.badge}
                  </span>
                  <h3 className="font-bold text-white text-lg leading-tight">{bundle.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{bundle.price.toFixed(2)} лв</p>
                  <p className="text-xs text-gray-300 line-through">{bundle.oldPrice.toFixed(2)} лв</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">{bundle.subtitle}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {bundle.items.slice(0, 4).map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                    <i className={`${item.icon} text-xs`}></i>
                    {item.name}
                  </span>
                ))}
                {bundle.items.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">+{bundle.items.length - 4} още</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing({ ...bundle, items: bundle.items.map(bi => ({ name: bi.name, qty: bi.qty, icon: bi.icon })) })}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line"></i>
                  Редактирай
                </button>
                <button
                  onClick={() => setDeleteConfirm(bundle.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактиране: {editing.name}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование</label>
                <input value={editing.name} onChange={e => setEditing(p => p ? ({ ...p, name: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Подзаглавие</label>
                <input value={editing.subtitle} onChange={e => setEditing(p => p ? ({ ...p, subtitle: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={editing.price} onChange={e => setEditing(p => p ? ({ ...p, price: parseFloat(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Стара цена (лв)</label>
                <input type="number" value={editing.oldPrice} onChange={e => setEditing(p => p ? ({ ...p, oldPrice: parseFloat(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <input value={editing.badge} onChange={e => setEditing(p => p ? ({ ...p, badge: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlight текст</label>
                <input value={editing.highlight} onChange={e => setEditing(p => p ? ({ ...p, highlight: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Корица (URL или /uploads/...)</label>
                <input value={editing.imgQuery || ''} onChange={e => setEditing(p => p ? ({ ...p, imgQuery: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadEditingBundleImage(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-gray-600" />
                {editing.imgQuery && <img src={toImageSrc(editing.imgQuery, editing.name)} alt="" className="mt-2 w-full h-40 object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>

            {/* Items Editor */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">Съдържание на комплекта</label>
                <button onClick={addItemToEditing} className="flex items-center gap-1 px-3 py-1.5 bg-[#2C1810] text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">
                  <i className="ri-add-line"></i>
                  Добави артикул
                </button>
              </div>
              <div className="space-y-2">
                {editing.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <input
                      value={item.name}
                      onChange={e => updateEditingItem(idx, 'name', e.target.value)}
                      placeholder="Наименование"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2C1810]"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={e => updateEditingItem(idx, 'qty', parseInt(e.target.value))}
                      placeholder="Бр."
                      className="w-16 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2C1810]"
                    />
                    <button onClick={() => removeItemFromEditing(idx)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleSave()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Нов Комплект</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование</label>
                <input value={newBundle.name} onChange={e => setNewBundle(p => ({ ...p, name: e.target.value }))} placeholder="Наименование" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={newBundle.price} onChange={e => setNewBundle(p => ({ ...p, price: parseFloat(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Стара цена (лв)</label>
                <input type="number" value={newBundle.oldPrice} onChange={e => setNewBundle(p => ({ ...p, oldPrice: parseFloat(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <input value={newBundle.badge} onChange={e => setNewBundle(p => ({ ...p, badge: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Подзаглавие</label>
                <input value={newBundle.subtitle} onChange={e => setNewBundle(p => ({ ...p, subtitle: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Корица (URL или /uploads/...)</label>
                <input value={newBundle.imgQuery || ''} onChange={e => setNewBundle(p => ({ ...p, imgQuery: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadNewBundleImage(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-gray-600" />
                {newBundle.imgQuery && <img src={toImageSrc(newBundle.imgQuery, newBundle.name || 'bundle')} alt="" className="mt-2 w-full h-40 object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleAdd()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
              <i className="ri-delete-bin-line text-2xl text-red-600"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-[#2C1810] mb-2">Изтриване на комплект</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Сигурни ли сте, че искате да изтриете този комплект?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleDelete(deleteConfirm)} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap">Изтрий</button>
            </div>
          </div>
        </div>
      )}
      {uploadingImage && <p className="text-xs text-gray-500 mt-3">Качване на изображение...</p>}
    </>
  );
}
