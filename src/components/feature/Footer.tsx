import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2E1A0E] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-[#F5C842] rounded-lg">
                <i className="ri-bread-line text-xl text-[#1A0F08]"></i>
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Квасен Занаят
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Вашият надежден партньор за занаятчийски хляб. Предлагаме само проверено, качествено оборудване за истински пекари.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: 'ri-facebook-fill', href: '#' },
                { icon: 'ri-instagram-line', href: '#' },
                { icon: 'ri-pinterest-fill', href: '#' },
                { icon: 'ri-youtube-fill', href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  rel="nofollow"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#F5C842] hover:text-[#1A0F08] transition-all cursor-pointer text-white/70"
                >
                  <i className={`${s.icon} text-base`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="md:col-span-1"></div>

          {/* Магазин Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-5 font-semibold">Магазин</h4>
            <ul className="flex flex-col gap-3">
              {['Банетони', 'Везни & Измерване', 'Холандски Печки', 'Брашна', 'Стартер Китове'].map((item, i) => (
                <li key={i}>
                  <Link to="/shop" className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Информация Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-5 font-semibold">Информация</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'За нас', to: '/about' },
                { label: 'Блог', to: '/blog' },
                { label: 'Рецепти', to: '/recipes' },
                { label: 'Комплекти', to: '/bundles' },
                { label: 'Абонамент', to: '/subscription' },
                { label: 'Учи & Книги', to: '/learn' },
                { label: 'Ваучери & Курсове', to: '/vouchers' },
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-5 font-semibold">Контакти</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-map-pin-line text-[#F5C842] text-base"></i>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">бул. "Витоша" 123<br />София 1000, България</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className="ri-phone-line text-[#F5C842] text-base"></i>
                </div>
                <p className="text-sm text-white/60">+359 2 123 4567</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className="ri-mail-line text-[#F5C842] text-base"></i>
                </div>
                <p className="text-sm text-white/60">info@kvasenzanat.bg</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-time-line text-[#F5C842] text-base"></i>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">Пон — Пет: 9:00 – 18:00<br />Събота: 10:00 – 14:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">© 2025 Квасен Занаят. Всички права запазени.</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer whitespace-nowrap" rel="nofollow">Поверителност</a>
              <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer whitespace-nowrap" rel="nofollow">Условия</a>
              <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer whitespace-nowrap" rel="nofollow">Бисквитки</a>
              <a
                href="https://readdy.ai/?origin=logo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer whitespace-nowrap"
              >
                Built with Readdy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
