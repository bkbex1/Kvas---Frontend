import { useEffect, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, apiSend, toImageSrc } from '@/lib/api';

interface VoucherOption {
  id: string;
  amount: number;
  popular?: boolean;
  desc: string;
}

interface CoursePackage {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  duration: string;
  format: string;
  participants: string;
  desc: string;
  includes: string[];
  imgQuery: string;
  color: string;
}

const voucherOptions: VoucherOption[] = [
  { id: 'v30', amount: 30, desc: 'Перфектен стартов подарък' },
  { id: 'v50', amount: 50, desc: 'Популярен избор за рожден ден', popular: true },
  { id: 'v100', amount: 100, desc: 'Пълна свобода в магазина' },
  { id: 'v150', amount: 150, desc: 'Луксозно отношение' },
  { id: 'v200', amount: 200, desc: 'Пълен набор от продукти' },
];

const coursePackages: CoursePackage[] = [
  {
    id: 'weekend',
    name: 'Уикенд Уъркшоп',
    price: 149.00,
    badge: 'Популярен',
    duration: '2 дни (8 ч. всеки)',
    format: 'На живо · Малка група',
    participants: 'до 8 участника',
    desc: 'Интензивен уикенд, в който ще научите всичко за квасения хляб — от намесване до изпичане. Ще изнесете 3 хляба вкъщи!',
    includes: [
      'Материали и продукти включени',
      '3 изпечени хляба за вкъщи',
      'Рецептна книжка',
      'Сертификат за завършен курс',
      'Достъп до онлайн общността',
    ],
    imgQuery: 'artisan bread baking weekend workshop group of people kneading dough sourdough hands working wooden table flour natural light rustic kitchen atmosphere',
    color: '#C17A3A',
  },
  {
    id: 'masterclass',
    name: 'Masterclass — Занаятчийски Хляб',
    price: 249.00,
    oldPrice: 299.00,
    badge: 'Лимитирано',
    duration: '3 дни (6 ч. всеки)',
    format: 'На живо · Малка група',
    participants: 'до 6 участника',
    desc: 'Тридневен майсторски курс с известния пекар Иван Георгиев. Ферментация, формиране, декоративни разрези и тайните на перфектния хляб.',
    includes: [
      'Всички материали включени',
      'Личен feedback от майстора',
      '5 вида хляб за вкъщи',
      'Подаръчен комплект инструменти',
      'Сертификат и снимки',
      'Последваща онлайн сесия',
    ],
    imgQuery: 'professional baker chef instructor teaching masterclass bread artisan sourdough advanced workshop small group professional kitchen dark moody atmospheric warm',
    color: '#1A0F08',
  },
  {
    id: 'private',
    name: 'Частен Урок',
    price: 199.00,
    duration: 'По договаряне',
    format: '1:1 или малка група',
    participants: '1–3 участника',
    desc: 'Персонален урок, изцяло съобразен с вашите нужди и ниво. Идеален подарък или ако искате бързо да напреднете.',
    includes: [
      'Индивидуална програма',
      'Ваш темп и въпроси',
      'Материали включени',
      'Запис или бележки',
      'Последваща поддръжка (1 месец)',
    ],
    imgQuery: 'private one on one bread baking lesson instructor student sourdough personal tutoring warm kitchen natural light focused learning artisan technique',
    color: '#8B6B47',
  },
  {
    id: 'kids',
    name: 'Детски Курс с Родители',
    price: 89.00,
    badge: 'Семеен',
    duration: '1 ден (4 ч.)',
    format: 'На живо · Забавно',
    participants: 'до 12 участника',
    desc: 'Весел и безопасен курс за деца (6–14 г.) с техните родители. Правим прости питки, украсяваме и се забавляваме!',
    includes: [
      'Всички материали включени',
      '2 питки за вкъщи',
      'Снимки от събитието',
      'Диплома за малкия пекар',
    ],
    imgQuery: 'kids family bread baking fun workshop children parents sourdough playing dough colorful aprons happy kitchen smiling warm cheerful professional event photography',
    color: '#6B8E6B',
  },
];

