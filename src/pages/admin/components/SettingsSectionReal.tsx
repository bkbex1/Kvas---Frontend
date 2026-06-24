import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/api';

const defaultSettings = {
  general: {
    storeName: 'Квасен Занаят',
    contactEmail: 'info@kvasenzanat.bg',
    contactPhone: '',
    address: '',
    description: '',
  },
  store: {
    currency: 'BGN',
    minOrder: 30,
    vat: 20,
    showStock: true,
    allowReviews: true,
  },
  shipping: {
    freeShippingOver: 80,
    defaultPrice: 5.99,
    deliveryTerm: '2-3 работни дни',
    provider: 'Speedy',
    trackingEnabled: true,
  },
  payment: {
    card: true,
    cod: true,
    bank: false,
    codFee: 2.5,
  },
  notifications: {
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    newReview: true,
    notificationEmail: 'admin@kvasenzanat.bg',
    smsOrder: false,
    smsUrgent: true,
  },
  maintenance: {
    enabled: false,
    title: 'Месим нещо хубаво...',
    message: 'Сайтът си почива, докато ние замесваме подобрения. Скоро ще изпечем нещо вкусно!',
  },
};

const TAB_LABELS: Record<keyof typeof defaultSettings, string> = {
  general: 'Общи',
  store: 'Магазин',
  shipping: 'Доставка',
  payment: 'Плащане',
  notifications: 'Известия',
  maintenance: 'Поддръжка',
};

export default function SettingsSectionReal() {
  const [activeTab, setActiveTab] = useState<keyof typeof defaultSettings>('general');
  const [settings, setSettings] = useState<any>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<any>('/api/admin/content/raw/admin-settings')
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings));
  }, []);

  const save = async () => {
    await apiSend('/api/admin/content/raw/admin-settings', 'PUT', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Настройки</h2>
          <p className="text-gray-600">Реални настройки от backend</p>
        </div>
        <button onClick={() => void save()} className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415]">
          {saved ? 'Запазено' : 'Запази'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(['general', 'store', 'shipping', 'payment', 'notifications', 'maintenance'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-[#2C1810] text-white' : 'bg-white'}`}>
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'maintenance' ? (
        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div className={`rounded-2xl border p-6 transition-colors ${settings.maintenance?.enabled ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2C1810]">Maintenance страница</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Когато е включена, посетителите виждат забавната страница „месим тесто“. Администратори и модератори имат пълен достъп.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((p: any) => ({
                  ...p,
                  maintenance: { ...p.maintenance, enabled: !p.maintenance?.enabled },
                }))}
                className={`shrink-0 px-6 py-3 rounded-full font-semibold transition-colors ${
                  settings.maintenance?.enabled
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-[#2C1810] text-white hover:bg-[#3D2415]'
                }`}
              >
                {settings.maintenance?.enabled ? 'Изключи страницата' : 'Включи страницата'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
            <input
              type="text"
              value={settings.maintenance?.title ?? ''}
              onChange={e => setSettings((p: any) => ({
                ...p,
                maintenance: { ...p.maintenance, title: e.target.value },
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Месим нещо хубаво..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Съобщение</label>
            <textarea
              rows={4}
              value={settings.maintenance?.message ?? ''}
              onChange={e => setSettings((p: any) => ({
                ...p,
                maintenance: { ...p.maintenance, message: e.target.value },
              }))}
              className="w-full px-3 py-2 border rounded-lg resize-y"
              placeholder="Сайтът си почива, докато ние замесваме подобрения..."
            />
          </div>

          <p className="text-sm text-gray-500">
            Преглед: <a href="/maintenance" target="_blank" rel="noreferrer" className="text-[#C17A3A] hover:underline">/maintenance</a>
            {' · '}
            Не забравяйте да натиснете „Запази“ след промяна.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
          {Object.entries(settings[activeTab] || {}).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
              {typeof value === 'boolean' ? (
                <input type="checkbox" checked={value} onChange={e => setSettings((p: any) => ({ ...p, [activeTab]: { ...p[activeTab], [key]: e.target.checked } }))} />
              ) : typeof value === 'number' ? (
                <input type="number" value={value} onChange={e => setSettings((p: any) => ({ ...p, [activeTab]: { ...p[activeTab], [key]: Number(e.target.value) } }))} className="w-full px-3 py-2 border rounded-lg" />
              ) : (
                <input type="text" value={String(value ?? '')} onChange={e => setSettings((p: any) => ({ ...p, [activeTab]: { ...p[activeTab], [key]: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
