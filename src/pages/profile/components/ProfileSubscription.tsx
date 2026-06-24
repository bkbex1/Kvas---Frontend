import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiSend } from '@/lib/api';

export default function ProfileSubscription() {
  const [sub, setSub] = useState<any>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [showPause, setShowPause] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiGet('/api/profile/subscription')
      .then(setSub)
      .catch(() => setSub(null));
    apiGet<any>('/api/content/subscriptions')
      .then((data) => setSubscriptionPlans(Array.isArray(data.subscriptionPlans) ? data.subscriptionPlans : []))
      .catch(() => setSubscriptionPlans([]));
  }, []);

  const saveSubscription = async (next: any) => {
    await apiSend('/api/profile/subscription', 'PUT', next);
    setSub(next);
    setMessage('Абонаментът е обновен успешно.');
    window.setTimeout(() => setMessage(''), 2500);
    window.dispatchEvent(new CustomEvent('profile:updated'));
  };

  if (!sub) return <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-500">Няма активен абонамент.</div>;
  const safeSub = {
    planId: sub.planId ?? null,
    planName: sub.planName ?? 'Без план',
    status: sub.status ?? 'Неактивен',
    price: Number(sub.price ?? 0),
    frequency: sub.frequency ?? '/месец',
    color: sub.color ?? '#C17A3A',
    startDate: sub.startDate ?? '-',
    items: Array.isArray(sub.items) ? sub.items : [],
    nextDelivery: sub.nextDelivery ?? '-',
    discount: Number(sub.discount ?? 0),
    deliveryHistory: Array.isArray(sub.deliveryHistory) ? sub.deliveryHistory : [],
  };

  const statusColor: Record<string, string> = {
    'Активен': 'bg-green-100 text-green-700',
    'Пауза': 'bg-amber-100 text-amber-700',
    'Отказан': 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Моят Абонамент
        </h2>
      </div>
      {message && <div className="mb-4 text-sm bg-green-50 text-green-700 border border-green-200 rounded-xl px-3 py-2">{message}</div>}

      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${safeSub.color}20` }}
          >
            <i className="ri-bread-line text-3xl" style={{ color: safeSub.color }}></i>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-[#1A0F08]">{safeSub.planName}</h3>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusColor[safeSub.status] || 'bg-gray-100 text-gray-700'}`}>
                {safeSub.status}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1A0F08] mb-1">
              {safeSub.price.toFixed(2)} лв <span className="text-base font-normal text-gray-500">{safeSub.frequency}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">Активен от {safeSub.startDate}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {safeSub.items.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="ri-check-line text-green-600"></i>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Delivery */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 flex items-center justify-center bg-[#F5EFE6] rounded-xl">
                <i className="ri-truck-line text-[#C17A3A] text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">Следваща доставка</p>
                <p className="font-semibold text-[#1A0F08]">{safeSub.nextDelivery}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 flex items-center justify-center bg-[#F5EFE6] rounded-xl">
                <i className="ri-percent-line text-[#C17A3A] text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">Отстъпка в магазина</p>
                <p className="font-semibold text-[#1A0F08]">{safeSub.discount}% на всичко</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
          <button
            onClick={() => setShowChange(true)}
            className="px-5 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
          >
            Смяна на план
          </button>
          <button
            onClick={() => setShowPause(true)}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Пауза на абонамент
          </button>
          <button
            onClick={() => setShowCancel(true)}
            className="px-5 py-2.5 border border-red-200 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Прекрати абонамент
          </button>
        </div>
      </div>

      {/* Delivery History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-[#1A0F08] mb-4">История на доставките</h3>
        <div className="space-y-3">
              {(safeSub.deliveryHistory.length ? safeSub.deliveryHistory : [
                { date: 'Декември 2024', status: 'Доставена', items: "Baker's Box — Декември" },
                { date: 'Ноември 2024', status: 'Доставена', items: "Baker's Box — Ноември" },
                { date: 'Октомври 2024', status: 'Доставена', items: "Baker's Box — Октомври (Стартова)" },
              ]).map((del: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 flex items-center justify-center bg-green-100 rounded-lg">
                <i className="ri-checkbox-circle-line text-green-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A0F08]">{del.items}</p>
                <p className="text-xs text-gray-500">{del.date}</p>
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                {del.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* No subscription CTA */}
      <div className="mt-6 bg-[#F5EFE6] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-bold text-[#1A0F08] mb-1">Искате по-добър план?</h3>
          <p className="text-sm text-gray-600">Разгледайте всички абонаментни планове и изберете най-подходящия за вас</p>
        </div>
        <Link
          to="/subscription"
          className="px-6 py-3 bg-[#1A0F08] text-white rounded-full text-sm font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
        >
          Всички планове
        </Link>
      </div>

      {/* Pause Modal */}
      {showPause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPause(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-4">
              <i className="ri-pause-circle-line text-2xl text-amber-600"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-[#1A0F08] mb-2">Пауза на абонамент</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Абонаментът ви ще бъде поставен на пауза. Може да го възобновите по всяко време.</p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Срок на паузата</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]">
                <option>1 месец</option>
                <option>2 месеца</option>
                <option>3 месеца</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPause(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Отказ</button>
              <button onClick={() => void saveSubscription({ ...sub, status: 'Пауза' }).then(() => setShowPause(false))} className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-amber-600 transition-colors whitespace-nowrap">Постави на пауза</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCancel(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
              <i className="ri-close-circle-line text-2xl text-red-600"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-[#1A0F08] mb-2">Прекратяване на абонамент</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Сигурни ли сте? Ще загубите всички предимства включително {safeSub.discount}% отстъпка в магазина.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 whitespace-nowrap">Не, запази</button>
              <button onClick={() => void saveSubscription({ ...sub, status: 'Отказан' }).then(() => setShowCancel(false))} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors whitespace-nowrap">Прекрати</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {showChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowChange(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1A0F08]">Смяна на план</h3>
              <button onClick={() => setShowChange(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map(plan => (
                <div
                  key={plan.id}
                  className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${plan.id === safeSub.planId ? 'border-[#1A0F08] bg-[#F5EFE6]' : 'border-gray-200 hover:border-[#C17A3A]'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#1A0F08]">{plan.name}</span>
                    {plan.id === safeSub.planId && <span className="text-xs bg-[#1A0F08] text-white px-2 py-0.5 rounded-full">Текущ</span>}
                  </div>
                  <p className="text-2xl font-bold text-[#1A0F08] mb-1">{plan.price.toFixed(2)} лв</p>
                  <p className="text-xs text-gray-500 mb-3">{plan.frequency}</p>
                  <div className="space-y-1">
                    {plan.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-1 text-xs text-gray-600">
                        <i className="ri-check-line text-green-600 mt-0.5 flex-shrink-0"></i>
                        {item}
                      </div>
                    ))}
                  </div>
                  {plan.id !== safeSub.planId && (
                    <button
                      onClick={() => void saveSubscription({
                        ...sub,
                        planId: plan.id,
                        planName: plan.name,
                        price: plan.price,
                        frequency: plan.frequency,
                        items: plan.items,
                        color: plan.color || sub.color,
                      }).then(() => setShowChange(false))}
                      className="mt-4 w-full py-2 bg-[#1A0F08] text-white rounded-xl text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Избери
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