export default function VouchersPage() {
  const [voucherOptionsData, setVoucherOptionsData] = useState<VoucherOption[]>(voucherOptions);
  const [coursePackagesData, setCoursePackagesData] = useState<CoursePackage[]>(coursePackages);
  const [selectedVoucher, setSelectedVoucher] = useState<string>('v50');
  const [customAmount, setCustomAmount] = useState('');
  const [voucherForm, setVoucherForm] = useState({ name: '', recipientName: '', email: '', message: '' });
  const [voucherSubmitted, setVoucherSubmitted] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [generatedVoucherCode, setGeneratedVoucherCode] = useState('');
  const [courseModalId, setCourseModalId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({ name: '', email: '', phone: '', participants: '1', note: '' });
  const [courseSubmitted, setCourseSubmitted] = useState<string | null>(null);
  const [courseLoading, setCourseLoading] = useState(false);

  useEffect(() => {
    apiGet<any>('/api/content/vouchers')
      .then((data) => {
        const vouchersFromApi = Array.isArray(data?.vouchers)
          ? data.vouchers.map((v: any) => ({
              id: String(v.id),
              amount: Number(v.amount || 0),
              desc: v.desc || `Ваучер за ${v.amount} лв`,
              popular: Boolean(v.popular),
            }))
          : [];
        const coursesFromApi = Array.isArray(data?.courses)
          ? data.courses.map((c: any) => ({
              id: String(c.id),
              name: c.title || c.name || 'Курс',
              price: Number(c.price || 0),
              oldPrice: c.oldPrice != null ? Number(c.oldPrice) : undefined,
              badge: c.badge || undefined,
              duration: c.duration || '',
              format: c.format || 'На живо',
              participants: c.participants || `${c.spots || 0} места`,
              desc: c.desc || c.description || '',
              includes: Array.isArray(c.includes) ? c.includes : [],
              imgQuery: c.imgQuery || '',
              color: c.color || '#1A0F08',
            }))
          : [];
        if (vouchersFromApi.length > 0) setVoucherOptionsData(vouchersFromApi);
        if (coursesFromApi.length > 0) setCoursePackagesData(coursesFromApi);
      })
      .catch(() => undefined);
  }, []);

  const selectedOption = voucherOptionsData.find(v => v.id === selectedVoucher);
  const finalAmount = customAmount ? parseInt(customAmount) : (selectedOption?.amount ?? 50);

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherForm.name || !voucherForm.email || !voucherForm.recipientName) return;
    setVoucherLoading(true);
    try {
      const response = await apiSend<{ code: string }>('/api/vouchers/purchase', 'POST', {
        amount: finalAmount,
        recipientEmail: voucherForm.email,
        recipientName: voucherForm.recipientName,
        senderName: voucherForm.name,
        message: voucherForm.message,
      });
      setGeneratedVoucherCode(response.code || '');
      setVoucherSubmitted(true);
    } catch {
      alert('Неуспешна заявка. Влезте в профила си и опитайте отново.');
    }
    setVoucherLoading(false);
  };

  const handleCourseSubmit = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.email) return;
    setCourseLoading(true);
    const course = coursePackagesData.find(c => c.id === courseId);
    const body = new URLSearchParams({
      name: courseForm.name,
      email: courseForm.email,
      phone: courseForm.phone,
      course: course?.name ?? '',
      participants: courseForm.participants,
      note: courseForm.note,
    });
    try {
      await fetch('https://readdy.ai/api/form/d7jolg51p46osftjrqe0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    } catch { /* ignore */ }
    setCourseLoading(false);
    setCourseSubmitted(courseId);
    setCourseModalId(null);
  };

  const modalCourse = coursePackagesData.find(c => c.id === courseModalId) || null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 h-80">
          <img
            src="https://readdy.ai/api/search-image?query=elegant%20gift%20voucher%20card%20artisan%20bakery%20premium%20present%20ribbon%20bow%20soft%20warm%20golden%20tones%20natural%20linen%20fabric%20bread%20baking%20lifestyle%20photography%20beautiful%20wrapped%20gift%20certificate&width=1920&height=560&seq=vouchers-hero&orientation=landscape"
            alt="Ваучери и курсове"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">Подаръци с вкус</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ваучери & Курсове
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Подарете незабравимо преживяване — подаръчен ваучер или място в курс по занаятчийско хлебопекарство.
          </p>
        </div>
      </section>

      {/* VOUCHERS SECTION */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Подаръчни Ваучери
            </h2>
            <p className="text-gray-500 mt-1">Перфектен подарък — получателят избира сам</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Voucher picker */}
          <div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 mb-6">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Изберете стойност</p>
              <div className="flex flex-wrap gap-3 mb-5">
                {voucherOptionsData.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVoucher(v.id); setCustomAmount(''); }}
                    className={`relative px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedVoucher === v.id && !customAmount
                        ? 'bg-[#1A0F08] text-white'
                        : 'bg-[#F5EFE6] text-[#1A0F08] hover:bg-[#e8e0d5]'
                    }`}
                  >
                    {v.amount} лв
                    {v.popular && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-[#C17A3A] text-white text-[9px] font-bold rounded-full">
                        Хит
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Или въведете друга сума (лв):</p>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedVoucher(''); }}
                  placeholder="напр. 75"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
            </div>

            {/* Voucher preview */}
            <div
              className="rounded-2xl p-8 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A0F08, #4A2D1A)' }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"></div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Квасен Занаят</p>
              <p className="text-xs text-white/40 mb-1">Подаръчен Ваучер</p>
              <p className="text-5xl font-bold mb-4">{finalAmount} лв</p>
              {voucherForm.recipientName && (
                <p className="text-white/70 text-sm">За: {voucherForm.recipientName}</p>
              )}
              <p className="text-white/40 text-xs mt-2">Валиден 12 месеца</p>
              <div className="absolute bottom-5 right-6">
                <i className="ri-bread-line text-5xl text-white/10"></i>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-7 border border-gray-100">
            {voucherSubmitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                  <i className="ri-check-line text-green-600 text-2xl"></i>
                </div>
                <h3 className="font-bold text-[#1A0F08] text-xl mb-2">Ваучерът е поръчан!</h3>
                <p className="text-gray-500 text-sm">Кодът е генериран успешно. Запазете го и го изпратете на получателя.</p>
                <div className="mt-4 rounded-xl border border-[#E8DCCF] bg-[#FFF7ED] px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Код на ваучер</p>
                  <p className="text-lg font-bold tracking-widest text-[#1A0F08]">{generatedVoucherCode}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(generatedVoucherCode)}
                    className="mt-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1A0F08] text-white cursor-pointer"
                  >
                    Копирай
                  </button>
                </div>
                <button
                  onClick={() => { setVoucherSubmitted(false); setGeneratedVoucherCode(''); setVoucherForm({ name: '', recipientName: '', email: '', message: '' }); }}
                  className="mt-6 px-6 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-semibold cursor-pointer"
                >
                  Поръчай още
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-[#1A0F08] text-lg mb-5">Данни за ваучера</h3>
                <form
                  data-readdy-form
                  onSubmit={handleVoucherSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Вашето iме (купувач)</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={voucherForm.name}
                      onChange={e => setVoucherForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Иван Иванов"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Имейл на получателя</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={voucherForm.email}
                      onChange={e => setVoucherForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="ivan@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Получателят (незадължително)</label>
                    <input
                      type="text"
                      name="recipientName"
                      required
                      value={voucherForm.recipientName}
                      onChange={e => setVoucherForm(p => ({ ...p, recipientName: e.target.value }))}
                      placeholder="За кого е подаръкът?"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Лично съобщение (незадължително)</label>
                    <textarea
                      name="message"
                      value={voucherForm.message}
                      onChange={e => {
                        if (e.target.value.length <= 500) setVoucherForm(p => ({ ...p, message: e.target.value }))
                      }}
                      placeholder="Малко думи с обич..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A] resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right">{voucherForm.message.length}/500</p>
                  </div>
                  <button
                    type="submit"
                    disabled={voucherLoading}
                    className="w-full py-3.5 bg-[#1A0F08] text-white rounded-xl text-sm font-bold hover:bg-[#C17A3A] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {voucherLoading ? 'Обработваме...' : `Поръчай ваучер за ${finalAmount} лв`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A0F08] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Курсове и Уъркшопи
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              На живо, с малки групи и истинско тесто. Научете се от майстори в уютна и вдъхновяваща среда.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursePackagesData.map(course => (
              <article
                key={course.id}
                className="rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-52">
                  <img
                    src={toImageSrc(course.imgQuery, course.name)}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {course.badge && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.badge}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-white/70 text-xs flex items-center gap-1">
                        <i className="ri-time-line"></i>
                        {course.duration}
                      </span>
                      <span className="text-white/70 text-xs flex items-center gap-1">
                        <i className="ri-group-line"></i>
                        {course.participants}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <p className="text-gray-500 text-sm mb-4">{course.desc}</p>
                  <div className="space-y-1.5 mb-5">
                    {course.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <i className="ri-check-line text-green-500 flex-shrink-0"></i>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-[#1A0F08]">{course.price.toFixed(2)} лв</span>
                      {course.oldPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">{course.oldPrice.toFixed(2)}</span>
                      )}
                      <p className="text-xs text-gray-400">{course.format}</p>
                    </div>
                    {courseSubmitted === course.id ? (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                        <i className="ri-checkbox-circle-line"></i>
                        Записан!
                      </div>
                    ) : (
                      <button
                        onClick={() => setCourseModalId(course.id)}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap hover:opacity-90"
                        style={{ backgroundColor: course.color }}
                      >
                        Запиши се
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COURSE MODAL */}
      {modalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCourseModalId(null)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md">
            <button
              onClick={() => setCourseModalId(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
            >
              <i className="ri-close-line"></i>
            </button>
            <h3 className="text-xl font-bold text-[#1A0F08] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {modalCourse.name}
            </h3>
            <p className="text-gray-400 text-sm mb-6">{modalCourse.price.toFixed(2)} лв · {modalCourse.format}</p>
            <form
              data-readdy-form
              onSubmit={(e) => handleCourseSubmit(e, modalCourse.id)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Вашето iме</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={courseForm.name}
                  onChange={e => setCourseForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Имейл</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={courseForm.email}
                  onChange={e => setCourseForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="ivan@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={courseForm.phone}
                  onChange={e => setCourseForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+359 88 888 8888"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Брой участника</label>
                <select
                  name="participants"
                  value={courseForm.participants}
                  onChange={e => setCourseForm(p => ({ ...p, participants: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A]"
                >
                  <option value="1">1 участник</option>
                  <option value="2">2 участника</option>
                  <option value="3">3 участника</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Бележки (незадължително)</label>
                <textarea
                  name="note"
                  value={courseForm.note}
                  onChange={e => {
                    if (e.target.value.length <= 500) setCourseForm(p => ({ ...p, note: e.target.value }))
                  }}
                  rows={2}
                  placeholder="Специфични нужди или въпроси..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C17A3A] resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{courseForm.note.length}/500</p>
              </div>
              <button
                type="submit"
                disabled={courseLoading}
                className="w-full py-3.5 bg-[#1A0F08] text-white rounded-xl text-sm font-bold hover:bg-[#C17A3A] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap mt-2"
              >
                {courseLoading ? 'Изпращаме...' : 'Потвърди записа'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
