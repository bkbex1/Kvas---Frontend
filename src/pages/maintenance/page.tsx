import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/auth/AuthContext';
import DoughKneadingAnimation from './components/DoughKneadingAnimation';

type MaintenanceStatus = {
  enabled: boolean;
  title?: string;
  message?: string;
};

export default function MaintenancePage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);

  useEffect(() => {
    apiGet<MaintenanceStatus>('/api/content/maintenance')
      .then(setStatus)
      .catch(() => setStatus({ enabled: true }));
  }, []);

  const title = status?.title || 'Месим нещо хубаво...';
  const message = status?.message || 'Сайтът си почива, докато ние замесваме подобрения. Скоро ще изпечем нещо вкусно!';
  const role = user?.role || (user?.isAdmin ? 'ADMIN' : 'USER');
  const isStaff = role === 'ADMIN' || role === 'MODERATOR';

  return (
    <div className="min-h-screen bg-[#FAFAF7] maintenance-page overflow-hidden">
      <div className="maintenance-bg-glow" aria-hidden="true" />

      <Navbar />

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-[#EFE8DE] rounded-[2rem] shadow-lg p-8 md:p-12 text-center">
            <DoughKneadingAnimation />

            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6] text-[#8B6B47] text-xs font-semibold uppercase tracking-widest mb-5">
              <i className="ri-timer-flash-line" />
              Техническа пауза
            </p>

            <h1
              className="text-4xl md:text-5xl font-bold text-[#1A0F08] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {title}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              {message}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#EFE8DE]">
                <span className="w-2 h-2 rounded-full bg-[#C17A3A] animate-pulse" />
                Тестото се развива...
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#EFE8DE]">
                <i className="ri-fire-line text-[#C17A3A]" />
                Печката се загрява
              </span>
            </div>

            {isStaff && (
              <div className="mt-10 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                <p className="font-semibold mb-2">Достъп за екип ({role})</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/admin/settings" className="px-4 py-2 rounded-full bg-[#1A0F08] text-white hover:bg-[#C17A3A] transition-colors">
                    Админ настройки
                  </Link>
                  <Link to="/profile" className="px-4 py-2 rounded-full border border-[#1A0F08] text-[#1A0F08] hover:bg-[#F5EFE6] transition-colors">
                    Моят профил
                  </Link>
                  <Link to="/" className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-white transition-colors">
                    Към сайта
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
