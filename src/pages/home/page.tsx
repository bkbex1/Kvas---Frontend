import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

const featuredProducts = [
  {
    id: 1,
    name: 'Банетон Кошница',
    category: 'Инструменти',
    price: 45.99,
    oldPrice: 59.99,
    badge: 'Хит',
    img: 'https://readdy.ai/api/search-image?query=round%20banneton%20proofing%20basket%20natural%20rattan%20wicker%20for%20sourdough%20bread%20artisan%20baking%20close%20up%20product%20photography%20warm%20cream%20background%20soft%20natural%20light&width=600&height=600&seq=fp1&orientation=squarish',
  },
  {
    id: 2,
    name: 'Дигитална Везна',
    category: 'Измерване',
    price: 89.99,
    oldPrice: null,
    badge: 'Ново',
    img: 'https://readdy.ai/api/search-image?query=sleek%20digital%20kitchen%20scale%20stainless%20steel%20modern%20minimal%20design%20for%20precise%20baking%20measurements%20white%20clean%20background%20studio%20light&width=600&height=600&seq=fp2&orientation=squarish',
  },
  {
    id: 3,
    name: 'Холандска Печка',
    category: 'Печене',
    price: 189.99,
    oldPrice: 229.99,
    badge: 'Топ продукт',
    img: 'https://readdy.ai/api/search-image?query=enameled%20cast%20iron%20dutch%20oven%20pot%20with%20lid%20matte%20black%20for%20baking%20artisan%20sourdough%20bread%20studio%20photography%20clean%20neutral%20background&width=600&height=600&seq=fp3&orientation=squarish',
  },
  {
    id: 4,
    name: 'Стартер Кит',
    category: 'Комплекти',
    price: 149.99,
    oldPrice: 189.99,
    badge: 'Промоция',
    img: 'https://readdy.ai/api/search-image?query=sourdough%20starter%20kit%20gift%20set%20glass%20jar%20flour%20lame%20knife%20banneton%20basket%20collection%20laid%20flat%20overhead%20photography%20warm%20neutral%20linen%20background&width=600&height=600&seq=fp4&orientation=squarish',
  },
];

const categories = [
  {
    name: 'Банетони',
    count: 12,
    img: 'https://readdy.ai/api/search-image?query=collection%20of%20banneton%20proofing%20baskets%20different%20shapes%20oval%20round%20natural%20rattan%20artisan%20bread%20making%20tools%20arranged%20beautifully%20warm%20wooden%20table&width=800&height=600&seq=cat1&orientation=landscape',
  },
  {
    name: 'Везни & Измерване',
    count: 8,
    img: 'https://readdy.ai/api/search-image?query=precision%20kitchen%20baking%20scale%20and%20thermometer%20tools%20arranged%20neatly%20on%20clean%20marble%20surface%20professional%20food%20photography&width=800&height=600&seq=cat2&orientation=landscape',
  },
  {
    name: 'Холандски Печки',
    count: 6,
    img: 'https://readdy.ai/api/search-image?query=cast%20iron%20dutch%20oven%20enameled%20cookware%20rustic%20wooden%20kitchen%20table%20warm%20moody%20photography%20artisan%20baking&width=800&height=600&seq=cat3&orientation=landscape',
  },
  {
    name: 'Брашна & Съставки',
    count: 15,
    img: 'https://readdy.ai/api/search-image?query=organic%20flour%20bags%20wheat%20grain%20seeds%20arranged%20on%20rustic%20wooden%20surface%20artisan%20bread%20baking%20ingredients%20warm%20natural%20tones&width=800&height=600&seq=cat4&orientation=landscape',
  },
];

const testimonials = [
  {
    name: 'Мария Иванова',
    role: 'Домашен пекар',
    text: 'Банетон кошниците са невероятни! Хлябът ми излиза с перфектна форма всеки път. Качеството е изключително и доставката беше бърза.',
    rating: 5,
    img: 'https://readdy.ai/api/search-image?query=friendly%20smiling%20bulgarian%20woman%2030s%20portrait%20warm%20natural%20light%20bokeh%20background%20professional%20headshot&width=200&height=200&seq=av1&orientation=squarish',
  },
  {
    name: 'Георги Петров',
    role: 'Занаятчийски пекар',
    text: 'Холандската печка промени напълно начина ми на печене. Кората е хрупкава, а вътрешността - мека и ароматна. Препоръчвам!',
    rating: 5,
    img: 'https://readdy.ai/api/search-image?query=friendly%20smiling%20bulgarian%20man%2040s%20beard%20portrait%20warm%20natural%20light%20bokeh%20background%20professional%20headshot&width=200&height=200&seq=av2&orientation=squarish',
  },
  {
    name: 'Елена Димитрова',
    role: 'Блогър и пекар',
    text: 'Страхотен избор на продукти и отлично обслужване. Специалните брашна са с високо качество. Ще поръчвам отново!',
    rating: 5,
    img: 'https://readdy.ai/api/search-image?query=friendly%20smiling%20bulgarian%20woman%2035s%20portrait%20warm%20natural%20light%20bokeh%20background%20professional%20headshot&width=200&height=200&seq=av3&orientation=squarish',
  },
];

