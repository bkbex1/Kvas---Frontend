import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, toImageSrc } from '@/lib/api';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    apiGet<any>('/api/content/blog')
      .then((data) => {
        setBlogPosts(Array.isArray(data.blogPosts) ? data.blogPosts : []);
        setBlogCategories(Array.isArray(data.blogCategories) ? data.blogCategories : []);
      })
      .catch(() => {
        setBlogPosts([]);
        setBlogCategories([]);
      });
  }, []);

  const filtered = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  const featured = blogPosts.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured || activeCategory !== 'all');

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 h-72">
          <img
            src="https://readdy.ai/api/search-image?query=artisan%20bread%20baking%20books%20recipes%20flour%20kitchen%20counter%20rustic%20cozy%20workspace%20flat%20lay%20warm%20tones%20editorial%20food%20photography&width=1920&height=500&seq=blog-hero&orientation=landscape"
            alt="Блог"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-10">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">Знания & Вдъхновение</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Квасени Истории
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 pb-24">

        {/* ─── CATEGORY FILTER ─── */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {blogCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#1A0F08] text-white'
                  : 'bg-white text-[#1A0F08] hover:bg-[#F5EFE6] border border-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ─── FEATURED ARTICLE ─── */}
        {activeCategory === 'all' && featured && (
          <div className="group cursor-pointer mb-14 rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300">
            <Link to={`/blog/detail?id=${featured.id}`} className="block">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-72 md:h-auto overflow-hidden">
                <img
                  src={toImageSrc(featured.imgQuery, featured.title)}
                  alt={featured.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#F5C842] text-[#1A0F08] text-xs font-bold rounded-full uppercase tracking-wide">
                  Избор на редакцията
                </span>
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-full bg-[#F5EFE6] text-[#C17A3A] text-xs font-semibold uppercase tracking-wider mb-4">
                  {blogCategories.find(c => c.id === featured.category)?.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F08] leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {featured.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-[#1A0F08]">{featured.author}</p>
                    <p className="text-xs text-gray-400">{featured.date} · {featured.readTime} четене</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A0F08] group-hover:text-[#C17A3A] transition-colors">
                  Прочети статията <i className="ri-arrow-right-line text-base"></i>
                </span>
              </div>
            </div>
            </Link>
          </div>
        )}

        {/* ─── ARTICLES GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'all' ? rest : filtered).map(post => (
            <Link key={post.id} to={`/blog/detail?id=${post.id}`} className="group block">
            <article className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={toImageSrc(post.imgQuery, post.title)}
                  alt={post.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1A0F08] text-xs font-semibold rounded-full">
                  {blogCategories.find(c => c.id === post.category)?.label}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-[#1A0F08] text-lg leading-tight mb-2 group-hover:text-[#C17A3A] transition-colors line-clamp-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs font-semibold text-[#1A0F08]">{post.author}</p>
                    <p className="text-xs text-gray-400">{post.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <i className="ri-time-line text-sm"></i>
                    <span className="text-xs">{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>

        {/* ─── NEWSLETTER CTA ─── */}
        <div className="mt-16 rounded-2xl bg-[#1A0F08] p-12 text-center">
          <p className="text-[#F5C842] text-sm font-semibold uppercase tracking-widest mb-3">Бюлетин</p>
          <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Нова статия всяка седмица
          </h3>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Абонирайте се за нашия бюлетин и получавайте нови статии, рецепти и съвети директно в пощата.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5C842] text-[#1A0F08] rounded-full font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            Абонирай се
            <i className="ri-arrow-right-line text-lg"></i>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
