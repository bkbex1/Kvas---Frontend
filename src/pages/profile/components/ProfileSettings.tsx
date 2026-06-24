import { useEffect, useState } from 'react';
import { apiGet, apiSend, toImageSrc } from '@/lib/api';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<any>(null);
  const [saved, setSaved] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    orderStatus: true,
    subscriptionReminders: true,
    promotions: false,
    newRecipes: true,
    blogNews: false,
    giveaway: true,
  });

  useEffect(() => {
    apiGet('/api/profile')
      .then(setProfile)
      .catch(() => setProfile(null));
    apiGet('/api/profile/notifications')
      .then((data) => setNotifications(data as Record<string, boolean>))
      .catch(() => undefined);
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    await apiSend('/api/profile', 'PUT', {
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
      address: profile.address,
      postCode: profile.postCode,
    });
    setSaved('Профилът е обновен.');
    window.dispatchEvent(new CustomEvent('profile:updated'));
  };

  const handleSaveNotifications = async () => {
    await apiSend('/api/profile/notifications', 'PUT', notifications);
    setSaved('Известията са обновени.');
  };

  const handleChangePassword = async () => {
    if (!pwd.currentPassword || !pwd.newPassword) return;
    if (pwd.newPassword !== pwd.confirmPassword) {
      setSaved('Новата парола и потвърждението не съвпадат.');
      return;
    }
    await apiSend('/api/profile/password', 'PUT', {
      currentPassword: pwd.currentPassword,
      newPassword: pwd.newPassword,
    });
    setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSaved('Паролата е сменена успешно.');
  };

  if (!profile) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Настройки на профила
        </h2>
        {saved && <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">{saved}</span>}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {([
          { id: 'profile', label: 'Профил', icon: 'ri-user-line' },
          { id: 'security', label: 'Сигурност', icon: 'ri-lock-line' },
          { id: 'notifications', label: 'Известия', icon: 'ri-notification-line' },
        ] as const).map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === s.id ? 'bg-[#1A0F08] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <i className={s.icon}></i>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-5 mb-8">
            <img
              src={toImageSrc(profile.avatarQuery, 'person portrait natural light')}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover object-top"
            />
            <div>
              <button className="px-4 py-2 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
                Промени снимка
              </button>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG до 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Име и фамилия</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Имейл</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Град</label>
              <input
                type="text"
                value={profile.city}
                onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
              <input
                type="text"
                value={profile.address}
                onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пощенски код</label>
              <input
                type="text"
                value={profile.postCode || ''}
                onChange={e => setProfile((p: any) => ({ ...p, postCode: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => void handleSaveProfile()}
              className="px-6 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
            >
              Запази промените
            </button>
          </div>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-[#1A0F08] mb-5">Смяна на парола</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Текуща парола</label>
              <input value={pwd.currentPassword} onChange={e => setPwd(p => ({ ...p, currentPassword: e.target.value }))} type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Нова парола</label>
              <input value={pwd.newPassword} onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))} type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Потвърди нова парола</label>
              <input value={pwd.confirmPassword} onChange={e => setPwd(p => ({ ...p, confirmPassword: e.target.value }))} type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]" />
            </div>
            <button onClick={() => void handleChangePassword()} className="px-6 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
              Смени паролата
            </button>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-[#1A0F08] mb-5">Управление на известия</h3>
          <div className="space-y-4">
            {[
              { key: 'orderStatus', label: 'Статус на поръчки', desc: 'Известие при промяна на статуса на поръчката' },
              { key: 'subscriptionReminders', label: 'Абонаментни доставки', desc: 'Напомняне преди следваща доставка' },
              { key: 'promotions', label: 'Промоции и намаления', desc: 'Специални оферти и разпродажби' },
              { key: 'newRecipes', label: 'Нови рецепти', desc: 'Нова рецепта добавена в сайта' },
              { key: 'blogNews', label: 'Новини от блога', desc: 'Нови статии и уроци' },
              { key: 'giveaway', label: 'Giveaway известия', desc: 'Нови томболи и Mystery Boxes' },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-[#1A0F08] text-sm">{notif.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.desc}</p>
                </div>
                <NotifToggle checked={Boolean(notifications[notif.key])} onChange={(value) => setNotifications(prev => ({ ...prev, [notif.key]: value }))} />
              </div>
            ))}
          </div>
          <button onClick={() => void handleSaveNotifications()} className="mt-4 px-6 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
            Запази известията
          </button>
        </div>
      )}
    </div>
  );
}

function NotifToggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#1A0F08]' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      ></span>
    </button>
  );
}
