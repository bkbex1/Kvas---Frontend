import { useEffect, useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { apiGet, toImageSrc } from '@/lib/api';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<any | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    apiGet<any>('/api/content/about')
      .then((data) => {
        setAboutContent(data.aboutContent || null);
        setTeamMembers(Array.isArray(data.teamMembers) ? data.teamMembers : []);
      })
      .catch(() => {
        setAboutContent(null);
        setTeamMembers([]);
      });
  }, []);

  const values = Array.isArray(aboutContent?.values) ? aboutContent.values : [];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />

      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=artisan bakery workshop with sourdough bread baking tools rustic wooden shelves warm natural light professional photography&width=1920&height=800&orientation=landscape')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/60"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            {aboutContent?.heroTitle || 'За Нас'}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
            {aboutContent?.heroSubtitle || 'Страстта към занаятчийския хляб ни обединява'}
          </p>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-5 py-2 border border-[#2C1810]/30 rounded-full mb-8 bg-white/70">
                <span className="text-sm font-medium text-[#2C1810]">НАШАТА ИСТОРИЯ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {aboutContent?.storyTitle || 'Как Всичко Започна'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{aboutContent?.storyP1 || ''}</p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{aboutContent?.storyP2 || ''}</p>
              <p className="text-lg text-gray-700 leading-relaxed">{aboutContent?.storyP3 || ''}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-2xl overflow-hidden">
                  <img src="https://readdy.ai/api/search-image?query=artisan sourdough bread loaf with beautiful scoring golden crust on wooden board professional food photography&width=400&height=500&orientation=portrait" alt="Квасен хляб" className="w-full h-full object-cover object-top" />
                </div>
                <div className="h-48 rounded-2xl overflow-hidden">
                  <img src="https://readdy.ai/api/search-image?query=baker hands shaping sourdough bread dough artisan technique flour dusted professional photography&width=400&height=300&orientation=landscape" alt="Месене на тесто" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-48 rounded-2xl overflow-hidden">
                  <img src="https://readdy.ai/api/search-image?query=sourdough starter in glass jar bubbling active fermentation close up professional food photography&width=400&height=300&orientation=landscape" alt="Квас" className="w-full h-full object-cover object-top" />
                </div>
                <div className="h-64 rounded-2xl overflow-hidden">
                  <img src="https://readdy.ai/api/search-image?query=rustic bakery shelves with fresh sourdough bread loaves artisan bakery interior warm lighting&width=400&height=500&orientation=portrait" alt="Пекарна" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-[#F8F3EA] to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Нашите Ценности
            </h2>
            <p className="text-lg text-gray-600">Принципите, които ни водят всеки ден</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value: any, idx: number) => (
              <div key={idx} className="relative rounded-2xl border border-[#E8DCCA] bg-white/90 backdrop-blur-sm p-8 shadow-[0_10px_30px_rgba(44,24,16,0.08)] hover:-translate-y-1 transition-all">
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#D4AF37] via-[#C17A3A] to-[#8B6B47]"></div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: value.color || '#F5EFE6' }}>
                  <i className={`${value.icon || 'ri-heart-line'} text-2xl text-[#2C1810]`}></i>
                </div>
                <h3 className="text-2xl font-bold text-[#2C1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Нашият Екип
            </h2>
            <p className="text-lg text-gray-600">Запознайте се с хората зад Квасен Занаят</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-200 border border-[#E8DCCA]">
                  <img src={toImageSrc(member.imgQuery, member.name)} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-[#2C1810] mb-1">{member.name}</h3>
                <p className="text-[#C17A3A] font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}