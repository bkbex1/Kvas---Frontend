import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { categories, products as mockProducts } from '@/mocks/products';
import { apiGet, apiGetAllCatalogProducts, apiSend, normalizeProduct, toImageSrc, type ApiProduct } from '@/lib/api';

const SORT_OPTIONS = [
  { value: 'default', label: 'По подразбиране' },
  { value: 'price-asc', label: 'Цена: ниска → висока' },
  { value: 'price-desc', label: 'Цена: висока → ниска' },
  { value: 'rating', label: 'Най-висок рейтинг' },
  { value: 'name', label: 'По азбучен ред' },
];

const PRICE_RANGES = [
  { label: 'Всички цени', min: 0, max: Infinity },
  { label: 'До 30 лв', min: 0, max: 30 },
  { label: '30 – 80 лв', min: 30, max: 80 },
  { label: '80 – 150 лв', min: 80, max: 150 },
  { label: 'Над 150 лв', min: 150, max: Infinity },
];

const RATING_OPTIONS = [
  { label: 'Всички', value: 0 },
  { label: '4.5+ ★', value: 4.5 },
  { label: '4.7+ ★', value: 4.7 },
  { label: '4.9+ ★', value: 4.9 },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ApiProduct[]>([]);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
  const [sortBy, setSortBy] = useState('default');
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 24;

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, []);

  useEffect(() => {
    apiGetAllCatalogProducts()
      .then((data) => {
        const normalized = Array.isArray(data) ? data.map(normalizeProduct) : [];
        setProducts(normalized.length > 0 ? normalized : (mockProducts as unknown as ApiProduct[]));
      })
      .catch(() => setProducts(mockProducts as unknown as ApiProduct[]));
  }, []);

  useEffect(() => {
    // If URL category is invalid or empty in current dataset, fallback to "all".
    if (activeCategory === 'all') return;
    const hasCategoryItems = products.some((p) => p.category === activeCategory);
    if (!hasCategoryItems) {
      setActiveCategory('all');
    }
  }, [activeCategory, products]);

  useEffect(() => {
    apiGet<any[]>('/api/profile/favorites')
      .then((items) => setWishlist(items.map((p) => Number(p.id))))
      .catch(() => setWishlist([]));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    const range = PRICE_RANGES[priceRange];
    const customMin = parseFloat(priceMin) || 0;
    const customMax = parseFloat(priceMax) || Infinity;
    const effectiveMin = priceMin ? customMin : range.min;
    const effectiveMax = priceMax ? customMax : range.max;
    list = list.filter(p => p.price >= effectiveMin && p.price <= effectiveMax);

    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    if (onlyInStock) {
      list = list.filter(p => p.stock > 0);
    }

    if (onlyOnSale) {
      list = list.filter(p => !!p.oldPrice);
    }

    switch (sortBy) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [activeCategory, sortBy, searchQuery, priceRange, minRating, onlyInStock, onlyOnSale, priceMin, priceMax]);

  const pagedProducts = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    // Safety: landing in Shop should not stay empty when products exist.
    if (products.length > 0 && filtered.length === 0 && !searchQuery.trim() && activeCategory === 'all' && !onlyInStock && !onlyOnSale && minRating === 0 && !priceMin && !priceMax && priceRange === 0) {
      setSortBy('default');
    }
  }, [products.length, filtered.length, searchQuery, activeCategory, onlyInStock, onlyOnSale, minRating, priceMin, priceMax, priceRange]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, activeCategory, sortBy, priceRange, minRating, onlyInStock, onlyOnSale, priceMin, priceMax]);

  const toggleWishlist = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    const isIn = wishlist.includes(id);
    if (isIn) {
      await apiSend(`/api/profile/favorites/${id}`, 'DELETE');
      setWishlist(prev => prev.filter(x => x !== id));
    } else {
      await apiSend(`/api/profile/favorites/${id}`, 'POST');
      setWishlist(prev => prev.concat([id]));
    }
    window.dispatchEvent(new CustomEvent('favorites:updated'));
  };

  const addToCart = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    await apiSend('/api/cart/items', 'POST', { productId, quantity: 1 });
    window.dispatchEvent(new CustomEvent('cart:updated'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('default');
    setPriceRange(0);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    setPriceMin('');
    setPriceMax('');
    setSearchParams({});
  };

  const activeFiltersCount = [
    activeCategory !== 'all',
    priceRange > 0,
    minRating > 0,
    onlyInStock,
    onlyOnSale,
    !!priceMin || !!priceMax,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* ─── HERO BANNER ─── */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 h-72">
          <img
            src="https://readdy.ai/api/search-image?query=artisan%20sourdough%20bread%20baking%20tools%20banneton%20baskets%20flour%20spread%20on%20rustic%20wooden%20table%20wide%20angle%20overhead%20flat%20lay%20professional%20food%20photography%20warm%20tones&width=1920&height=500&seq=shop-hero&orientation=landscape"
            alt="Магазин"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-12">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">Нашата колекция</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Магазин
          </h1>
          {/* Search Bar in Hero */}
          <form onSubmit={handleSearch} className="max-w-xl flex items-center gap-2">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Търсете продукти..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-sm text-gray-700 bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1A0F08] text-white rounded-xl text-sm font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
            >
              Търси
            </button>
          </form>
        </div>
      </section>

      {/* ─── TOP TOOLBAR ─── */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(p => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${sidebarOpen ? 'bg-[#1A0F08] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <i className="ri-equalizer-line"></i>
                Филтри
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5 h-5 flex items-center justify-center bg-[#C17A3A] text-white text-xs rounded-full">{activeFiltersCount}</span>
                )}
              </button>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-[#C17A3A] hover:underline cursor-pointer whitespace-nowrap">
                  Изчисти всички
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} продукта</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer outline-none focus:border-[#1A0F08]"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
              <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                <button onClick={() => setGridCols(4)} className={`w-8 h-7 flex items-center justify-center rounded cursor-pointer transition-colors ${gridCols === 4 ? 'bg-[#1A0F08] text-white' : 'text-gray-400'}`}>
                  <i className="ri-grid-line text-sm"></i>
                </button>
                <button onClick={() => setGridCols(3)} className={`w-8 h-7 flex items-center justify-center rounded cursor-pointer transition-colors ${gridCols === 3 ? 'bg-[#1A0F08] text-white' : 'text-gray-400'}`}>
                  <i className="ri-layout-grid-2-line text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="max-w-7xl mx-auto px-8 py-8 pb-24">
        <div className={`flex gap-8 ${sidebarOpen ? '' : ''}`}>

          {/* ─── SIDEBAR FILTERS ─── */}
          {sidebarOpen && (
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-40 space-y-6">

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-bold text-[#1A0F08] uppercase tracking-wider mb-3">Категория</h3>
                  <div className="space-y-1">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap text-left ${
                          activeCategory === cat.id ? 'bg-[#1A0F08] text-white' : 'text-gray-700 hover:bg-[#F5EFE6]'
                        }`}
                      >
                        <i className={`${cat.icon} text-sm`}></i>
                        {cat.name}
                        <span className="ml-auto text-xs opacity-60">{products.filter(p => cat.id === 'all' || p.category === cat.id).length}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-bold text-[#1A0F08] uppercase tracking-wider mb-3">Ценови диапазон</h3>
                  <div className="space-y-1 mb-3">
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setPriceRange(idx); setPriceMin(''); setPriceMax(''); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                          priceRange === idx && !priceMin && !priceMax ? 'bg-[#F5EFE6] text-[#C17A3A] font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {range.label}
                        {priceRange === idx && !priceMin && !priceMax && <i className="ri-check-line text-[#C17A3A]"></i>}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Мин."
                      value={priceMin}
                      onChange={e => { setPriceMin(e.target.value); setPriceRange(0); }}
                      className="w-1/2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#1A0F08]"
                    />
                    <span className="text-gray-400 text-xs">–</span>
                    <input
                      type="number"
                      placeholder="Макс."
                      value={priceMax}
                      onChange={e => { setPriceMax(e.target.value); setPriceRange(0); }}
                      className="w-1/2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#1A0F08]"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-bold text-[#1A0F08] uppercase tracking-wider mb-3">Рейтинг</h3>
                  <div className="space-y-1">
                    {RATING_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setMinRating(opt.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                          minRating === opt.value ? 'bg-[#F5EFE6] text-[#C17A3A] font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                        {minRating === opt.value && <i className="ri-check-line text-[#C17A3A]"></i>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional */}
                <div>
                  <h3 className="text-sm font-bold text-[#1A0F08] uppercase tracking-wider mb-3">Допълнително</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        onClick={() => setOnlyInStock(p => !p)}
                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${onlyInStock ? 'bg-[#1A0F08]' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${onlyInStock ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                      <span className="text-sm text-gray-700">Само налични</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        onClick={() => setOnlyOnSale(p => !p)}
                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${onlyOnSale ? 'bg-[#1A0F08]' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${onlyOnSale ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                      <span className="text-sm text-gray-700">Само намалени</span>
                    </label>
                  </div>
                </div>

              </div>
            </aside>
          )}

          {/* ─── PRODUCTS ─── */}
          <div className="flex-1 min-w-0">
            {/* Active search query badge */}
            {searchQuery && (
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm text-gray-600">Резултати за:</span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1A0F08] text-white text-sm rounded-full">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-gray-300 cursor-pointer"><i className="ri-close-line text-xs"></i></button>
                </span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4 bg-[#F5EFE6] rounded-full">
                  <i className="ri-search-line text-3xl text-[#C17A3A]"></i>
                </div>
                <p className="text-xl font-semibold text-[#1A0F08] mb-2">Няма намерени продукти</p>
                <p className="text-gray-500 text-sm mb-5">Опитайте друго търсене или изчистете филтрите</p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-medium cursor-pointer hover:bg-[#C17A3A] transition-colors whitespace-nowrap">
                  Изчисти филтрите
                </button>
              </div>
            ) : (
              <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 && sidebarOpen ? 'lg:grid-cols-3' : gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-5`}>
                {pagedProducts.map(product => (
                  <Link
                    key={product.id}
                    to={`/product?id=${product.id}`}
                    className="group cursor-pointer"
                    data-product-shop
                  >
                    <article className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden bg-[#F5EFE6]">
                        <img src={toImageSrc(product.imgQuery, product.name)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {product.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1A0F08] text-white text-xs font-semibold rounded-full">{product.badge}</span>
                        )}
                        {product.oldPrice && (
                          <span className="absolute top-3 right-10 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                          </span>
                        )}
                        <button
                          onClick={e => void toggleWishlist(product.id, e)}
                          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                            wishlist.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <i className={wishlist.includes(product.id) ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={e => void addToCart(product.id, e)}
                            className="w-full py-3 bg-[#1A0F08] text-white text-sm font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer"
                          >
                            <i className="ri-shopping-cart-line mr-2"></i>
                            Добави в кошницата
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[#C17A3A] text-xs font-semibold uppercase tracking-wider mb-1">{product.categoryLabel}</p>
                        <h2 className="text-[#1A0F08] font-semibold text-base leading-tight mb-2 line-clamp-2">{product.name}</h2>
                        <p className="text-gray-500 text-xs mb-3 line-clamp-1">{product.desc}</p>
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <i key={s} className={`${s <= Math.round(product.rating) ? 'ri-star-fill text-[#F5C842]' : 'ri-star-line text-gray-300'} text-xs`}></i>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#1A0F08]">{product.price.toFixed(2)} лв</span>
                            {product.oldPrice && (
                              <span className="text-xs text-gray-400 line-through">{product.oldPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            {product.stock > 10 ? (
                              <><i className="ri-checkbox-circle-line text-green-500"></i> Наличен</>
                            ) : product.stock > 0 ? (
                              <><i className="ri-error-warning-line text-orange-400"></i> {product.stock} бр.</>
                            ) : (
                              <><i className="ri-close-circle-line text-red-400"></i> Изчерпан</>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">Страница {currentPage + 1} от {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
