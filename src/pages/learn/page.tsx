import { useEffect, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, toImageSrc } from '@/lib/api';

type Tab = 'books' | 'videos';

const LEVELS = ['Всички', 'Начинаещи', 'Средно', 'Напреднали'];
const BOOK_CATS = ['Всички', 'book', 'ebook'];

export default function LearnPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [videoLessons, setVideoLessons] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('videos');
  const [levelFilter, setLevelFilter] = useState('Всички');
  const [bookCat, setBookCat] = useState('Всички');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [addedItem, setAddedItem] = useState<number | null>(null);

  useEffect(() => {
    apiGet<any>('/api/content/learn')
      .then((data) => {
        setBooks(Array.isArray(data.books) ? data.books : []);
        setVideoLessons(Array.isArray(data.videoLessons) ? data.videoLessons : []);
      })
      .catch(() => {
        setBooks([]);
        setVideoLessons([]);
      });
  }, []);

  const filteredVideos = videoLessons.filter(v =>
    levelFilter === 'Всички' || v.level === levelFilter
  );

  const filteredBooks = books.filter(b =>
    bookCat === 'Всички' || b.category === bookCat
  );

  const handleAdd = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedItem(id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const videoDetail = videoLessons.find(v => v.id === selectedVideo);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 h-80">
          <img
            src="https://readdy.ai/api/search-image?query=artisan%20bread%20baking%20workshop%20online%20course%20instructor%20teaching%20sourdough%20techniques%20open%20cookbook%20flour%20dusty%20wooden%20table%20warm%20golden%20hour%20light%20professional%20photography%20cinematic%20natural&width=1920&height=560&seq=learn-hero&orientation=landscape"
            alt="Учи"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">Знания и вдъхновение</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Книги & Видео Уроци
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Учете от най-добрите — курсове за всяко ниво и книги, написани с любов към хляба.
          </p>
        </div>
      </section>

      {/* TAB SWITCHER */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1 bg-[#F5EFE6] rounded-full px-1 py-1">
              <button
                onClick={() => setTab('videos')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  tab === 'videos' ? 'bg-[#1A0F08] text-white' : 'text-[#1A0F08] hover:bg-[#e8e0d5]'
                }`}
              >
                <i className="ri-play-circle-line mr-2"></i>
                Видео Уроци
              </button>
              <button
                onClick={() => setTab('books')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  tab === 'books' ? 'bg-[#1A0F08] text-white' : 'text-[#1A0F08] hover:bg-[#e8e0d5]'
                }`}
              >
                <i className="ri-book-line mr-2"></i>
                Книги
              </button>
            </div>

            {tab === 'videos' && (
              <div className="flex items-center gap-2 flex-wrap">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevelFilter(l)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      levelFilter === l ? 'bg-[#1A0F08] text-white' : 'bg-[#F5EFE6] text-[#1A0F08] hover:bg-[#e8e0d5]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
            {tab === 'books' && (
              <div className="flex items-center gap-2">
                {BOOK_CATS.map(c => (
                  <button
                    key={c}
                    onClick={() => setBookCat(c)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      bookCat === c ? 'bg-[#1A0F08] text-white' : 'bg-[#F5EFE6] text-[#1A0F08] hover:bg-[#e8e0d5]'
                    }`}
                  >
                    {c === 'book' ? 'Физически книги' : c === 'ebook' ? 'Е-книги' : 'Всички'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-8 py-12 pb-24">
        {/* VIDEO LESSONS */}
        {tab === 'videos' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <article
                  key={video.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={toImageSrc(video.imgQuery, video.title)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/40 transition-colors">
                        <i className="ri-play-fill text-white text-2xl ml-0.5"></i>
                      </div>
                    </div>
                    {video.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#C17A3A] text-white text-xs font-bold rounded-full">
                        {video.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        video.level === 'Начинаещи' ? 'bg-green-500' :
                        video.level === 'Средно' ? 'bg-[#F5C842]' : 'bg-red-500'
                      } text-white`}>
                        {video.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-[#1A0F08] mb-1 text-base leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {video.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">с {video.instructor}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <i className="ri-time-line"></i>
                        {video.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-play-circle-line"></i>
                        {video.lessons} урока
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-star-fill text-[#F5C842]"></i>
                        {video.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#1A0F08]">{video.price.toFixed(2)} лв</span>
                        {video.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">{video.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAdd(video.id * 100, e)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          addedItem === video.id * 100
                            ? 'bg-green-500 text-white'
                            : 'bg-[#1A0F08] text-white hover:bg-[#C17A3A]'
                        }`}
                      >
                        {addedItem === video.id * 100 ? <><i className="ri-check-line"></i> Добавено</> : 'Купи'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* BOOKS */}
        {tab === 'books' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <article
                key={book.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden bg-[#F5EFE6]">
                  <img
                    src={toImageSrc(book.imgQuery, book.title)}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.badge && (
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ${
                      book.badge === 'Digital' ? 'bg-indigo-500' :
                      book.badge === 'Бестселър' ? 'bg-[#C17A3A]' :
                      book.badge === 'Ново' ? 'bg-green-500' :
                      'bg-[#1A0F08]'
                    }`}>
                      {book.badge}
                    </span>
                  )}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold text-white ${
                    book.category === 'ebook' ? 'bg-indigo-500' : 'bg-[#8B6B47]'
                  }`}>
                    {book.category === 'ebook' ? 'E-book' : 'Книга'}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-[#1A0F08] mb-0.5 text-base leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {book.title}
                  </h3>
                  <p className="text-[#C17A3A] text-xs font-medium mb-2">от {book.author}</p>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{book.desc}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-pages-line"></i>
                      {book.pages} стр.
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-global-line"></i>
                      {book.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-star-fill text-[#F5C842]"></i>
                      {book.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#1A0F08]">{book.price.toFixed(2)} лв</span>
                      {book.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">{book.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAdd(book.id, e)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        addedItem === book.id
                          ? 'bg-green-500 text-white'
                          : 'bg-[#1A0F08] text-white hover:bg-[#C17A3A]'
                      }`}
                    >
                      {addedItem === book.id ? <><i className="ri-check-line"></i> Добавено</> : 'Купи'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* VIDEO DETAIL MODAL */}
      {videoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedVideo(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-56">
              <img
                src={toImageSrc(videoDetail.imgQuery, videoDetail.title)}
                alt={videoDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="p-7">
              <h3 className="text-2xl font-bold text-[#1A0F08] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {videoDetail.title}
              </h3>
              <p className="text-[#C17A3A] text-sm mb-3">с {videoDetail.instructor}</p>
              <p className="text-gray-600 text-sm mb-5">{videoDetail.desc}</p>

              <div className="flex flex-wrap gap-4 mb-5 text-sm">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <i className="ri-time-line text-[#C17A3A]"></i>
                  {videoDetail.duration}
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <i className="ri-play-circle-line text-[#C17A3A]"></i>
                  {videoDetail.lessons} урока
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <i className="ri-bar-chart-line text-[#C17A3A]"></i>
                  {videoDetail.level}
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <i className="ri-star-fill text-[#F5C842]"></i>
                  {videoDetail.rating} ({videoDetail.reviewCount} отзива)
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Теми</p>
                <div className="flex flex-wrap gap-2">
                  {videoDetail.topics.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-[#F5EFE6] text-[#1A0F08] text-xs rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-[#1A0F08]">{videoDetail.price.toFixed(2)} лв</span>
                  {videoDetail.oldPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">{videoDetail.oldPrice.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={(e) => handleAdd(videoDetail.id * 100, e)}
                  className={`px-7 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    addedItem === videoDetail.id * 100
                      ? 'bg-green-500 text-white'
                      : 'bg-[#1A0F08] text-white hover:bg-[#C17A3A]'
                  }`}
                >
                  {addedItem === videoDetail.id * 100 ? 'Добавено!' : 'Добави в кошницата'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
