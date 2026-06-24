import { useEffect, useState } from 'react';
import { apiGet, apiSend, apiUploadImage, toImageSrc } from '@/lib/api';

interface Voucher {
  id: number;
  amount: number;
  active: boolean;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  date: string;
  duration: string;
  price: number;
  spots: number;
  location: string;
  badge?: string;
  desc: string;
  imgQuery?: string;
}

const initialVouchers: Voucher[] = [
  { id: 1, amount: 30, active: true },
  { id: 2, amount: 50, active: true },
  { id: 3, amount: 100, active: true },
  { id: 4, amount: 150, active: true },
  { id: 5, amount: 200, active: false },
];

const initialCourses: Course[] = [
  { id: 1, title: 'Уикенд Уъркшоп', instructor: 'Мария Стоянова', date: '15 Февруари 2025', duration: '2 дни', price: 149, spots: 12, location: 'София, ул. Граф Игнатиев 23', badge: 'Популярен', desc: 'Практически уъркшоп за квасен хляб от нулата.', imgQuery: 'artisan bread baking weekend workshop' },
  { id: 2, title: 'Masterclass: Декоративен Хляб', instructor: 'Иван Георгиев', date: '22 Февруари 2025', duration: '1 ден', price: 199, spots: 8, location: 'Пловдив, ул. Главна 5', badge: 'Ексклузивен', desc: 'Напреднали техники за декоративни разрези и формиране.', imgQuery: 'professional baker teaching masterclass bread' },
  { id: 3, title: 'Частен Урок', instructor: 'По избор', date: 'По договаряне', duration: '3 часа', price: 250, spots: 1, location: 'При вас или при нас', desc: 'Персонален урок с майстор пекар.', imgQuery: 'private one on one bread baking lesson' },
  { id: 4, title: 'Детски Курс', instructor: 'Мария Стоянова', date: '8 Март 2025', duration: '3 часа', price: 49, spots: 15, location: 'София, ул. Граф Игнатиев 23', badge: 'Семеен', desc: 'Забавен курс за деца и родители.', imgQuery: 'kids family bread baking workshop' },
];

