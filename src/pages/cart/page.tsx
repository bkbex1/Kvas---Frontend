import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, apiGetAllCatalogProducts, apiSend, normalizeProduct, toImageSrc, type ApiProduct } from '@/lib/api';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  desc: string;
  price: number;
  quantity: number;
  imgQuery: string;
  category: string;
}

const SHIPPING = [
  { id: 'standard', label: 'Стандартна доставка', sub: '3-5 работни дни', price: 6.99 },
  { id: 'express', label: 'Експресна доставка', sub: '1-2 работни дни', price: 12.99 },
  { id: 'free', label: 'Безплатна доставка', sub: 'Над 100 лв поръчка', price: 0 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState('free');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    Promise.all([apiGet<any[]>('/api/cart'), apiGetAllCatalogProducts()])
      .then(([cartRows, products]) => {
        const byId = new Map<number, ApiProduct>(products.map((p) => {
          const normalized = normalizeProduct(p);
          return [normalized.id, normalized];
        }));
        const mapped: CartItem[] = cartRows
          .map((row) => {
            const product = byId.get(Number(row.productId));
            if (!product) return null;
            return {
              id: Number(row.id),
              productId: product.id,
              name: product.name,
              desc: product.desc,
              price: product.price,
              quantity: Number(row.quantity || 1),
              imgQuery: product.imgQuery,
              category: product.categoryLabel,
            } as CartItem;
          })
          .filter(Boolean) as CartItem[];
        setItems(mapped);
      })
      .catch(() => setItems([]));
  }, []);

  const updateQty = async (id: number, delta: number) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const nextQty = Math.max(1, item.quantity + delta);
    await apiSend('/api/cart/items', 'POST', { productId: item.productId, quantity: nextQty });
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: nextQty } : i));
  };

  const removeItem = async (id: number) => {
    await apiSend<void>(`/api/cart/items/${id}`, 'DELETE');
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const applyPromo = () => {
    if (promo.toUpperCase() === 'КВАC10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Невалиден промо код');
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = SHIPPING.find(s => s.id === shipping)?.price ?? 0;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div className="pt-40 pb-24 px-8 text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 bg-[#F5EFE6] rounded-full">
            <i className="ri-shopping-cart-line text-4xl text-[#C17A3A]"></i>
          </div>
          <h1 className="text-3xl font-bold text-[#1A0F08] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Кошницата е празна</h1>
          <p className="text-gray-500 mb-8">Добавете продукти от нашия магазин, за да продължите.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A0F08] text-white rounded-full font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-store-line"></i> Към магазина
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <div className="pt-28 pb-24 px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Вашата кошница
            </h1>
            <p className="text-gray-500 mt-1">{items.length} {items.length === 1 ? 'артикул' : 'артикула'}</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-1">
            {['Кошница', 'Доставка', 'Плащане', 'Потвърждение'].map((step, i) => (
              <div key={step} className="flex items-center gap-3 flex-shrink-0">
                <div className={`flex items-center gap-2 ${i === 0 ? 'text-[#1A0F08]' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-[#1A0F08] text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{step}</span>
                </div>
                {i < 3 && <div className={`w-8 h-px ${i === 0 ? 'bg-[#1A0F08]' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ─── LEFT: Items ─── */}
            <div className="lg:col-span-7 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-5 items-start">
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5EFE6]">
                    <img src={toImageSrc(item.imgQuery, item.name)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[#C17A3A] text-xs font-semibold uppercase tracking-wide">{item.category}</span>
                        <h3 className="font-semibold text-[#1A0F08] text-base leading-tight mt-0.5">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                      >
                        <i className="ri-delete-bin-line text-base"></i>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                        >
                          <i className="ri-subtract-line text-sm"></i>
                        </button>
                        <span className="w-10 text-center font-semibold text-[#1A0F08] text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                        >
                          <i className="ri-add-line text-sm"></i>
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right">
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">{item.price.toFixed(2)} лв × {item.quantity}</p>
                        )}
                        <p className="font-bold text-[#1A0F08] text-lg">{(item.price * item.quantity).toFixed(2)} лв</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <Link to="/shop" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A0F08] transition-colors cursor-pointer w-fit">
                <i className="ri-arrow-left-line"></i>
                Продължи пазаруването
              </Link>
            </div>

            {/* ─── RIGHT: Summary ─── */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-8 sticky top-28">
                <h2 className="text-xl font-bold text-[#1A0F08] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Обобщение на поръчката
                </h2>

                {/* Shipping */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-[#1A0F08] mb-3">Метод на доставка</p>
                  <div className="space-y-2">
                    {SHIPPING.map(s => (
                      <label
                        key={s.id}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border-2 transition-all ${
                          shipping === s.id ? 'border-[#1A0F08] bg-[#FAFAF7]' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={s.id}
                            checked={shipping === s.id}
                            onChange={() => setShipping(s.id)}
                            className="accent-[#1A0F08]"
                          />
                          <div>
                            <p className="text-sm font-medium text-[#1A0F08]">{s.label}</p>
                            <p className="text-xs text-gray-400">{s.sub}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${s.price === 0 ? 'text-green-600' : 'text-[#1A0F08]'}`}>
                          {s.price === 0 ? 'БЕЗПЛАТНА' : `${s.price.toFixed(2)} лв`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-[#1A0F08] mb-3">Промо код</p>
                  {promoApplied ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                      <i className="ri-checkbox-circle-line text-green-600 text-lg"></i>
                      <span className="text-sm font-medium text-green-700">Код "КВАC10" приложен — 10% отстъпка!</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Въведете код..."
                        value={promo}
                        onChange={e => { setPromo(e.target.value); setPromoError(''); }}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#1A0F08] outline-none text-sm placeholder-gray-400"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 py-3 bg-[#1A0F08] text-white rounded-xl text-sm font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Приложи
                      </button>
                    </div>
                  )}
                  {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                  {!promoApplied && <p className="text-xs text-gray-400 mt-1">Опитайте: КВАC10</p>}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-5 border-t border-gray-100 border-b mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Продукти ({items.reduce((s, i) => s + i.quantity, 0)} бр.)</span>
                    <span className="font-medium">{subtotal.toFixed(2)} лв</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Доставка</span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                      {shippingCost === 0 ? 'Безплатна' : `${shippingCost.toFixed(2)} лв`}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Отстъпка (10%)</span>
                      <span className="font-medium">−{discount.toFixed(2)} лв</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-semibold text-[#1A0F08]">Общо с ДДС</span>
                  <span className="text-3xl font-bold text-[#1A0F08]">{total.toFixed(2)} лв</span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A0F08] text-white rounded-xl font-semibold text-base hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Продължи към плащане
                  <i className="ri-arrow-right-line text-lg"></i>
                </Link>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <i className="ri-lock-line text-sm"></i>
                    <span className="text-xs">SSL защита</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <i className="ri-shield-check-line text-sm"></i>
                    <span className="text-xs">Сигурно плащане</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <i className="ri-refresh-line text-sm"></i>
                    <span className="text-xs">30-дн. връщане</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
