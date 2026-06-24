import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/api';

type MysteryBox = any;
type GiveawayData = any;

export default function GiveawaySection() {
  const [activeTab, setActiveTab] = useState<'giveaway' | 'boxes'>('giveaway');
  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);
  const [boxes, setBoxes] = useState<MysteryBox[]>([]);
  const [editingBox, setEditingBox] = useState<MysteryBox | null>(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newBox, setNewBox] = useState<Omit<MysteryBox, 'id'>>({
    name: '',
    description: '',
    price: 0,
    originalValue: 0,
    items: [''],
    imgQuery: 'artisan sourdough gift mystery box kraft packaging ribbon warm studio photography',
    badge: '',
    available: true,
    stock: 10,
  });

  useEffect(() => {
    apiGet<any>('/api/admin/content/raw/giveaway')
      .then((data) => {
        setGiveaway(data.giveawayData || null);
        setBoxes(Array.isArray(data.mysteryBoxes) ? data.mysteryBoxes : []);
      })
      .catch(() => {
        setGiveaway(null);
        setBoxes([]);
      });
  }, []);

  if (!giveaway) return null;

  const handleSave = () => {
    void apiSend('/api/admin/content/raw/giveaway', 'PUT', {
      giveawayData: giveaway,
      mysteryBoxes: boxes,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteBox = (id: number) => {
    setBoxes(prev => prev.filter(b => b.id !== id));
  };

  const handleSaveBox = () => {
    if (!editingBox) return;
    setBoxes(prev => prev.map(b => b.id === editingBox.id ? editingBox : b));
    setEditingBox(null);
  };

  const handleAddBox = () => {
    if (!newBox.name || !newBox.price) return;
    const id = Math.max(...boxes.map(b => b.id), 0) + 1;
    setBoxes(prev => [...prev, { ...newBox, id }]);
    setShowAddBox(false);
    setNewBox({ name: '', description: '', price: 0, originalValue: 0, items: [''], imgQuery: 'artisan sourdough gift mystery box kraft packaging ribbon warm studio photography', badge: '', available: true, stock: 10 });
  };

  const handleStepChange = (idx: number, value: string) => {
    const updated = [...giveaway.howToParticipate];
    updated[idx] = { ...updated[idx], desc: value };
    setGiveaway(prev => ({ ...prev, howToParticipate: updated }));
  };

  const handleStepLabel = (idx: number, value: string) => {
    const updated = [...giveaway.howToParticipate];
    updated[idx] = { ...updated[idx], step: value };
    setGiveaway(prev => ({ ...prev, howToParticipate: updated }));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Giveaway & Mystery Boxes</h2>
          <p className="text-gray-600">Управление на томболи и изненадващи кутии</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${saved ? 'bg-green-600 text-white' : 'bg-[#2C1810] text-white hover:bg-[#3D2415]'}`}
        >
          <i className={saved ? 'ri-check-line' : 'ri-save-line'}></i>
          {saved ? 'Запазено!' : 'Запази Промените'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#F5F1EB] p-1 rounded-lg w-fit">
        {[
          { key: 'giveaway', label: 'Томбола / Giveaway', icon: 'ri-gift-2-line' },
          { key: 'boxes', label: 'Mystery Boxes', icon: 'ri-box-3-line' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? 'bg-white text-[#2C1810]' : 'text-gray-600 hover:text-[#2C1810]'}`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Giveaway Tab */}
      {activeTab === 'giveaway' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <i className="ri-toggle-line text-[#D4AF37]"></i>
                Статус на Giveaway
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm text-gray-600">{giveaway.activeGiveaway ? 'Активен' : 'Неактивен'}</span>
                <div
                  onClick={() => setGiveaway(prev => ({ ...prev, activeGiveaway: !prev.activeGiveaway }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${giveaway.activeGiveaway ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${giveaway.activeGiveaway ? 'left-7' : 'left-1'}`}></div>
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-500">Когато е активен, giveaway ще се показва на публичната страница.</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <i className="ri-image-line text-[#D4AF37]"></i>
              Hero Секция
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Заглавие</label>
                  <input type="text" value={giveaway.heroTitle} onChange={e => setGiveaway(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Подзаглавие</label>
                  <input type="text" value={giveaway.heroSubtitle} onChange={e => setGiveaway(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea rows={3} maxLength={500} value={giveaway.heroDescription} onChange={e => setGiveaway(prev => ({ ...prev, heroDescription: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <i className="ri-trophy-line text-[#D4AF37]"></i>
              Текуща Томбола
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заглавие на томболата</label>
                <input type="text" value={giveaway.giveawayTitle} onChange={e => setGiveaway(prev => ({ ...prev, giveawayTitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea rows={4} maxLength={500} value={giveaway.giveawayDescription} onChange={e => setGiveaway(prev => ({ ...prev, giveawayDescription: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Награда</label>
                  <input type="text" value={giveaway.giveawayPrize} onChange={e => setGiveaway(prev => ({ ...prev, giveawayPrize: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата на приключване</label>
                  <input type="date" value={giveaway.giveawayEndsAt} onChange={e => setGiveaway(prev => ({ ...prev, giveawayEndsAt: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <i className="ri-list-check text-[#D4AF37]"></i>
              Стъпки за Участие
            </h3>
            <div className="space-y-4">
              {giveaway.howToParticipate.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#2C1810] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input type="text" value={step.step} onChange={e => handleStepLabel(idx, e.target.value)}
                      placeholder="Заглавие"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                    <input type="text" value={step.desc} onChange={e => handleStepChange(idx, e.target.value)}
                      placeholder="Описание"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <i className="ri-file-text-line text-[#D4AF37]"></i>
              Условия за Участие
            </h3>
            <textarea
              rows={5}
              maxLength={500}
              value={giveaway.termsAndConditions}
              onChange={e => setGiveaway(prev => ({ ...prev, termsAndConditions: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
            />
          </div>
        </div>
      )}

      {/* Mystery Boxes Tab */}
      {activeTab === 'boxes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{boxes.length} кутии в каталога</p>
            <button
              onClick={() => setShowAddBox(true)}
              className="px-4 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Добави Кутия
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boxes.map(box => (
              <div key={box.id} className="bg-white rounded-xl overflow-hidden">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28box.imgQuery%29%7D&width=600&height=300&seq=box${box.id}&orientation=landscape`}
                    alt={box.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {box.badge && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-[#D4AF37] text-[#2C1810] text-xs font-bold rounded-full">
                      {box.badge}
                    </span>
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${box.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {box.available ? 'Активна' : 'Неактивна'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-[#2C1810]">{box.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{box.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-[#2C1810]">{box.price.toFixed(2)} лв</p>
                      <p className="text-xs text-gray-400 line-through">{box.originalValue} лв стойност</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Наличност: {box.stock} бр</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBox({ ...box })}
                      className="flex-1 py-1.5 border border-[#2C1810] text-[#2C1810] rounded-lg text-sm hover:bg-[#F5F1EB] cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                    >
                      <i className="ri-edit-line"></i>
                      Редактирай
                    </button>
                    <button
                      onClick={() => handleDeleteBox(box.id)}
                      className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Box Modal */}
      {editingBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактирай Mystery Box</h3>
              <button onClick={() => setEditingBox(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="h-32 rounded-xl overflow-hidden">
                <img src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28editingBox.imgQuery%29%7D&width=600&height=200&seq=editbox${editingBox.id}&orientation=landscape`} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание на снимката (на английски)</label>
                <input type="text" value={editingBox.imgQuery} onChange={e => setEditingBox(prev => prev ? { ...prev, imgQuery: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                <input type="text" value={editingBox.name} onChange={e => setEditingBox(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea rows={3} maxLength={500} value={editingBox.description} onChange={e => setEditingBox(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена (лв)</label>
                  <input type="number" step="0.01" value={editingBox.price} onChange={e => setEditingBox(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Стойност (лв)</label>
                  <input type="number" step="1" value={editingBox.originalValue} onChange={e => setEditingBox(prev => prev ? { ...prev, originalValue: parseInt(e.target.value) } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Наличност</label>
                  <input type="number" value={editingBox.stock} onChange={e => setEditingBox(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge (незадължително)</label>
                  <input type="text" value={editingBox.badge || ''} onChange={e => setEditingBox(prev => prev ? { ...prev, badge: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingBox.available} onChange={e => setEditingBox(prev => prev ? { ...prev, available: e.target.checked } : null)} className="rounded" />
                    <span className="text-sm text-gray-700">Активна / Достъпна</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Съдържание (по един ред)</label>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={editingBox.items.join('\n')}
                  onChange={e => setEditingBox(prev => prev ? { ...prev, items: e.target.value.split('\n') } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingBox(null)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm">Отказ</button>
              <button onClick={handleSaveBox} className="flex-1 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Box Modal */}
      {showAddBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Добави Mystery Box</h3>
              <button onClick={() => setShowAddBox(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название *</label>
                <input type="text" value={newBox.name} onChange={e => setNewBox(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea rows={2} maxLength={500} value={newBox.description} onChange={e => setNewBox(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена (лв) *</label>
                  <input type="number" step="0.01" value={newBox.price || ''} onChange={e => setNewBox(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Стойност (лв)</label>
                  <input type="number" value={newBox.originalValue || ''} onChange={e => setNewBox(prev => ({ ...prev, originalValue: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Наличност</label>
                  <input type="number" value={newBox.stock} onChange={e => setNewBox(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge (незадължително)</label>
                <input type="text" value={newBox.badge || ''} onChange={e => setNewBox(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание на снимката (на английски)</label>
                <input type="text" value={newBox.imgQuery} onChange={e => setNewBox(prev => ({ ...prev, imgQuery: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Съдържание (по един ред)</label>
                <textarea rows={4} maxLength={500} value={newBox.items.join('\n')} onChange={e => setNewBox(prev => ({ ...prev, items: e.target.value.split('\n') }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddBox(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm">Отказ</button>
              <button onClick={handleAddBox} className="flex-1 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm">Добави Кутия</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
