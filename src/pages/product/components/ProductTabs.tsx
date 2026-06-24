import { useState } from 'react';
import { SPEC_LABELS } from '@/mocks/products';
import type { ApiProduct } from '@/lib/api';

const mockReviews = [
  { name: 'Мария И.', rating: 5, date: '12 Март 2025', text: 'Изключително качество! Хлябът ми излиза перфектен всеки път. Препоръчвам на всеки пекар.', avatar: 'https://readdy.ai/api/search-image?query=smiling%20woman%20portrait%20warm%20background%20headshot&width=100&height=100&seq=rvw1&orientation=squarish' },
  { name: 'Георги П.', rating: 5, date: '3 Февруари 2025', text: 'Продуктът надмина очакванията ми. Много добро качество за цената. Бърза доставка.', avatar: 'https://readdy.ai/api/search-image?query=smiling%20man%20portrait%20warm%20background%20headshot&width=100&height=100&seq=rvw2&orientation=squarish' },
  { name: 'Елена Д.', rating: 4, date: '20 Януари 2025', text: 'Много съм доволна. Малко по-дълго от очакваното за свикване, но резултатите са фантастични.', avatar: 'https://readdy.ai/api/search-image?query=smiling%20woman%2030s%20portrait%20headshot&width=100&height=100&seq=rvw3&orientation=squarish' },
];

interface ProductTabsProps {
  product: ApiProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const tabs = [
    { id: 'description' as const, label: 'Описание', icon: 'ri-file-text-line' },
    { id: 'specs' as const, label: 'Спецификации', icon: 'ri-list-check' },
    { id: 'reviews' as const, label: `Отзиви (${product.reviewCount})`, icon: 'ri-star-line' },
  ];

  return (
    <div className="mt-16">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#1A0F08] text-[#1A0F08]'
                : 'border-transparent text-gray-500 hover:text-[#1A0F08]'
            }`}
          >
            <i className={`${tab.icon} text-base`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description */}
      {activeTab === 'description' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-gray-600 text-base leading-relaxed mb-8">{product.description}</p>
            <h4 className="font-semibold text-[#1A0F08] mb-4 text-lg">Предимства</h4>
            <ul className="space-y-3">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-[#C17A3A] font-bold"></i>
                  </div>
                  <span className="text-gray-700 text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden bg-[#F5EFE6] p-8">
            <h4 className="font-semibold text-[#1A0F08] mb-4 text-lg">Защо да изберете нас?</h4>
            <div className="space-y-4">
              {[
                { icon: 'ri-truck-line', title: 'Бърза доставка', desc: 'До 2 работни дни в цяла България' },
                { icon: 'ri-shield-check-line', title: '30-дневна гаранция', desc: 'Връщане без въпроси' },
                { icon: 'ri-customer-service-2-line', title: 'Поддръжка', desc: 'Отговаряме в рамките на 2 часа' },
                { icon: 'ri-leaf-line', title: 'Натурални материали', desc: 'Само сертифицирани продукти' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white flex-shrink-0">
                    <i className={`${item.icon} text-[#C17A3A] text-base`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A0F08] text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specs */}
      {activeTab === 'specs' && (
        <div className="max-w-2xl">
          <div className="rounded-2xl overflow-hidden border border-gray-100">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div
                key={key}
                className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? 'bg-[#FAFAF7]' : 'bg-white'}`}
              >
                <span className="text-sm text-gray-500 font-medium">{SPEC_LABELS[key] ?? key}</span>
                <span className="text-sm font-semibold text-[#1A0F08]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {activeTab === 'reviews' && (
        <div>
          {/* Rating Summary */}
          <div className="flex items-center gap-8 mb-10 p-6 rounded-2xl bg-[#F5EFE6]">
            <div className="text-center flex-shrink-0">
              <p className="text-6xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>{product.rating}</p>
              <div className="flex justify-center my-2">
                {[1,2,3,4,5].map(s => (
                  <i key={s} className="ri-star-fill text-[#F5C842] text-lg"></i>
                ))}
              </div>
              <p className="text-xs text-gray-500">{product.reviewCount} отзива</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5,4,3,2,1].map(star => {
                const pct = star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : star === 2 ? 1 : 1;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-4">{star}</span>
                    <i className="ri-star-fill text-[#F5C842] text-xs"></i>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-[#F5C842] rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-400 w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {mockReviews.map((r, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={r.avatar} alt={r.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#1A0F08] text-sm">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                    <div className="flex mb-2">
                      {[1,2,3,4,5].map(s => (
                        <i key={s} className={`${s <= r.rating ? 'ri-star-fill text-[#F5C842]' : 'ri-star-line text-gray-300'} text-xs`}></i>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
