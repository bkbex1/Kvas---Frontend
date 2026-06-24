import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet } from '@/lib/api';

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { value: timeLeft.days, label: 'Дни' },
        { value: timeLeft.hours, label: 'Часа' },
        { value: timeLeft.minutes, label: 'Минути' },
        { value: timeLeft.seconds, label: 'Секунди' },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
            <span className="text-3xl font-bold text-white">{String(value).padStart(2, '0')}</span>
          </div>
          <p className="text-xs text-white/70 mt-2 uppercase tracking-wider">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function GiveawayPage() {
  const [data, setData] = useState<any>(null);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  useEffect(() => {
    apiGet<any>('/api/content/giveaway')
      .then((payload) => {
        setData(payload.giveawayData || null);
        setBoxes(Array.isArray(payload.mysteryBoxes) ? payload.mysteryBoxes : []);
      })
      .catch(() => {
        setData(null);
        setBoxes([]);
      });
  }, []);

  if (!data) {
    return <div className="min-h-screen bg-[#FAF8F5]"><Navbar /></div>;
  }

  const handleQty = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, Math.min(10, (prev[id] || 1) + delta)),
    }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
  };

  const handleGiveawaySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
    try {
      await fetch('https://readdy.ai/api/form/d7jo20aue8m12f68gbvg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      setFormSubmitted(true);
      form.reset();
    } catch {
      setFormSubmitted(true);
    }
  };

  const faqs = [
    { q: 'Кога се избира победителят?', a: `Победителят се избира на ${new Date(data.giveawayEndsAt).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })} на случаен принцип сред всички участници.` },
    { q: 'Как ще разбера дали съм спечелил?', a: 'Победителят ще бъде уведомен чрез директно съобщение в Instagram или Facebook в рамките на 48 часа след тегленето.' },
    { q: 'Мога ли да участвам повече от веднъж?', a: 'Всеки участник може да увеличи шансовете си, като отбележи повече приятели в отделни коментари.' },
    { q: 'Подлежи ли наградата на замяна с пари?', a: 'Не, наградата не може да бъде заменена с парична сума или друг продукт.' },
  ];

  const selectedBoxData = selectedBox ? boxes.find(b => b.id === selectedBox) : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[680px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${data.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl w-full">
          <span className="inline-block px-4 py-2 bg-[#D4AF37]/90 text-[#2C1810] text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            {data.heroSubtitle}
          </span>
          <h1
            className="text-6xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {data.heroTitle}
          </h1>
          <p className="text-xl text-white/90 leading-relaxed mb-10 max-w-2xl mx-auto">
            {data.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#giveaway"
              className="px-8 py-4 bg-[#D4AF37] text-[#2C1810] font-bold rounded-full hover:bg-[#E8C84A] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-trophy-line mr-2"></i>
              Участвай в Томболата
            </a>
            <a
              href="#mystery-boxes"
              className="px-8 py-4 bg-white/10 text-white border-2 border-white/40 font-medium rounded-full hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-box-3-line mr-2"></i>
              Mystery Boxes
            </a>
          </div>
        </div>
      </section>

      {/* Giveaway Section */}
      {data.activeGiveaway && (
        <section id="giveaway" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-[#D4AF37]/20 text-[#8B6914] text-xs font-bold uppercase tracking-widest rounded-full mb-4">Текуща Томбола</span>
              <h2
                className="text-5xl font-bold text-[#2C1810] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {data.giveawayTitle}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{data.giveawayDescription}</p>
            </div>

            {/* Prize + Countdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
              <div className="relative rounded-3xl overflow-hidden aspect-video">
                <img src={data.giveawayPrizeImage} alt={data.giveawayPrize} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div>
                    <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Награда</p>
                    <h3 className="text-2xl font-bold text-white">{data.giveawayPrize}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-[#2C1810] rounded-3xl p-10 text-center">
                <p className="text-white/70 text-sm uppercase tracking-widest mb-4">Томболата приключва след</p>
                <CountdownTimer endsAt={data.giveawayEndsAt} />
                <p className="text-white/50 text-sm mt-6">
                  {new Date(data.giveawayEndsAt).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* How to participate */}
            <div className="bg-[#F5F1EB] rounded-3xl p-10 mb-12">
              <h3
                className="text-3xl font-bold text-[#2C1810] text-center mb-10"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Как да участвате?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.howToParticipate.map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 bg-[#2C1810] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-[#2C1810] text-lg mb-2">{step.step}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation Form */}
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-3xl p-10">
                <h3 className="text-2xl font-bold text-[#2C1810] text-center mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Потвърди участието си
                </h3>
                <p className="text-gray-500 text-sm text-center mb-8">Оставете имейл и потвърдете, че сте изпълнили условията</p>

                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-check-line text-4xl text-green-600"></i>
                    </div>
                    <h4 className="text-xl font-bold text-[#2C1810] mb-2">Записан успешно!</h4>
                    <p className="text-gray-500 text-sm">Ще ви уведомим по имейл ако спечелите. Успех!</p>
                  </div>
                ) : (
                  <form onSubmit={handleGiveawaySubmit} data-readdy-form>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Вашето Иmе *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2C1810] text-sm"
                          placeholder="Иван Иванов"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Имейл адрес *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2C1810] text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram потребителско имe *</label>
                        <input
                          type="text"
                          name="instagram"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2C1810] text-sm"
                          placeholder="@yourusername"
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" name="confirmed" id="confirm" required className="mt-1 rounded" />
                        <label htmlFor="confirm" className="text-sm text-gray-600 cursor-pointer">
                          Потвърждавам, че съм следвал/а профила, харесал/а публикацията и отбелязал/а приятели
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-[#2C1810] text-white rounded-xl font-medium hover:bg-[#3D2415] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-send-plane-line mr-2"></i>
                        Потвърди Участието
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mystery Boxes */}
      <section id="mystery-boxes" className="py-24 px-4 bg-gradient-to-b from-[#F5F1EB] to-[#FAF8F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#2C1810]/10 text-[#2C1810] text-xs font-bold uppercase tracking-widest rounded-full mb-4">Mystery Boxes</span>
            <h2
              className="text-5xl font-bold text-[#2C1810] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Поръчай Изненада
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Нашите Mystery Boxes са затворени кутии с грижливо подбрани продукти за любителите на занаятчийски хляб. Всяка кутия е изненада!
            </p>
          </div>

          {/* What's inside info banner */}
          <div className="bg-[#2C1810] rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <i className="ri-gift-2-line text-5xl text-[#D4AF37]"></i>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Какво е Mystery Box?</h3>
              <p className="text-white/70 text-sm">Всяка кутия съдържа внимателно подбрани продукти на стойност значително по-висока от цената. Точното съдържание е изненада — знаете само категориите и приблизителния брой продукти.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boxes.filter(b => b.available).map(box => (
              <div
                key={box.id}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${selectedBox === box.id ? 'ring-2 ring-[#D4AF37]' : ''}`}
                onClick={() => setSelectedBox(box.id === selectedBox ? null : box.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28box.imgQuery%29%7D&width=400&height=300&seq=pubbox${box.id}&orientation=landscape`}
                    alt={box.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {box.badge && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-[#D4AF37] text-[#2C1810] text-xs font-bold rounded-full">
                      {box.badge}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white/70 text-xs">Стойност над</p>
                    <p className="text-white font-bold">{box.originalValue} лв</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#2C1810] mb-1">{box.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{box.description}</p>
                  <ul className="space-y-1 mb-4">
                    {box.items.slice(0, 3).map((item, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="ri-checkbox-circle-line text-[#D4AF37]"></i>
                        {item}
                      </li>
                    ))}
                    {box.items.length > 3 && (
                      <li className="text-xs text-gray-400">+{box.items.length - 3} още...</li>
                    )}
                  </ul>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#2C1810]">{box.price.toFixed(2)} лв</p>
                      <p className="text-xs text-gray-400">{box.stock} бр в наличност</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedBox(box.id); }}
                      className="px-4 py-2 bg-[#2C1810] text-white rounded-xl text-sm font-medium hover:bg-[#3D2415] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Поръчай
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {selectedBox && selectedBoxData && !orderSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-48 overflow-hidden rounded-t-3xl">
              <img
                src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28selectedBoxData.imgQuery%29%7D&width=600&height=300&seq=modal${selectedBoxData.id}&orientation=landscape`}
                alt={selectedBoxData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">{selectedBoxData.name}</h3>
              </div>
              <button
                onClick={() => setSelectedBox(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white cursor-pointer hover:bg-black/70"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold text-[#2C1810]">{selectedBoxData.price.toFixed(2)} лв</p>
                  <p className="text-sm text-gray-400 line-through">Стойност: {selectedBoxData.originalValue} лв</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQty(selectedBoxData.id, -1)} className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100">
                    <i className="ri-subtract-line"></i>
                  </button>
                  <span className="w-8 text-center font-bold">{quantities[selectedBoxData.id] || 1}</span>
                  <button onClick={() => handleQty(selectedBoxData.id, 1)} className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100">
                    <i className="ri-add-line"></i>
                  </button>
                </div>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Имe *</label>
                    <input type="text" required placeholder="Иван" className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2C1810]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия *</label>
                    <input type="text" required placeholder="Иванов" className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2C1810]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имейл *</label>
                  <input type="email" required placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2C1810]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                  <input type="tel" required placeholder="+359 88..." className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2C1810]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес за доставка *</label>
                  <textarea required rows={2} maxLength={500} placeholder="Град, улица, номер..." className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2C1810] resize-none" />
                </div>
                <div className="bg-[#F5F1EB] rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{selectedBoxData.name} × {quantities[selectedBoxData.id] || 1}</span>
                    <span className="font-medium">{(selectedBoxData.price * (quantities[selectedBoxData.id] || 1)).toFixed(2)} лв</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Доставка</span>
                    <span className="font-medium text-green-600">Безплатна</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
                    <span>Общо</span>
                    <span className="text-[#2C1810]">{(selectedBoxData.price * (quantities[selectedBoxData.id] || 1)).toFixed(2)} лв</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#2C1810] text-white rounded-xl font-medium hover:bg-[#3D2415] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-box-3-line mr-2"></i>
                  Поръчай Mystery Box
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-10 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-checkbox-circle-line text-5xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-[#2C1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Поръчката е приета!</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Ще се свържем с вас по имейл за потвърждение. Изненадата е на път!</p>
            <button
              onClick={() => { setOrderSuccess(false); setSelectedBox(null); }}
              className="px-8 py-3 bg-[#2C1810] text-white rounded-xl cursor-pointer whitespace-nowrap hover:bg-[#3D2415]"
            >
              Затвори
            </button>
          </div>
        </div>
      )}

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Честите Въпроси
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-gray-50"
                >
                  <span className="font-medium text-[#2C1810]">{faq.q}</span>
                  {activeAccordion === idx ? <i className="ri-arrow-up-s-line text-gray-400 flex-shrink-0 ml-4"></i> : <i className="ri-arrow-down-s-line text-gray-400 flex-shrink-0 ml-4"></i>}
                </button>
                {activeAccordion === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Terms */}
          <div className="mt-10 bg-[#F5F1EB] rounded-2xl p-6">
            <h4 className="font-bold text-[#2C1810] mb-3 flex items-center gap-2">
              <i className="ri-file-text-line text-[#D4AF37]"></i>
              Условия за участие
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{data.termsAndConditions}</p>
          </div>
        </div>
      </section>

      {/* CTA to shop */}
      <section className="py-16 px-4 bg-[#2C1810]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Разгледайте целия ни Магазин
          </h2>
          <p className="text-white/70 mb-8">Открийте нашите инструменти, оборудване и брашна за занаятчийски хляб</p>
          <Link to="/shop" className="inline-block px-8 py-4 bg-[#D4AF37] text-[#2C1810] font-bold rounded-full hover:bg-[#E8C84A] transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-store-2-line mr-2"></i>
            Към Магазина
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
