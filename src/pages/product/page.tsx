import { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import { apiGetAllCatalogProducts, normalizeProduct, toImageSrc, type ApiProduct } from '@/lib/api';

export default function ProductPage() {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const productId = Number(pathId ?? searchParams.get('id'));
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompareTable, setShowCompareTable] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const product = products.find(p => p.id === productId);

  useEffect(() => { window.scrollTo(0, 0); }, [productId]);
  useEffect(() => {
    apiGetAllCatalogProducts()
      .then((data) => setProducts(data.map(normalizeProduct)))
      .catch(() => setProducts([]));
  }, []);

  const toggleCompare = (id: number) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div className="pt-40 pb-24 px-8 text-center">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-[#F5EFE6] rounded-full">
            <i className="ri-question-line text-3xl text-[#C17A3A]"></i>
          </div>
          <h1 className="text-3xl font-bold text-[#1A0F08] mb-3">Продуктът не е намерен</h1>
          <p className="text-gray-500 mb-8">Моля проверете URL адреса или разгледайте нашия магазин.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A0F08] text-white rounded-full font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer">
            <i className="ri-arrow-left-line"></i> Към магазина
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const compareProds = products.filter(p => compareList.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <div className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-8">

          {/* ─── MAIN SECTION ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pt-8 mb-16">
            {/* Gallery */}
            <div className="lg:sticky lg:top-28 self-start">
              <ProductGallery imgQuery={product.imgQuery} images={product.images} name={product.name} />
            </div>

            {/* Info */}
            <ProductInfo product={product} compareList={compareList} onToggleCompare={toggleCompare} />
          </div>

          {/* ─── TABS ─── */}
          <ProductTabs product={product} />

          {/* ─── COMPARE BAR ─── */}
          {compareList.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <div className="bg-[#1A0F08] text-white rounded-2xl px-6 py-4 flex items-center gap-4 min-w-64">
                <span className="text-sm font-medium">{compareList.length} продукта за сравнение</span>
                <button
                  onClick={() => setShowCompareTable(true)}
                  className="px-4 py-2 bg-[#F5C842] text-[#1A0F08] rounded-full text-sm font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Сравни
                </button>
                <button onClick={() => setCompareList([])} className="text-white/60 hover:text-white cursor-pointer">
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>
          )}

          {/* ─── COMPARE TABLE MODAL ─── */}
          {showCompareTable && compareProds.length > 0 && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6" onClick={() => setShowCompareTable(false)}>
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-auto p-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>Сравнение на продукти</h2>
                  <button onClick={() => setShowCompareTable(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                    <i className="ri-close-line text-lg text-[#1A0F08]"></i>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-3 pr-4 text-gray-500 font-medium w-40">Характеристика</th>
                        {compareProds.map(p => (
                          <th key={p.id} className="py-3 px-4 text-center">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5EFE6] mx-auto mb-2">
                              <img src={toImageSrc(p.imgQuery, p.name)} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-semibold text-[#1A0F08] text-xs">{p.name}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100">
                        <td className="py-3 pr-4 text-gray-500">Цена</td>
                        {compareProds.map(p => (
                          <td key={p.id} className="py-3 px-4 text-center font-bold text-[#1A0F08]">{p.price.toFixed(2)} лв</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-100 bg-[#FAFAF7]">
                        <td className="py-3 pr-4 text-gray-500">Рейтинг</td>
                        {compareProds.map(p => (
                          <td key={p.id} className="py-3 px-4 text-center">{p.rating} ★</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-100">
                        <td className="py-3 pr-4 text-gray-500">Наличност</td>
                        {compareProds.map(p => (
                          <td key={p.id} className="py-3 px-4 text-center">
                            <span className={p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-orange-500' : 'text-red-500'}>
                              {p.stock > 10 ? '✓ Наличен' : p.stock > 0 ? `${p.stock} бр.` : 'Изчерпан'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      {Object.keys(compareProds[0].specs).map((key, i) => (
                        <tr key={key} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-[#FAFAF7]' : 'bg-white'}`}>
                          <td className="py-3 pr-4 text-gray-500">{key}</td>
                          {compareProds.map(p => (
                            <td key={p.id} className="py-3 px-4 text-center text-[#1A0F08]">
                              {p.specs[key] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── RELATED PRODUCTS ─── */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-2">Може да харесате</p>
                  <h2 className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>Свързани продукти</h2>
                </div>
                <Link to="/shop" className="text-sm font-semibold text-[#1A0F08] border-b-2 border-[#1A0F08] pb-0.5 hover:text-[#C17A3A] hover:border-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
                  Всички продукти <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => (
                  <Link key={p.id} to={`/product?id=${p.id}`} className="group cursor-pointer" data-product-shop>
                    <article className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden bg-[#F5EFE6]">
                        <img src={toImageSrc(p.imgQuery, p.name)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {p.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1A0F08] text-white text-xs font-semibold rounded-full">{p.badge}</span>
                        )}
                        <button
                          onClick={e => { e.preventDefault(); toggleCompare(p.id); }}
                          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                            compareList.includes(p.id) ? 'bg-[#F5C842] text-[#1A0F08]' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                          title="Добави за сравнение"
                        >
                          <i className="ri-scales-line text-sm"></i>
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-[#C17A3A] text-xs font-semibold uppercase tracking-wider mb-1">{p.categoryLabel}</p>
                        <h3 className="text-[#1A0F08] font-semibold text-base leading-tight mb-2">{p.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#1A0F08]">{p.price.toFixed(2)} лв</span>
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <i key={s} className={`${s <= Math.round(p.rating) ? 'ri-star-fill text-[#F5C842]' : 'ri-star-line text-gray-300'} text-xs`}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