export default function VouchersSection() {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [tab, setTab] = useState<'vouchers' | 'courses'>('vouchers');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newVoucherAmount, setNewVoucherAmount] = useState('');
  const [newCourse, setNewCourse] = useState<Partial<Course>>({ title: '', instructor: '', date: '', duration: '', price: 0, spots: 10, location: '', badge: '', desc: '', imgQuery: '' });

  useEffect(() => {
    apiGet<any>('/api/admin/content/raw/vouchers')
      .then((data) => {
        setVouchers(Array.isArray(data.vouchers) ? data.vouchers : initialVouchers);
        setCourses(Array.isArray(data.courses) ? data.courses : initialCourses);
      })
      .catch(() => undefined);
  }, []);

  const persist = async (nextVouchers: Voucher[], nextCourses: Course[]) => {
    await apiSend('/api/admin/content/raw/vouchers', 'PUT', {
      vouchers: nextVouchers,
      courses: nextCourses,
    });
    setVouchers(nextVouchers);
    setCourses(nextCourses);
  };

  const toggleVoucher = (id: number) => {
    const next = vouchers.map(v => v.id === id ? { ...v, active: !v.active } : v);
    void persist(next, courses);
  };

  const removeVoucher = (id: number) => {
    const next = vouchers.filter(v => v.id !== id);
    void persist(next, courses);
  };

  const addVoucher = () => {
    const amount = parseInt(newVoucherAmount);
    if (!amount || amount <= 0) return;
    const next = vouchers.concat([{ id: Date.now(), amount, active: true }]);
    void persist(next, courses);
    setNewVoucherAmount('');
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    const next = courses.map(c => c.id === editingCourse.id ? editingCourse : c);
    void persist(vouchers, next);
    setEditingCourse(null);
  };

  const handleAddCourse = () => {
    const course: Course = { ...(newCourse as Course), id: Date.now() };
    const next = courses.concat([course]);
    void persist(vouchers, next);
    setShowAddCourse(false);
    setNewCourse({ title: '', instructor: '', date: '', duration: '', price: 0, spots: 10, location: '', badge: '', desc: '', imgQuery: '' });
  };

  const handleDeleteCourse = (id: number) => {
    const next = courses.filter(c => c.id !== id);
    void persist(vouchers, next);
    setDeleteConfirm(null);
  };

  const uploadCourseImage = async (file: File | null, mode: 'new' | 'edit') => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      if (mode === 'new') {
        setNewCourse(prev => ({ ...prev, imgQuery: response.url }));
      } else {
        setEditingCourse(prev => prev ? ({ ...prev, imgQuery: response.url }) : null);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Ваучери & Курсове</h2>
          <p className="text-gray-600 mt-1">Управление на подаръчни ваучери и обучения</p>
        </div>
        {tab === 'courses' && (
          <button
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white rounded-xl font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            Нов Курс
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit border border-gray-200">
        {([{ id: 'vouchers', label: 'Ваучери', icon: 'ri-coupon-line' }, { id: 'courses', label: 'Курсове & Уъркшопи', icon: 'ri-graduation-cap-line' }] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${tab === t.id ? 'bg-[#2C1810] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <i className={t.icon}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* Vouchers */}
      {tab === 'vouchers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-[#2C1810] mb-4">Активни суми на ваучери</h3>
            <div className="space-y-3 mb-5">
              {vouchers.map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#F5EFE6] rounded-lg">
                      <i className="ri-coupon-line text-[#C17A3A] text-xl"></i>
                    </div>
                    <div>
                      <p className="font-bold text-[#2C1810]">{v.amount} лв</p>
                      <p className="text-xs text-gray-500">{v.active ? 'Активен' : 'Деактивиран'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVoucher(v.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${v.active ? 'bg-[#2C1810]' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${v.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                    <button onClick={() => removeVoucher(v.id)} className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer text-red-500">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Нова сума (лв)"
                value={newVoucherAmount}
                onChange={e => setNewVoucherAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addVoucher()}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]"
              />
              <button onClick={addVoucher} className="px-5 py-2.5 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">
                Добави
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-[#2C1810] mb-4">Статистика на ваучерите</h3>
            <div className="space-y-4">
              {[
                { label: 'Продадени ваучери', value: '47', icon: 'ri-coupon-line', color: '#10B981' },
                { label: 'Обща стойност', value: '3,450 лв', icon: 'ri-money-dollar-circle-line', color: '#F59E0B' },
                { label: 'Използвани', value: '32', icon: 'ri-checkbox-circle-line', color: '#3B82F6' },
                { label: 'Изтекли', value: '5', icon: 'ri-time-line', color: '#EF4444' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                    <i className={`${stat.icon} text-xl`} style={{ color: stat.color }}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <span className="font-bold text-[#2C1810]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Courses */}
      {tab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="mb-3 h-36 rounded-xl overflow-hidden bg-gray-100">
                <img src={toImageSrc(course.imgQuery, course.title)} alt={course.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  {course.badge && (
                    <span className="inline-block px-2 py-0.5 bg-[#F5EFE6] text-[#C17A3A] text-xs font-medium rounded-full mb-1">{course.badge}</span>
                  )}
                  <h3 className="font-bold text-[#2C1810] text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{course.instructor}</p>
                </div>
                <p className="text-xl font-bold text-[#2C1810]">{course.price} лв</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.desc}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <i className="ri-calendar-line"></i>
                  {course.date}
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-time-line"></i>
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-map-pin-line"></i>
                  {course.location}
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-group-line"></i>
                  {course.spots} места
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCourse({ ...course })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line"></i>
                  Редактирай
                </button>
                <button
                  onClick={() => setDeleteConfirm(course.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingCourse(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактиране: {editingCourse.title}</h3>
              <button onClick={() => setEditingCourse(null)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input value={editingCourse.title} onChange={e => setEditingCourse(p => p ? ({ ...p, title: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Инструктор</label>
                <input value={editingCourse.instructor} onChange={e => setEditingCourse(p => p ? ({ ...p, instructor: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={editingCourse.price} onChange={e => setEditingCourse(p => p ? ({ ...p, price: parseInt(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                <input value={editingCourse.date} onChange={e => setEditingCourse(p => p ? ({ ...p, date: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Продължителност</label>
                <input value={editingCourse.duration} onChange={e => setEditingCourse(p => p ? ({ ...p, duration: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Места</label>
                <input type="number" value={editingCourse.spots} onChange={e => setEditingCourse(p => p ? ({ ...p, spots: parseInt(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
                <input value={editingCourse.location} onChange={e => setEditingCourse(p => p ? ({ ...p, location: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <input value={editingCourse.badge || ''} onChange={e => setEditingCourse(p => p ? ({ ...p, badge: e.target.value || undefined }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={editingCourse.desc} onChange={e => setEditingCourse(p => p ? ({ ...p, desc: e.target.value }) : null)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Снимка на курса (URL или /uploads/...)</label>
                <input value={editingCourse.imgQuery || ''} onChange={e => setEditingCourse(p => p ? ({ ...p, imgQuery: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadCourseImage(e.target.files?.[0] || null, 'edit')} className="mt-2 block w-full text-sm text-gray-600" />
                {editingCourse.imgQuery && <img src={toImageSrc(editingCourse.imgQuery, editingCourse.title)} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingCourse(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={handleSaveCourse} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddCourse(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Нов Курс</h3>
              <button onClick={() => setShowAddCourse(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input value={newCourse.title} onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))} placeholder="Наименование на курса" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Инструктор</label>
                <input value={newCourse.instructor} onChange={e => setNewCourse(p => ({ ...p, instructor: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={newCourse.price} onChange={e => setNewCourse(p => ({ ...p, price: parseInt(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                <input value={newCourse.date} onChange={e => setNewCourse(p => ({ ...p, date: e.target.value }))} placeholder="пр. 15 Февруари 2025" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Продължителност</label>
                <input value={newCourse.duration} onChange={e => setNewCourse(p => ({ ...p, duration: e.target.value }))} placeholder="пр. 2 дни" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Места</label>
                <input type="number" value={newCourse.spots} onChange={e => setNewCourse(p => ({ ...p, spots: parseInt(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
                <input value={newCourse.location} onChange={e => setNewCourse(p => ({ ...p, location: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={newCourse.desc} onChange={e => setNewCourse(p => ({ ...p, desc: e.target.value }))} rows={3} placeholder="Описание..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Снимка на курса (URL или /uploads/...)</label>
                <input value={newCourse.imgQuery || ''} onChange={e => setNewCourse(p => ({ ...p, imgQuery: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadCourseImage(e.target.files?.[0] || null, 'new')} className="mt-2 block w-full text-sm text-gray-600" />
                {newCourse.imgQuery && <img src={toImageSrc(newCourse.imgQuery, newCourse.title || 'course')} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddCourse(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={handleAddCourse} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави курс</button>
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
            <h3 className="text-xl font-bold text-center text-[#2C1810] mb-2">Изтриване на курс</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Сигурни ли сте?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => handleDeleteCourse(deleteConfirm)} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap">Изтрий</button>
            </div>
          </div>
        </div>
      )}
      {uploadingImage && <p className="text-xs text-gray-500 mt-3">Качване на изображение...</p>}
    </>
  );
}
