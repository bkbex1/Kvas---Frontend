import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend, apiUploadImage, toImageSrc } from '@/lib/api';

type Ingredient = { name: string; quantity: string; unit: string };
type RecipeStep = { text: string; image?: string };
type RecipeForm = {
  title: string;
  category: string;
  difficulty: string;
  prepTime: string;
  bakingTime: string;
  totalTime: string;
  servings: string;
  description: string;
  imgQuery: string;
  tips: string;
  tags: string;
  linkedProductIds: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
};

const EMPTY_FORM: RecipeForm = {
  title: '',
  category: 'bread',
  difficulty: 'Лесно',
  prepTime: '',
  bakingTime: '',
  totalTime: '',
  servings: '',
  description: '',
  imgQuery: '',
  tips: '',
  tags: '',
  linkedProductIds: '',
  ingredients: [{ name: '', quantity: '', unit: 'гр' }],
  steps: [{ text: '', image: '' }],
};

export default function RecipesSection() {
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<RecipeForm>(EMPTY_FORM);
  const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);

  const loadRecipes = () => {
    apiGet<any>('/api/admin/content/recipes')
      .then((data) => setRecipeList(Array.isArray(data.recipes) ? data.recipes : []))
      .catch(() => setRecipeList([]));
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const filtered = useMemo(
    () => recipeList.filter((r) => `${r.title || ''} ${r.category || ''}`.toLowerCase().includes(search.toLowerCase())),
    [recipeList, search],
  );

  const openCreate = () => {
    setEditingRecipe(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (recipe: any) => {
    setEditingRecipe(recipe);
    setForm({
      title: recipe.title || '',
      category: recipe.category || 'bread',
      difficulty: recipe.difficulty || 'Лесно',
      prepTime: recipe.prepTime || '',
      bakingTime: recipe.bakingTime || '',
      totalTime: recipe.totalTime || '',
      servings: recipe.servings || '',
      description: recipe.description || '',
      imgQuery: recipe.imgQuery || '',
      tips: recipe.tips || '',
      tags: Array.isArray(recipe.tags) ? recipe.tags.join(', ') : '',
      linkedProductIds: Array.isArray(recipe.linkedProductIds) ? recipe.linkedProductIds.join(',') : '',
      ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
        ? recipe.ingredients.map((ing: any) => ({
            name: ing.name || '',
            quantity: ing.quantity || (typeof ing.amount === 'string' ? ing.amount.split(' ')[0] : ''),
            unit: ing.unit || (typeof ing.amount === 'string' ? ing.amount.split(' ').slice(1).join(' ') : 'гр'),
          }))
        : [{ name: '', quantity: '', unit: 'гр' }],
      steps: Array.isArray(recipe.steps) && recipe.steps.length > 0
        ? recipe.steps.map((step: any) => typeof step === 'string' ? ({ text: step, image: '' }) : ({ text: step.text || '', image: step.image || '' }))
        : [{ text: '', image: '' }],
    });
    setShowModal(true);
  };

  const uploadRecipeImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiUploadImage('/api/admin/media/upload-image', file);
      setForm(prev => ({ ...prev, imgQuery: res.url }));
    } finally {
      setUploading(false);
    }
  };

  const uploadStepImage = async (index: number, file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiUploadImage('/api/admin/media/upload-image', file);
      setForm(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => idx === index ? { ...step, image: res.url } : step),
      }));
    } finally {
      setUploading(false);
    }
  };

  const saveRecipe = async () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title,
      category: form.category,
      difficulty: form.difficulty,
      prepTime: form.prepTime,
      bakingTime: form.bakingTime,
      totalTime: form.totalTime,
      servings: form.servings,
      description: form.description,
      imgQuery: form.imgQuery,
      tips: form.tips,
      tags: form.tags.split(',').map(x => x.trim()).filter(Boolean),
      linkedProductIds: form.linkedProductIds.split(',').map(x => Number(x.trim())).filter(Number.isFinite),
      ingredients: form.ingredients.filter(i => i.name.trim()).map(i => ({
        name: i.name.trim(),
        quantity: i.quantity.trim(),
        unit: i.unit.trim(),
        amount: `${i.quantity.trim()} ${i.unit.trim()}`.trim(),
      })),
      steps: form.steps.filter(s => s.text.trim() || (s.image || '').trim()).map(s => ({ text: s.text.trim(), image: (s.image || '').trim() })),
    };

    if (editingRecipe) {
      await apiSend(`/api/admin/content/recipes/${editingRecipe.id}`, 'PUT', payload);
    } else {
      await apiSend('/api/admin/content/recipes', 'POST', payload);
    }
    setShowModal(false);
    setEditingRecipe(null);
    loadRecipes();
  };

  const deleteRecipe = async (id: number) => {
    await apiSend(`/api/admin/content/recipes/${id}`, 'DELETE');
    loadRecipes();
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= form.steps.length) {
      return;
    }
    setForm(prev => {
      const nextSteps = [...prev.steps];
      const [moved] = nextSteps.splice(fromIndex, 1);
      nextSteps.splice(toIndex, 0, moved);
      return { ...prev, steps: nextSteps };
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Рецепти</h2>
          <p className="text-gray-600 mt-1">Създаване и редакция на рецепти</p>
        </div>
        <button onClick={openCreate} className="px-5 py-2.5 bg-[#2C1810] text-white rounded-xl hover:bg-[#3D2415]">
          <i className="ri-add-line mr-1"></i> Нова рецепта
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Търси по заглавие/категория..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Рецепта</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Категория</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Трудност</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Общо време</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Порции</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((recipe) => (
                <tr key={recipe.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#2C1810] text-sm">{recipe.title}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{recipe.category}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{recipe.difficulty}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{recipe.totalTime}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{recipe.servings}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(recipe)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">Редакция</button>
                      <button onClick={() => void deleteRecipe(recipe.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Изтрий</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">{editingRecipe ? 'Редакция на рецепта' : 'Нова рецепта'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Заглавие</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Трудност</label>
                <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm">
                  <option>Лесно</option><option>Средно</option><option>Напреднали</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Подготовка</label><input value={form.prepTime} onChange={e => setForm(p => ({ ...p, prepTime: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Печене</label><input value={form.bakingTime} onChange={e => setForm(p => ({ ...p, bakingTime: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Общо време</label><input value={form.totalTime} onChange={e => setForm(p => ({ ...p, totalTime: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Порции</label><input value={form.servings} onChange={e => setForm(p => ({ ...p, servings: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" /></div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Основна снимка (линк или /uploads/...)</label>
                <input value={form.imgQuery} onChange={e => setForm(p => ({ ...p, imgQuery: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                <input type="file" accept="image/*" onChange={e => void uploadRecipeImage(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-gray-600" />
                {form.imgQuery && <img src={toImageSrc(form.imgQuery, form.title)} alt="" className="mt-2 w-full h-44 object-cover rounded-xl border border-gray-200" />}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Описание</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none" />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#2C1810]">Съставки</h4>
                <button onClick={() => setForm(p => ({ ...p, ingredients: [...p.ingredients, { name: '', quantity: '', unit: 'гр' }] }))} className="text-sm text-blue-700">+ Добави съставка</button>
              </div>
              <div className="space-y-2">
                {form.ingredients.map((ing, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <input value={ing.name} onChange={e => setForm(p => ({ ...p, ingredients: p.ingredients.map((x, i) => i === idx ? { ...x, name: e.target.value } : x) }))} placeholder="Име" className="col-span-6 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <input value={ing.quantity} onChange={e => setForm(p => ({ ...p, ingredients: p.ingredients.map((x, i) => i === idx ? { ...x, quantity: e.target.value } : x) }))} placeholder="Количество" className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <input value={ing.unit} onChange={e => setForm(p => ({ ...p, ingredients: p.ingredients.map((x, i) => i === idx ? { ...x, unit: e.target.value } : x) }))} placeholder="Ед. (гр, мл, бр)" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <button onClick={() => setForm(p => ({ ...p, ingredients: p.ingredients.filter((_, i) => i !== idx) }))} className="col-span-1 text-red-600">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#2C1810]">Процес (стъпки)</h4>
                <button onClick={() => setForm(p => ({ ...p, steps: [...p.steps, { text: '', image: '' }] }))} className="text-sm text-blue-700">+ Добави стъпка</button>
              </div>
              <div className="space-y-4">
                {form.steps.map((step, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={() => setDraggedStepIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedStepIndex != null) {
                        moveStep(draggedStepIndex, idx);
                      }
                      setDraggedStepIndex(null);
                    }}
                    onDragEnd={() => setDraggedStepIndex(null)}
                    className={`p-3 border rounded-xl ${draggedStepIndex === idx ? 'border-[#C17A3A] bg-[#FFF8ED]' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <i className="ri-draggable text-gray-400"></i>
                        Стъпка {idx + 1}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveStep(idx, idx - 1)}
                          disabled={idx === 0}
                          className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-40"
                          title="Премести нагоре"
                        >
                          <i className="ri-arrow-up-line"></i>
                        </button>
                        <button
                          onClick={() => moveStep(idx, idx + 1)}
                          disabled={idx === form.steps.length - 1}
                          className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-40"
                          title="Премести надолу"
                        >
                          <i className="ri-arrow-down-line"></i>
                        </button>
                        <button onClick={() => setForm(p => ({ ...p, steps: p.steps.filter((_, i) => i !== idx) }))} className="text-xs text-red-600 hover:text-red-700">
                          Изтрий
                        </button>
                      </div>
                    </div>
                    <textarea value={step.text} onChange={e => setForm(p => ({ ...p, steps: p.steps.map((x, i) => i === idx ? { ...x, text: e.target.value } : x) }))} rows={2} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    <input value={step.image || ''} onChange={e => setForm(p => ({ ...p, steps: p.steps.map((x, i) => i === idx ? { ...x, image: e.target.value } : x) }))} placeholder="Линк към снимка или /uploads/..." className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <input type="file" accept="image/*" onChange={e => void uploadStepImage(idx, e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-gray-600" />
                    {step.image && <img src={toImageSrc(step.image, form.title)} alt="" className="mt-2 w-full h-40 object-cover rounded-lg border border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium mb-1">Тагове (със запетая)</label>
                <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Свързани продукти (ID,ID)</label>
                <input value={form.linkedProductIds} onChange={e => setForm(p => ({ ...p, linkedProductIds: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Съвет</label>
                <textarea value={form.tips} onChange={e => setForm(p => ({ ...p, tips: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium">Отказ</button>
              <button onClick={() => void saveRecipe()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium">Запази</button>
            </div>
            {uploading && <p className="text-xs text-gray-500 mt-2">Качване на изображение...</p>}
          </div>
        </div>
      )}
    </div>
  );
}
