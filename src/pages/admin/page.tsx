import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductsSection from './components/ProductsSection';
import OrdersSection from './components/OrdersSection';
import CustomersSection from './components/CustomersSectionReal';
import BlogSection from './components/BlogSection';
import SettingsSection from './components/SettingsSectionReal';
import DashboardSection from './components/DashboardSection';
import AboutSection from './components/AboutSection';
import GiveawaySection from './components/GiveawaySection';
import LearnSection from './components/LearnSection';
import BundlesSection from './components/BundlesSection';
import SubscriptionSection from './components/SubscriptionSection';
import VouchersAdminSection from './components/VouchersAdminSection';
import RecipesSection from './components/RecipesSection';

export default function AdminPage() {
  const { section } = useParams();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const validSections = new Set([
    'dashboard', 'products', 'orders', 'customers', 'blog', 'recipes', 'learn',
    'bundles', 'subscription', 'vouchers', 'giveaway', 'about', 'settings',
  ]);

  useEffect(() => {
    if (section && validSections.has(section)) {
      setActiveMenu(section);
      return;
    }
    if (!section) {
      setActiveMenu('dashboard');
    }
  }, [section]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#2C1810] to-[#3D2415] text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-3 mb-10 cursor-pointer group">
            <i className="ri-cake-3-line text-3xl group-hover:text-[#D4AF37] transition-colors"></i>
            <div>
              <h1 className="text-xl font-bold">Квасен Занаят</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>

          <nav className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 px-2">Основни</p>
            {[
              { id: 'dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
              { id: 'products', icon: 'ri-box-3-line', label: 'Продукти' },
              { id: 'orders', icon: 'ri-file-list-line', label: 'Поръчки' },
              { id: 'customers', icon: 'ri-team-line', label: 'Клиенти' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeMenu === item.id
                    ? 'bg-white/10 border-l-4 border-[#D4AF37]'
                    : 'hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span>{item.label}</span>
              </button>
            ))}

            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 px-2 mt-5">Съдържание</p>
            {[
              { id: 'blog', icon: 'ri-article-line', label: 'Блог' },
              { id: 'recipes', icon: 'ri-restaurant-line', label: 'Рецепти' },
              { id: 'learn', icon: 'ri-book-open-line', label: 'Учи & Книги' },
              { id: 'bundles', icon: 'ri-gift-line', label: 'Комплекти' },
              { id: 'subscription', icon: 'ri-refresh-line', label: 'Абонаменти' },
              { id: 'vouchers', icon: 'ri-coupon-line', label: 'Ваучери & Курсове' },
              { id: 'giveaway', icon: 'ri-gift-2-line', label: 'Giveaway / Boxes' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeMenu === item.id
                    ? 'bg-white/10 border-l-4 border-[#D4AF37]'
                    : 'hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span>{item.label}</span>
              </button>
            ))}

            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 px-2 mt-5">Настройки</p>
            {[
              { id: 'about', icon: 'ri-information-line', label: 'За Нас' },
              { id: 'settings', icon: 'ri-settings-3-line', label: 'Настройки' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeMenu === item.id
                    ? 'bg-white/10 border-l-4 border-[#D4AF37]'
                    : 'hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8">
        {activeMenu === 'dashboard' && <DashboardSection />}
        {activeMenu === 'products' && <ProductsSection />}
        {activeMenu === 'orders' && <OrdersSection />}
        {activeMenu === 'customers' && <CustomersSection />}
        {activeMenu === 'blog' && <BlogSection />}
        {activeMenu === 'about' && <AboutSection />}
        {activeMenu === 'giveaway' && <GiveawaySection />}
        {activeMenu === 'learn' && <LearnSection />}
        {activeMenu === 'bundles' && <BundlesSection />}
        {activeMenu === 'subscription' && <SubscriptionSection />}
        {activeMenu === 'vouchers' && <VouchersAdminSection />}
        {activeMenu === 'recipes' && <RecipesSection />}
        {activeMenu === 'settings' && <SettingsSection />}
      </main>
    </div>
  );
}