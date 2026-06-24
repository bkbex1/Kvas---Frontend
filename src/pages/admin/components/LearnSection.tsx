import { useEffect, useState } from 'react';
import { apiGet, apiSend, apiUploadImage, toImageSrc } from '@/lib/api';

type Book = any;
type VideoLesson = any;

type LearnTab = 'videos' | 'books';

export default function LearnSection() {
  const [tab, setTab] = useState<LearnTab>('videos');
  const [videoList, setVideoList] = useState<VideoLesson[]>([]);
  const [bookList, setBookList] = useState<Book[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'video' | 'book'; id: number } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadLearn = () => {
    apiGet<any>('/api/admin/content/learn')
      .then((data) => {
        setVideoList(Array.isArray(data.videoLessons) ? data.videoLessons : []);
        setBookList(Array.isArray(data.books) ? data.books : []);
      })
      .catch(() => {
        setVideoList([]);
        setBookList([]);
      });
  };

  useEffect(() => {
    loadLearn();
  }, []);

  const [newVideo, setNewVideo] = useState<Partial<VideoLesson>>({ title: '', instructor: '', desc: '', price: 0, duration: '', lessons: 0, level: 'Начинаещи', rating: 5.0, reviewCount: 0, topics: [], imgQuery: '' });
  const [newBook, setNewBook] = useState<Partial<Book>>({ title: '', author: '', desc: '', price: 0, pages: 0, language: 'Български', rating: 5.0, reviewCount: 0, category: 'book', imgQuery: '' });

  const levelColors: Record<string, string> = {
    'Начинаещи': 'bg-green-100 text-green-700',
    'Средно': 'bg-amber-100 text-amber-700',
    'Напреднали': 'bg-red-100 text-red-700',
  };

  const handleDeleteVideo = async (id: number) => {
    await apiSend(`/api/admin/content/learn/videos/${id}`, 'DELETE');
    setDeleteConfirm(null);
    loadLearn();
  };

  const handleDeleteBook = async (id: number) => {
    await apiSend(`/api/admin/content/learn/books/${id}`, 'DELETE');
    setDeleteConfirm(null);
    loadLearn();
  };

  const handleSaveVideo = async () => {
    if (!editingVideo) return;
    await apiSend(`/api/admin/content/learn/videos/${editingVideo.id}`, 'PUT', editingVideo);
    setEditingVideo(null);
    loadLearn();
  };

  const handleSaveBook = async () => {
    if (!editingBook) return;
    await apiSend(`/api/admin/content/learn/books/${editingBook.id}`, 'PUT', editingBook);
    setEditingBook(null);
    loadLearn();
  };

  const handleAddVideo = async () => {
    await apiSend('/api/admin/content/learn/videos', 'POST', newVideo);
    setShowAddVideo(false);
    setNewVideo({ title: '', instructor: '', desc: '', price: 0, duration: '', lessons: 0, level: 'Начинаещи', rating: 5.0, reviewCount: 0, topics: [], imgQuery: '' });
    loadLearn();
  };

  const handleAddBook = async () => {
    await apiSend('/api/admin/content/learn/books', 'POST', newBook);
    setShowAddBook(false);
    setNewBook({ title: '', author: '', desc: '', price: 0, pages: 0, language: 'Български', rating: 5.0, reviewCount: 0, category: 'book', imgQuery: '' });
    loadLearn();
  };

  const uploadVideoImage = async (file: File | null, mode: 'new' | 'edit') => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      if (mode === 'new') {
        setNewVideo(prev => ({ ...prev, imgQuery: response.url }));
      } else {
        setEditingVideo(prev => prev ? ({ ...prev, imgQuery: response.url }) : null);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadBookImage = async (file: File | null, mode: 'new' | 'edit') => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      if (mode === 'new') {
        setNewBook(prev => ({ ...prev, imgQuery: response.url }));
      } else {
        setEditingBook(prev => prev ? ({ ...prev, imgQuery: response.url }) : null);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Учи & Книги</h2>
          <p className="text-gray-600 mt-1">Управление на видео курсове и книги</p>
        </div>
        <button
          onClick={() => tab === 'videos' ? setShowAddVideo(true) : setShowAddBook(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white rounded-xl font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          {tab === 'videos' ? 'Нов Курс' : 'Нова Книга'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit border border-gray-200">
        {([{ id: 'videos', label: 'Видео Курсове', icon: 'ri-play-circle-line' }, { id: 'books', label: 'Книги', icon: 'ri-book-open-line' }] as const).map(t => (
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

      {/* Videos Table */}
      {tab === 'videos' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Курс</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Инструктор</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Ниво</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Урока</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Цена</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Рейтинг</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {videoList.map(video => (
                  <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={toImageSrc(video.imgQuery, video.title)}
                          alt={video.title}
                          className="w-14 h-10 rounded-lg object-cover object-top"
                        />
                        <div>
                          <p className="font-medium text-[#2C1810] text-sm">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{video.instructor}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[video.level]}`}>{video.level}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{video.lessons} урока</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#2C1810]">
                      {video.price.toFixed(2)} лв
                      {video.oldPrice && <span className="text-xs text-gray-400 line-through ml-1">{video.oldPrice.toFixed(2)}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-[#F5C842] text-sm"></i>
                        <span className="text-sm font-medium">{video.rating}</span>
                        <span className="text-xs text-gray-400">({video.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingVideo({ ...video })}
                          className="w-8 h-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                        >
                          <i className="ri-edit-line text-blue-600"></i>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'video', id: video.id })}
                          className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                        >
                          <i className="ri-delete-bin-line text-red-600"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Books Table */}
      {tab === 'books' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Книга</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Автор</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Тип</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Стр.</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Цена</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Рейтинг</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {bookList.map(book => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={toImageSrc(book.imgQuery, book.title)}
                          alt={book.title}
                          className="w-10 h-14 rounded-lg object-cover object-top"
                        />
                        <div>
                          <p className="font-medium text-[#2C1810] text-sm">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.language}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{book.author}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${book.category === 'ebook' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {book.category === 'ebook' ? 'E-book' : 'Книга'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{book.pages}</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#2C1810]">
                      {book.price.toFixed(2)} лв
                      {book.oldPrice && <span className="text-xs text-gray-400 line-through ml-1">{book.oldPrice.toFixed(2)}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-[#F5C842] text-sm"></i>
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBook({ ...book })}
                          className="w-8 h-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                        >
                          <i className="ri-edit-line text-blue-600"></i>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'book', id: book.id })}
                          className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                        >
                          <i className="ri-delete-bin-line text-red-600"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingVideo(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактиране на курс</h3>
              <button onClick={() => setEditingVideo(null)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input value={editingVideo.title} onChange={e => setEditingVideo(p => p ? ({ ...p, title: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Инструктор</label>
                <input value={editingVideo.instructor} onChange={e => setEditingVideo(p => p ? ({ ...p, instructor: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ниво</label>
                <select value={editingVideo.level} onChange={e => setEditingVideo(p => p ? ({ ...p, level: e.target.value as VideoLesson['level'] }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]">
                  <option>Начинаещи</option>
                  <option>Средно</option>
                  <option>Напреднали</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={editingVideo.price} onChange={e => setEditingVideo(p => p ? ({ ...p, price: parseFloat(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Стара цена (лв)</label>
                <input type="number" value={editingVideo.oldPrice || ''} onChange={e => setEditingVideo(p => p ? ({ ...p, oldPrice: parseFloat(e.target.value) || undefined }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Продължителност</label>
                <input value={editingVideo.duration} onChange={e => setEditingVideo(p => p ? ({ ...p, duration: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Брой уроци</label>
                <input type="number" value={editingVideo.lessons} onChange={e => setEditingVideo(p => p ? ({ ...p, lessons: parseInt(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={editingVideo.desc} onChange={e => setEditingVideo(p => p ? ({ ...p, desc: e.target.value }) : null)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <input value={editingVideo.badge || ''} onChange={e => setEditingVideo(p => p ? ({ ...p, badge: e.target.value || undefined }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Снимка (URL или /uploads/...)</label>
                <input value={editingVideo.imgQuery || ''} onChange={e => setEditingVideo(p => p ? ({ ...p, imgQuery: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadVideoImage(e.target.files?.[0] || null, 'edit')} className="mt-2 block w-full text-sm text-gray-600" />
                {editingVideo.imgQuery && <img src={toImageSrc(editingVideo.imgQuery, editingVideo.title)} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingVideo(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleSaveVideo()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingBook(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактиране на книга</h3>
              <button onClick={() => setEditingBook(null)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input value={editingBook.title} onChange={e => setEditingBook(p => p ? ({ ...p, title: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Автор</label>
                <input value={editingBook.author} onChange={e => setEditingBook(p => p ? ({ ...p, author: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <select value={editingBook.category} onChange={e => setEditingBook(p => p ? ({ ...p, category: e.target.value as Book['category'] }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]">
                  <option value="book">Книга</option>
                  <option value="ebook">E-book</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={editingBook.price} onChange={e => setEditingBook(p => p ? ({ ...p, price: parseFloat(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Стара цена (лв)</label>
                <input type="number" value={editingBook.oldPrice || ''} onChange={e => setEditingBook(p => p ? ({ ...p, oldPrice: parseFloat(e.target.value) || undefined }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Брой страници</label>
                <input type="number" value={editingBook.pages} onChange={e => setEditingBook(p => p ? ({ ...p, pages: parseInt(e.target.value) }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Език</label>
                <input value={editingBook.language} onChange={e => setEditingBook(p => p ? ({ ...p, language: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={editingBook.desc} onChange={e => setEditingBook(p => p ? ({ ...p, desc: e.target.value }) : null)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <input value={editingBook.badge || ''} onChange={e => setEditingBook(p => p ? ({ ...p, badge: e.target.value || undefined }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Снимка (URL или /uploads/...)</label>
                <input value={editingBook.imgQuery || ''} onChange={e => setEditingBook(p => p ? ({ ...p, imgQuery: e.target.value }) : null)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadBookImage(e.target.files?.[0] || null, 'edit')} className="mt-2 block w-full text-sm text-gray-600" />
                {editingBook.imgQuery && <img src={toImageSrc(editingBook.imgQuery, editingBook.title)} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingBook(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleSaveBook()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddVideo(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Нов Видео Курс</h3>
              <button onClick={() => setShowAddVideo(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input value={newVideo.title} onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))} placeholder="Заглавие на курса" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Инструктор</label>
                <input value={newVideo.instructor} onChange={e => setNewVideo(p => ({ ...p, instructor: e.target.value }))} placeholder="Имe на инструктора" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ниво</label>
                <select value={newVideo.level} onChange={e => setNewVideo(p => ({ ...p, level: e.target.value as VideoLesson['level'] }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]">
                  <option>Начинаещи</option>
                  <option>Средно</option>
                  <option>Напреднали</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={newVideo.price} onChange={e => setNewVideo(p => ({ ...p, price: parseFloat(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Продължителност</label>
                <input value={newVideo.duration} onChange={e => setNewVideo(p => ({ ...p, duration: e.target.value }))} placeholder="пр. 3 часа 30 мин" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Брой уроци</label>
                <input type="number" value={newVideo.lessons} onChange={e => setNewVideo(p => ({ ...p, lessons: parseInt(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={newVideo.desc} onChange={e => setNewVideo(p => ({ ...p, desc: e.target.value }))} rows={3} placeholder="Описание на курса..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Снимка (URL или /uploads/...)</label>
                <input value={newVideo.imgQuery || ''} onChange={e => setNewVideo(p => ({ ...p, imgQuery: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadVideoImage(e.target.files?.[0] || null, 'new')} className="mt-2 block w-full text-sm text-gray-600" />
                {newVideo.imgQuery && <img src={toImageSrc(newVideo.imgQuery, newVideo.title || 'course')} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddVideo(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleAddVideo()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави курс</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddBook(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Нова Книга</h3>
              <button onClick={() => setShowAddBook(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                <input value={newBook.title} onChange={e => setNewBook(p => ({ ...p, title: e.target.value }))} placeholder="Заглавие на книгата" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Автор</label>
                <input value={newBook.author} onChange={e => setNewBook(p => ({ ...p, author: e.target.value }))} placeholder="Автор" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <select value={newBook.category} onChange={e => setNewBook(p => ({ ...p, category: e.target.value as Book['category'] }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]">
                  <option value="book">Книга</option>
                  <option value="ebook">E-book</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                <input type="number" value={newBook.price} onChange={e => setNewBook(p => ({ ...p, price: parseFloat(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Брой страници</label>
                <input type="number" value={newBook.pages} onChange={e => setNewBook(p => ({ ...p, pages: parseInt(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Език</label>
                <input value={newBook.language} onChange={e => setNewBook(p => ({ ...p, language: e.target.value }))} placeholder="Български / Английски" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={newBook.desc} onChange={e => setNewBook(p => ({ ...p, desc: e.target.value }))} rows={3} placeholder="Описание на книгата..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Снимка (URL или /uploads/...)</label>
                <input value={newBook.imgQuery || ''} onChange={e => setNewBook(p => ({ ...p, imgQuery: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2C1810]" />
                <input type="file" accept="image/*" onChange={e => void uploadBookImage(e.target.files?.[0] || null, 'new')} className="mt-2 block w-full text-sm text-gray-600" />
                {newBook.imgQuery && <img src={toImageSrc(newBook.imgQuery, newBook.title || 'book')} alt="" className="mt-2 h-36 w-full object-cover rounded-xl border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddBook(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void handleAddBook()} className="flex-1 px-4 py-3 bg-[#2C1810] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">Добави книга</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
              <i className="ri-delete-bin-line text-2xl text-red-600"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-[#2C1810] mb-2">Изтриване</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Сигурни ли сте, че искате да изтриете това?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button
                onClick={() => void (deleteConfirm.type === 'video' ? handleDeleteVideo(deleteConfirm.id) : handleDeleteBook(deleteConfirm.id))}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}
      {uploadingImage && <p className="text-xs text-gray-500 mt-3">Качване на изображение...</p>}
    </>
  );
}
