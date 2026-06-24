import { useEffect, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet } from '@/lib/api';

const FREQUENCIES = [
  { id: 'monthly', label: 'Месечно' },
  { id: 'quarterly', label: 'На 3 месеца', discount: '10%' },
  { id: 'biannual', label: 'На 6 месеца', discount: '15%' },
];

const faqs = [
  { q: 'Мога ли да спра абонамента?', a: 'Да, можете да спрете или паузирате абонамента си по всяко време от профила си, без такса или наказание.' },
  { q: 'Кога се изпраща кутията?', a: 'Изпращаме всеки месец около 5-ти. Ще получите имейл с известие 2 дни преди изпращане.' },
  { q: 'Мога ли да избера съдържанието?', a: 'В план Artisan Pro можете да избирате видовете брашна. В останалите планове ние подбираме за вас.' },
  { q: 'Има ли договор?', a: 'Не. Абонаментите са без договор. Плащате месец за месец и можете да спрете когато искате.' },
  { q: 'Доставка до България?', a: 'Да, доставяме до цяла България. Абонаментите включват безплатна доставка за всички планове.' },
];

export default function SubscriptionPage() {
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [frequency, setFrequency] = useState('monthly');
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formPlan, setFormPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    apiGet<any>('/api/content/subscriptions')
      .then((data) => setSubscriptionPlans(Array.isArray(data.subscriptionPlans) ? data.subscriptionPlans : []))
      .catch(() => setSubscriptionPlans([]));
  }, []);

  const getDiscountedPrice = (price: number) => {
    if (frequency === 'quarterly') return (price * 0.9).toFixed(2);
    if (frequency === 'biannual') return (price * 0.85).toFixed(2);
    return price.toFixed(2);
  };

  const handleSubscribe = (planId: string) => {
    setFormPlan(planId);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plan = subscriptionPlans.find(p => p.id === formPlan);
    if (!plan) return;
    const body = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      address: formData.address,
      plan: plan.name,
      frequency,
      price: getDiscountedPrice(plan.price),
    });
    try {
      await fetch('https://readdy.ai/api/form/d7jolg51p46osftjrqdg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    } catch { /* ignore */ }
    setSubmitted(true);
    setFormPlan(null);
    setSubscribedPlan(formPlan);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 h-96">
          <img
            src="https://readdy.ai/api/search-image?query=artisan%20bread%20subscription%20box%20monthly%20delivery%20organic%20flour%20sourdough%20tools%20premium%20packaging%20natural%20kraft%20box%20linen%20ribbon%20arranged%20on%20wooden%20table%20lifestyle%20product%20photography%20overhead%20warm%20neutral%20tones&width=1920&height=600&seq=sub-hero&orientation=landscape"
            alt="Абонамент"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-5">
            <i className="ri-vip-crown-line text-[#F5C842]"></i>
            Members Club
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Абонаментна<br />Програма
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Получавайте брашна, инструменти и изненади всеки месец — подбрани специално за вашия стил на печене.
          </p>
        </div>
      </section>

      {/* FREQUENCY TOGGLE */}
      <section className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {FREQUENCIES.map(f => (
            <button
              key={f.id}
              onClick={() => setFrequency(f.id)}
              className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                frequency === f.id
                  ? 'bg-[#1A0F08] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1A0F08]'
              }`}
            >
              {f.label}
              {f.discount && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  frequency === f.id ? 'bg-[#F5C842] text-[#1A0F08]' : 'bg-green-100 text-green-700'
                }`}>
                  -{f.discount}
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-3">Без договор · Спрете по всяко време</p>
      </section>

      {/* PLANS */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        {submitted && (
          <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-green-800">Успешно записахте се!</p>
              <p className="text-sm text-green-600">Ще получите потвърждение на имейла си скоро.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.popular ? 'border-2 border-[#C17A3A] scale-105' : 'border border-gray-100 hover:-translate-y-1'
              }`}
            >
              {plan.popular && (
                <div className="text-center py-2 bg-[#C17A3A] text-white text-xs font-bold uppercase tracking-wider">
                  Най-популярен
                </div>
              )}
              <div className="p-7">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
                  style={{ backgroundColor: plan.color + '20' }}
                >
                  <i className={`${plan.icon} text-2xl`} style={{ color: plan.color }}></i>
                </div>
                <h3 className="text-xl font-bold text-[#1A0F08] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-5">{plan.desc}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-[#1A0F08]">{getDiscountedPrice(plan.price)}</span>
                  <span className="text-gray-400 text-sm ml-1">лв / {plan.frequency}</span>
                  {frequency !== 'monthly' && (
                    <p className="text-xs text-green-600 mt-1">
                      <i className="ri-arrow-down-line"></i> Спестявате {frequency === 'quarterly' ? '10%' : '15%'}
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-7">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <i className="ri-check-line text-green-500 mt-0.5 flex-shrink-0"></i>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: plan.popular ? plan.color : '#F5EFE6',
                    color: plan.popular ? 'white' : '#1A0F08',
                  }}
                >
                  {subscribedPlan === plan.id ? (
                    <><i className="ri-check-line mr-1"></i> Записан</>
                  ) : (
                    'Абонирай се сега'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A0F08] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Как работи?
            </h2>
            <p className="text-gray-500">Три прости стъпки до вашата месечна кутия</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: 'ri-cursor-line', title: 'Изберете план', desc: 'Изберете абонаментен план, подходящ за вашия опит и нужди.' },
              { step: '02', icon: 'ri-truck-line', title: 'Получете кутията', desc: 'Всеки месец изпращаме лично подбрана кутия до вашата врата.' },
              { step: '03', icon: 'ri-bread-line', title: 'Печете и се наслаждавайте', desc: 'Опитайте новите продукти, следвайте рецептите и споделяйте с общността.' },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F5EFE6]">
                    <i className={`${step.icon} text-2xl text-[#C17A3A]`}></i>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#1A0F08] text-white text-[10px] font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-bold text-[#1A0F08] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-8 py-20">
        <h2 className="text-2xl font-bold text-[#1A0F08] text-center mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Често задавани въпроси
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
              >
                <span className="font-medium text-[#1A0F08] text-sm">{faq.q}</span>
                <i className={`ri-arrow-down-s-line text-gray-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`}></i>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-500 text-sm">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MODAL FORM */}
      {formPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFormPlan(null)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md">
            <button
              onClick={() => setFormPlan(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
            >
              <i className="ri-close-line"></i>
            </button>
            <h3 className="text-xl font-bold text-[#1A0F08] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Абонамент — {subscriptionPlans.find(p => p.id === formPlan)?.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6">Попълнете данните си и ще се свържем с вас</p>
            <form
              data-readdy-form
              onSubmit={handleFormSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Вашето ime</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Имейл адрес</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="ivan@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Адрес за доставка</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="ул. Примерна 1, гр. София"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A0F08] text-white rounded-xl text-sm font-bold hover:bg-[#C17A3A] transition-colors cursor-pointer mt-2"
              >
                Потвърди абонамента
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
