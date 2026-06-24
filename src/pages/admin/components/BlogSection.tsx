import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend, apiUploadImage, toImageSrc } from '@/lib/api';

type BlogPost = {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  imgQuery: string;
  featured: boolean;
  tags: string[];
  likes: number;
  fullContent: string[];
  comments: any[];
};

const EMPTY_POST = {
  title: '',
  category: 'beginners',
  excerpt: '',
  author: '',
  date: '',
  readTime: '5 мин',
  imgQuery: '',
  featured: false,
  tags: '',
  fullContent: '',
};

export default function BlogSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(EMPTY_POST);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    apiGet<any>('/api/admin/content/blog')
      .then((data) => setBlogPosts(Array.isArray(data?.blogPosts) ? data.blogPosts : []))
      .catch(() => setBlogPosts([]));
  };

  const publishedCount = useMemo(() => blogPosts.filter(p => p.likes > 0).length, [blogPosts]);

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      setForm(prev => ({ ...prev, imgQuery: response.url }));
    } finally {
      setUploadingImage(false);
    }
  };

  const toPayload = () => ({
    title: form.title,
    category: form.category,
    excerpt: form.excerpt,
    author: form.author,
    authorRole: 'Автор',
    date: form.date || new Date().toLocaleDateString('bg-BG'),
    readTime: form.readTime || '5 мин',
    imgQuery: form.imgQuery,
    featured: form.featured,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    likes: 0,
    fullContent: form.fullContent.split('\n').map(t => t.trim()).filter(Boolean),
    comments: [],
  });

  const openCreate = () => {
    setEditingPost(null);
    setForm(EMPTY_POST);
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      category: post.category || 'beginners',
      excerpt: post.excerpt || '',
      author: post.author || '',
      date: post.date || '',
      readTime: post.readTime || '5 мин',
      imgQuery: post.imgQuery || '',
      featured: !!post.featured,
      tags: (post.tags || []).join(', '),
      fullContent: Array.isArray(post.fullContent) ? post.fullContent.join('\n') : '',
    });
    setShowModal(true);
  };

  const savePost = async () => {
    if (!form.title.trim() || !form.author.trim()) return;
    if (editingPost) {
      await apiSend('/api/admin/content/blog/posts/' + editingPost.id, 'PUT', toPayload());
    } else {
      await apiSend('/api/admin/content/blog/posts', 'POST', toPayload());
    }
    setShowModal(false);
    setEditingPost(null);
    loadPosts();
  };

  const deletePost = async (id: number) => {
    await apiSend('/api/admin/content/blog/posts/' + id, 'DELETE');
    loadPosts();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Блог</h2>
          <p className="text-gray-600">Управление на блог статии</p>
        </div>
        <button
          onClick={openCreate}
          className="px-6 py-3 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Нова Статия
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Всички Статии', value: String(blogPosts.length), icon: 'ri-article-line', color: '#3B82F6' },
          { label: 'Публикувани', value: String(publishedCount), icon: 'ri-checkbox-circle-line', color: '#10B981' },
          { label: 'Чернови', value: String(Math.max(blogPosts.length - publishedCount, 0)), icon: 'ri-draft-line', color: '#F59E0B' },
          { label: 'Общо Прегледи', value: String(blogPosts.reduce((sum, p) => sum + Number(p.likes || 0), 0)), icon: 'ri-eye-line', color: '#8B5CF6' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#2C1810]">{stat.value}</h3>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <i className={`${stat.icon} text-2xl`} style={{ color: stat.color }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text"
              placeholder="Търси статия..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#2C1810]">
              <option>Всички категории</option>
              <option>Ръководства</option>
              <option>Техники</option>
              <option>Съвети</option>
              <option>Рецепти</option>
              <option>Ингредиенти</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <i className="ri-filter-line text-gray-600"></i>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статия</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Категория</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Автор</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Дата</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Прегледи</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={toImageSrc(post.imgQuery, post.title)} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-[#2C1810]">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{post.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{post.author}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{post.date}</td>
                  <td className="py-3 px-4 text-sm font-medium">{Number(post.likes || 0).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      post.likes > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.likes > 0 ? 'Публикувана' : 'Чернова'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEdit(post)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <i className="ri-edit-line text-gray-600"></i>
                      </button>
                      <button onClick={() => void deletePost(post.id)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
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

      {/* Add Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#2C1810]">{editingPost ? 'Редакция на статия' : 'Нова Блог Статия'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); void savePost(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заглавие</label>
                <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                  <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]">
                    <option value="beginners">Начинаещи</option>
                    <option value="techniques">Техники</option>
                    <option value="tips">Съвети</option>
                    <option value="equipment">Оборудване</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
                  <input value={form.author} onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата</label>
                  <input value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Време за четене</label>
                  <input value={form.readTime} onChange={e => setForm(prev => ({ ...prev, readTime: e.target.value }))} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Кратко резюме</label>
                <textarea value={form.excerpt} onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тагове (разделени със запетая)</label>
                <input value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Съдържание</label>
                <textarea value={form.fullContent} onChange={e => setForm(prev => ({ ...prev, fullContent: e.target.value }))} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Изображение</label>
                <input value={form.imgQuery} onChange={e => setForm(prev => ({ ...prev, imgQuery: e.target.value }))} type="text" placeholder="/uploads/... или URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] mb-2" />
                <input type="file" accept="image/*" onChange={e => void uploadImage(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600" />
                {uploadingImage && <p className="text-xs text-gray-500 mt-2">Качване на изображение...</p>}
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap"
                >
                  Запази
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}