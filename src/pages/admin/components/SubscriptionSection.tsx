import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/api';

type SubscriptionPlan = any;

export default function SubscriptionSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
    id: '', name: '', price: 0, frequency: 'на месец', desc: '', items: [], popular: false, color: '#C17A3A', icon: 'ri-leaf-line',
  });
  const [newItem, setNewItem] = useState('');
  const [editNewItem, setEditNewItem] = useState('');

  useEffect(() => {
    apiGet<any>('/api/admin/content/raw/subscriptions')
      .then((data) => setPlans(Array.isArray(data.subscriptionPlans) ? data.subscriptionPlans : []))
      .catch(() => setPlans([]));
  }, []);

  const persistPlans = async (nextPlans: SubscriptionPlan[]) => {
    await apiSend('/api/admin/content/raw/subscriptions', 'PUT', { subscriptionPlans: nextPlans });
    setPlans(nextPlans);
  };

  const handleSave = () => {
    if (!editing) return;
    const next = plans.map(p => p.id === editing.id ? editing : p);
    void persistPlans(next);
    setEditing(null);
  };

  const handleAdd = () => {
    const plan: SubscriptionPlan = { ...(newPlan as SubscriptionPlan), id: `plan-${Date.now()}` };
    const next = plans.concat([plan]);
    void persistPlans(next);
    setShowAdd(false);
    setNewPlan({ id: '', name: '', price: 0, frequency: 'на месец', desc: '', items: [], popular: false, color: '#C17A3A', icon: 'ri-leaf-line' });
  };

  const handleDelete = (id: string) => {
    const next = plans.filter(p => p.id !== id);
    void persistPlans(next);
    setDeleteConfirm(null);
  };

  const addEditItem = () => {
    if (!editNewItem.trim() || !editing) return;
    setEditing(p => p ? ({ ...p, items: p.items.concat([editNewItem.trim()]) }) : null);
    setEditNewItem('');
  };

  const removeEditItem = (idx: number) => {
    if (!editing) return;
    setEditing(p => p ? ({ ...p, items: p.items.filter((item, i) => i !== idx) }) : null);
  };

  const addNewItem = () => {
    if (!newItem.trim()) return;
    setNewPlan(p => ({ ...p, items: (p.items || []).concat([newItem.trim()]) }));
    setNewItem('');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Абонаментни Планове</h2>
          <p className="text-gray-600 mt-1">Управление на абонаментни пакети и съдържание</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white rounded-xl font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          Нов план
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden relative">
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 py-1.5 text-xs font-bold text-center text-white" style={{ backgroundColor: plan.color }}>
                НАЙ-ПОПУЛЯРЕН
              </div>
            )}
            <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                  <i className={`${plan.icon} text-2xl`} style={{ color: plan.color }}></i>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810] text-lg">{plan.name}</h3>
                  <p className="text-2xl font-bold text-[#2C1810]">{plan.price.toFixed(2)} лв<span className="text-sm font-normal text-gray-500">/{plan.frequency}</span></p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{plan.desc}</p>
              <div className="space-y-1 mb-5">
                {plan.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <i className="ri-check-line text-green-600 mt-0.5 flex-shrink-0"></i>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing({ ...plan })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line"></i>
                  Редактирай
                </button>
                <button
                  onClick={() => setDeleteConfirm(plan.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
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
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактиране: {editing.name}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование на плана</label>
                <input value={editing.name} onChange={e => setEditing(p => p ? ({ ...p, name: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                  <input type="number" value={editing.price} onChange={e => setEditing(p => p ? ({ ...p, price: parseFloat(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Честота</label>
                  <input value={editing.frequency} onChange={e => setEditing(p => p ? ({ ...p, frequency: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={editing.desc} onChange={e => setEditing(p => p ? ({ ...p, desc: e.target.value }) : null)} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Популярен</label>
                <button
                  onClick={() => setEditing(p => p ? ({ ...p, popular: !p.popular }) : null)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${editing.popular ? 'bg-[#2C1810]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editing.popular ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Включени ползи</label>
                <div className="space-y-2 mb-3">
                  {editing.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <i className="ri-check-line text-green-600 text-sm"></i>
                      <span className="flex-1 text-sm text-gray-700">{item}</span>
                      <button onClick={() => removeEditItem(idx)} className="text-red-400 hover:text-red-600 cursor-pointer">
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={editNewItem} onChange={e => setEditNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEditItem()} placeholder="Добави полза..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2C1810]" />
                  <button onClick={addEditItem} className="px-4 py-2 bg-[#2C1810] text-white rounded-xl text-sm cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={handleSave} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Нов Абонаментен План</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование</label>
                <input value={newPlan.name} onChange={e => setNewPlan(p => ({ ...p, name: e.target.value }))} placeholder="Наименование на плана" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                  <input type="number" value={newPlan.price} onChange={e => setNewPlan(p => ({ ...p, price: parseFloat(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Честота</label>
                  <input value={newPlan.frequency} onChange={e => setNewPlan(p => ({ ...p, frequency: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={newPlan.desc} onChange={e => setNewPlan(p => ({ ...p, desc: e.target.value }))} rows={2} placeholder="Описание на плана..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Включени ползи</label>
                <div className="space-y-1 mb-2">
                  {(newPlan.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-700">
                      <i className="ri-check-line text-green-600 text-xs"></i>
                      <span className="flex-1">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNewItem()} placeholder="Добави полза..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2C1810]" />
                  <button onClick={addNewItem} className="px-4 py-2 bg-[#2C1810] text-white rounded-xl text-sm cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави план</button>
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
            <h3 className="text-xl font-bold text-center text-[#2C1810] mb-2">Изтриване на план</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Сигурни ли сте, че искате да изтриете този абонаментен план?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap">Изтрий</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
