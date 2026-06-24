import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ProfileOrders from './components/ProfileOrders';
import ProfileFavorites from './components/ProfileFavorites';
import ProfileSubscription from './components/ProfileSubscription';
import ProfileSettings from './components/ProfileSettings';
import ProfileVouchers from './components/ProfileVouchers';
import { apiGet, toImageSrc } from '@/lib/api';
import { useAuth } from '@/auth/AuthContext';

const tabs = [
  { id: 'orders', label: 'История на поръчки', icon: 'ri-file-list-3-line' },
  { id: 'favorites', label: 'Любими продукти', icon: 'ri-heart-line' },
  { id: 'vouchers', label: 'Моите ваучери', icon: 'ri-coupon-3-line' },
  { id: 'subscription', label: 'Моят абонамент', icon: 'ri-refresh-line' },
  { id: 'settings', label: 'Настройки', icon: 'ri-settings-3-line' },
];

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({ orders: 0, favorites: 0 });
  const [feedback, setFeedback] = useState('');

  const loadProfileData = () => {
    apiGet('/api/profile')
      .then(setUserProfile)
      .catch(() => setUserProfile(null));
    Promise.all([apiGet<any[]>('/api/profile/orders'), apiGet<any[]>('/api/profile/favorites')])
      .then(([orders, favorites]) => setStats({ orders: orders.length, favorites: favorites.length }))
      .catch(() => setStats({ orders: 0, favorites: 0 }));
  };

  useEffect(() => {
    loadProfileData();
    const onProfileUpdated = () => {
      loadProfileData();
      setFeedback('Данните са запазени успешно.');
      window.setTimeout(() => setFeedback(''), 2500);
    };
    const onFavoritesUpdated = () => loadProfileData();
    window.addEventListener('profile:updated', onProfileUpdated);
    window.addEventListener('favorites:updated', onFavoritesUpdated);
    return () => {
      window.removeEventListener('profile:updated', onProfileUpdated);
      window.removeEventListener('favorites:updated', onFavoritesUpdated);
    };
  }, []);

  if (authLoading) {
    return <div className="min-h-screen bg-[#FAFAF8]"><Navbar /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <Navbar />
        <div className="pt-40 pb-24 px-6 text-center">
          <h1 className="text-3xl font-bold text-[#1A0F08] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Влезте в профила си</h1>
          <p className="text-gray-500 mb-8">За достъп до профила е нужен вход в системата.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/login" className="px-6 py-3 bg-[#1A0F08] text-white rounded-full font-semibold hover:bg-[#C17A3A] transition-colors">Вход</Link>
            <Link to="/register" className="px-6 py-3 bg-white border border-gray-200 text-[#1A0F08] rounded-full font-semibold hover:bg-gray-50 transition-colors">Регистрация</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return <div className="min-h-screen bg-[#FAFAF8]"><Navbar /></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="pt-28 pb-10 bg-gradient-to-b from-[#F3EEE6] to-[#FAFAF8] border-b border-[#E9E2D8]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6 bg-white rounded-3xl p-6 shadow-sm border border-[#EFE8DE]">
          <div className="relative">
            <img
              src={toImageSrc(userProfile.avatarQuery, 'person portrait natural light')}
              alt={userProfile.name}
              className="w-24 h-24 rounded-full object-cover object-top border-4 border-[#F5C842]"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {userProfile.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Член от {userProfile.joinDate} &bull; {userProfile.email}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#F5C842]">{stats.orders}</div>
              <div className="text-xs text-gray-400">Поръчки</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F5C842]">{stats.favorites}</div>
              <div className="text-xs text-gray-400">Любими</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F5C842]">{userProfile.loyaltyPoints}</div>
              <div className="text-xs text-gray-400">Точки</div>
            </div>
          </div>
        </div>
        {feedback && (
          <div className="max-w-6xl mx-auto px-6 md:px-10 mt-4">
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              {feedback}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 mt-6">
          <div className="flex gap-2 overflow-x-auto bg-white border border-[#EFE8DE] rounded-2xl p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1A0F08] text-white'
                    : 'text-gray-500 hover:text-[#1A0F08] hover:bg-[#F7F2EA]'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {activeTab === 'orders' && <ProfileOrders />}
        {activeTab === 'favorites' && <ProfileFavorites />}
        {activeTab === 'vouchers' && <ProfileVouchers />}
        {activeTab === 'subscription' && <ProfileSubscription />}
        {activeTab === 'settings' && <ProfileSettings />}
      </div>

      <Footer />
    </div>
  );
}