const benefits = [
  { icon: 'ri-truck-line', title: 'Бърза Доставка', desc: 'Доставка до 2 работни дни в цяла България' },
  { icon: 'ri-shield-check-line', title: 'Гаранция за Качество', desc: '30-дневна гаранция за всеки продукт' },
  { icon: 'ri-leaf-line', title: 'Натурални Материали', desc: 'Само екологично чисти и сертифицирани продукти' },
  { icon: 'ri-customer-service-2-line', title: 'Поддръжка 24/7', desc: 'Нашият екип е винаги готов да помогне' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitStatus('loading');
    try {
      const body = new URLSearchParams({ email });
      const res = await fetch('https://readdy.ai/api/form/d7j9h9g3a2kq2q6kqsag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setSubscribed(true);
        setEmail('');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=artisan%20sourdough%20bread%20freshly%20baked%20golden%20crust%20on%20rustic%20wooden%20table%20with%20flour%20dust%20linen%20cloth%20warm%20dramatic%20side%20lighting%20professional%20food%20photography%20editorial%20moody%20tones&width=1920&height=1080&seq=hero-main&orientation=landscape')`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="relative z-10 w-full px-8 md:px-16 pb-20 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F5C842] animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium tracking-wide">Над 500 занаятчийски продукта</span>
            </div>
            <h1 className="text-white leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span className="block text-5xl md:text-7xl font-light">Всичко за вашия</span>
              <span className="block text-6xl md:text-8xl font-bold mt-1">Перфектен Хляб</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed">
              Професионално оборудване за квасен хляб — от начинаещи до майстори пекари. Занаятчийско качество, доставено до вашата врата.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1A0F08] rounded-full font-semibold text-base hover:bg-[#F5C842] transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                Разгледайте Магазина
                <i className="ri-arrow-right-line text-lg"></i>
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-full font-medium text-base hover:border-white hover:bg-white/10 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                Рецепти & Блог
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-16 hidden md:flex flex-col items-center gap-2 z-10">
          <span className="text-white/50 text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-lr' }}>Скролирайте</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </section>

      {/* ─── BENEFITS STRIP ─── */}
      <section className="bg-[#1A0F08] py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <i className={`${b.icon} text-[#F5C842] text-2xl`}></i>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{b.title}</p>
                  <p className="text-white/50 text-xs leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-3">Подбрани продукти</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A0F08] leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Любими от нашите<br />занаятчии
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[#1A0F08] font-semibold border-b-2 border-[#1A0F08] pb-1 hover:text-[#C17A3A] hover:border-[#C17A3A] transition-colors whitespace-nowrap cursor-pointer"
            >
              Всички продукти
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-[#F5EFE6]">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#1A0F08] text-white text-xs font-semibold rounded-full">
                        {p.badge}
                      </span>
                    </div>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1A0F08] hover:text-white cursor-pointer"
                    >
                      <i className="ri-heart-line text-base"></i>
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-[#C17A3A] text-xs font-medium uppercase tracking-wider mb-1">{p.category}</p>
                    <h3 className="text-[#1A0F08] font-semibold text-lg mb-3 leading-tight">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#1A0F08]">{p.price.toFixed(2)} лв</span>
                        {p.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">{p.oldPrice.toFixed(2)} лв</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="w-10 h-10 flex items-center justify-center bg-[#1A0F08] text-white rounded-full hover:bg-[#C17A3A] transition-colors cursor-pointer"
                      >
                        <i className="ri-shopping-cart-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY SECTION ─── */}
      <section className="py-24 px-8 bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=artisan%20baker%20hands%20shaping%20sourdough%20bread%20dough%20on%20floured%20wooden%20surface%20close%20up%20warm%20natural%20window%20light%20rustic%20kitchen%20authentic%20craft&width=800&height=1000&seq=story1&orientation=portrait"
                  alt="Занаятчийски пекар"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 w-48">
                <p className="text-4xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>500+</p>
                <p className="text-sm text-gray-600 mt-1">доволни пекари в България</p>
              </div>
            </div>

            <div>
              <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-4">Нашата история</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A0F08] leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Страстта към<br />занаятчийския хляб
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Вярваме, че всеки заслужава да пече перфектен хляб у дома. Затова подбираме само най-доброто оборудване — инструменти, с които майстори пекари работят в най-добрите пекарни по света.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                От банетон кошниците до холандските печки, всеки продукт в нашия магазин е тестван и одобрен от нашия екип от запалени пекари.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 mb-10">
                <div>
                  <p className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>5+</p>
                  <p className="text-sm text-gray-500 mt-1">Години опит</p>
                </div>
                <div className="w-px bg-gray-200 hidden sm:block"></div>
                <div>
                  <p className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>20+</p>
                  <p className="text-sm text-gray-500 mt-1">Продуктови категории</p>
                </div>
                <div className="w-px bg-gray-200 hidden sm:block"></div>
                <div>
                  <p className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>4.9★</p>
                  <p className="text-sm text-gray-500 mt-1">Средна оценка</p>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A0F08] text-white rounded-full font-semibold hover:bg-[#C17A3A] transition-colors whitespace-nowrap cursor-pointer"
              >
                Научете повече за нас
                <i className="ri-arrow-right-line text-lg"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-3">Разгледайте</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Нашите категории
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} to="/shop" className="group relative rounded-2xl overflow-hidden cursor-pointer h-64 md:h-80 block">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-white/70 text-sm mb-1">{cat.count} продукта</p>
                  <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                  <span className="inline-flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Виж всички <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS SECTION ─── */}
      <section className="py-24 px-8 bg-[#1A0F08]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#F5C842] text-sm font-semibold uppercase tracking-widest mb-3">Как работи</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              От поръчка до сладкия мирис<br />на пресен хляб
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: 'ri-search-eye-line', title: 'Изберете продукти', desc: 'Разгледайте нашия богат каталог с над 500 артикула' },
              { step: '02', icon: 'ri-shopping-cart-2-line', title: 'Добавете в кошница', desc: 'Лесна и сигурна система за поръчване онлайн' },
              { step: '03', icon: 'ri-truck-line', title: 'Бърза доставка', desc: 'Доставяме до 2 работни дни в цяла България' },
              { step: '04', icon: 'ri-bread-line', title: 'Печете с удоволствие', desc: 'Създавайте невероятен хляб с перфектните инструменти' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-[#F5C842]/20 transition-colors duration-300"></div>
                  <i className={`${s.icon} text-[#F5C842] text-3xl`}></i>
                </div>
                <p className="text-white/30 text-xs font-bold tracking-widest mb-2">{s.step}</p>
                <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-8 bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-3">Отзиви</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Какво казват<br />нашите клиенти
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <i key={s} className="ri-star-fill text-[#F5C842] text-xl"></i>
                ))}
              </div>
              <span className="text-[#1A0F08] font-bold text-lg">4.9</span>
              <span className="text-gray-500 text-sm">от 200+ отзива</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, s) => (
                    <i key={s} className="ri-star-fill text-[#F5C842]"></i>
                  ))}
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A0F08]">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-4">Бюлетин</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A0F08] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Получавайте рецепти<br />и оферти
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Абонирайте се и получавайте ексклузивни рецепти, съвети за пекари и специални оферти директно в пощата си.
          </p>

          {subscribed ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
                <i className="ri-check-line text-3xl text-green-600"></i>
              </div>
              <p className="text-[#1A0F08] font-semibold text-xl">Успешно се абонирахте!</p>
              <p className="text-gray-500">Очаквайте вдъхновяващи рецепти и оферти скоро.</p>
            </div>
          ) : (
            <form
              data-readdy-form
              id="newsletter-form"
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Вашият имейл адрес"
                required
                className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:border-[#1A0F08] outline-none text-sm text-[#1A0F08] placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="px-8 py-4 bg-[#1A0F08] text-white rounded-full font-semibold hover:bg-[#C17A3A] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-70"
              >
                {submitStatus === 'loading' ? 'Изпращане...' : 'Абонирай се'}
              </button>
            </form>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-500 text-sm mt-3">Нещо се обърка. Опитайте отново.</p>
          )}
          <p className="text-gray-400 text-xs mt-4">Без спам. Отписване по всяко време.</p>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=artisan%20sourdough%20bread%20bakery%20workshop%20rustic%20wooden%20counter%20flour%20tools%20warm%20golden%20hour%20light%20wide%20angle%20editorial%20lifestyle%20photography&width=1920&height=600&seq=cta-final&orientation=landscape"
            alt="Квасен Занаят"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-28">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Започнете вашето квасено приключение
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Открийте всички инструменти, нужни за занаятчийски хляб на световно ниво.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#F5C842] text-[#1A0F08] rounded-full font-bold text-base hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Пазарувайте сега
              <i className="ri-arrow-right-line text-xl"></i>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
