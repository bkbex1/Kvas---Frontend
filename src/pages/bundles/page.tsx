import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, toImageSrc } from '@/lib/api';

export default function BundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    apiGet<any>('/api/content/bundles')
      .then((data) => setBundles(Array.isArray(data.bundles) ? data.bundles : []))
      .catch(() => setBundles([]));
  }, []);

  const handleAdd = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedId(id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 h-80">
          <img
            src="https://readdy.ai/api/search-image?query=artisan%20sourdough%20baking%20kit%20collection%20flat%20lay%20banneton%20basket%20glass%20jar%20lame%20knife%20linen%20cloth%20recipe%20card%20wooden%20tools%20arranged%20beautifully%20warm%20cream%20linen%20background%20overhead%20professional%20lifestyle%20photography%20natural%20light&width=1920&height=560&seq=bundles-hero&orientation=landscape"
            alt="Комплекти"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">Внимателно подбрани</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Продуктови Комплекти
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Всичко необходимо за перфектния квасен хляб — събрано в един умно подбран комплект. Спестявайте до 30%.
          </p>
        </div>
      </section>

      {/* BUNDLES */}
      <section className="max-w-7xl mx-auto px-8 py-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <article
              key={bundle.id}
              onClick={() => setSelected(selected === bundle.id ? null : bundle.id)}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={toImageSrc(bundle.imgQuery, bundle.name)}
                  alt={bundle.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge */}
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: bundle.color }}
                >
                  {bundle.badge}
                </span>

                {/* Price */}
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-white/60 text-sm line-through">{bundle.oldPrice.toFixed(2)} лв</div>
                  <div className="text-white text-2xl font-bold">{bundle.price.toFixed(2)} лв</div>
                </div>

                {/* Savings badge */}
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">{bundle.highlight}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#1A0F08] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {bundle.name}
                </h2>
                <p className="text-gray-500 text-sm mb-5">{bundle.subtitle}</p>

                {/* Items grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {bundle.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#F5EFE6] flex-shrink-0">
                        <i className={`${item.icon} text-xs text-[#C17A3A]`}></i>
                      </div>
                      <span className="line-clamp-1">
                        {item.qty > 1 ? `${item.qty}× ` : ''}{item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleAdd(bundle.id, e)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: addedId === bundle.id ? '#22c55e' : bundle.color,
                      color: bundle.color === '#1A0F08' ? 'white' : '#1A0F08',
                    }}
                  >
                    {addedId === bundle.id ? (
                      <><i className="ri-check-line"></i> Добавено!</>
                    ) : (
                      <><i className="ri-shopping-cart-line"></i> Добави в кошницата</>
                    )}
                  </button>
                  <Link
                    to={`/product?id=${bundle.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#1A0F08] hover:text-[#1A0F08] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Детайли
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* What's Inside section */}
        <div className="mt-20 bg-[#1A0F08] rounded-3xl p-10 md:p-16 text-white">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Какво съдържат всички комплекти?
            </h2>
            <p className="text-white/60">Всеки продукт е внимателно подбран от нашите специалисти</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'ri-goblet-line', name: 'Буркан за квас', desc: 'Боросиликатно стъкло или керамика' },
              { icon: 'ri-restaurant-line', name: 'Шпатула', desc: 'Силикон или дърво — за замесване' },
              { icon: 'ri-inbox-line', name: 'Кошница за втасване', desc: 'Натурален ратан от Германия' },
              { icon: 'ri-scissors-cut-line', name: 'Резец (lame)', desc: 'С ножчета за разрези' },
              { icon: 'ri-file-text-line', name: 'Карта с рецепта', desc: 'Стъпка по стъпка инструкции' },
              { icon: 'ri-layout-line', name: 'Ленено платно', desc: 'За ферментация на тестото' },
              { icon: 'ri-cup-line', name: 'Мерителна лъжица', desc: 'Прецизно дозиране' },
              { icon: 'ri-gift-line', name: 'Изненади', desc: 'Допълнителни артикули в по-скъпите комплекти' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 mx-auto mb-3">
                  <i className={`${item.icon} text-xl text-[#F5C842]`}></i>
                </div>
                <p className="text-sm font-semibold mb-1">{item.name}</p>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
