
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { apiGet, apiGetAllCatalogProducts, apiSend } from '@/lib/api';
import BoxNowPicker from './components/BoxNowPicker';
import type { BoxNowLockerSelection } from '@/services/shipping/boxnow';
import { getOffices as getSpeedyOffices, getLockers as getSpeedyLockers } from '@/services/shipping/speedy';

type ShippingProviderId = 'speedy' | 'econt' | 'boxnow';
type ShippingTypeId = 'address' | 'office' | 'locker';

type ShippingOffice = {
  id: string;
  name: string;
  city: string;
  address: string;
};

const SHIPPING_LABELS = {
  bg: {
    delivery: 'Доставка',
    cheapest: 'Най-изгоден куриер',
    useFavorite: 'Попълни любим адрес',
    saveFavorite: 'Запази като любим адрес',
  },
  en: {
    delivery: 'Delivery',
    cheapest: 'Cheapest provider',
    useFavorite: 'Prefill favorite address',
    saveFavorite: 'Save as favorite address',
  },
} as const;

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    neighborhood: '',
    street: '',
    streetNo: '',
    block: '',
    entrance: '',
    floor: '',
    apartment: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    ibanName: '',
    ibanNumber: '',
    notes: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<{ id: number; name: string; quantity: number; price: number }[]>([]);
  const [shippingProvider, setShippingProvider] = useState<ShippingProviderId>('speedy');
  const [shippingType, setShippingType] = useState<ShippingTypeId>('address');
  const [shippingOffices, setShippingOffices] = useState<ShippingOffice[]>([]);
  const [shippingLockers, setShippingLockers] = useState<ShippingOffice[]>([]);
  const [shippingQuery, setShippingQuery] = useState('');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [freeShippingApplied, setFreeShippingApplied] = useState(false);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>('');
  const [locale, setLocale] = useState<'bg' | 'en'>('bg');
  const [favoriteAddress, setFavoriteAddress] = useState<any>(null);
  const [cheapestProvider, setCheapestProvider] = useState<{ provider: ShippingProviderId; price: number } | null>(null);
  const [boxNowLocker, setBoxNowLocker] = useState<BoxNowLockerSelection | null>(null);
  const [speedyTab, setSpeedyTab] = useState<'address' | 'office' | 'locker'>('address');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState('');
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - voucherDiscount);
  const total = Math.max(0, discountedSubtotal + shippingPrice);
  const estimatedWeight = cartItems.reduce((sum, item) => sum + item.quantity * 0.5, 0);
  const requiredBoxSize: 1 | 2 | 3 = estimatedWeight <= 1 ? 1 : estimatedWeight <= 3 ? 2 : 3;
  const labels = SHIPPING_LABELS[locale];

  useEffect(() => {
    Promise.all([apiGet<any[]>('/api/cart'), apiGetAllCatalogProducts()])
      .then(([cartRows, products]) => {
        const byId = new Map<number, any>(products.map((p) => [Number(p.id), p]));
        const mapped = cartRows.map((row) => {
          const product = byId.get(Number(row.productId));
          return {
            id: Number(row.id),
            name: product?.name || `Продукт #${row.productId}`,
            quantity: Number(row.quantity || 1),
            price: Number(product?.price || 0),
          };
        });
        setCartItems(mapped);
      })
      .catch(() => setCartItems([]));
  }, []);

  useEffect(() => {
    apiGet('/api/profile/shipping-favorite')
      .then((data) => setFavoriteAddress(data))
      .catch(() => setFavoriteAddress(null));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('kvas_checkout_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...draft.formData }));
        if (draft.shippingProvider) setShippingProvider(draft.shippingProvider);
        if (draft.shippingType) setShippingType(draft.shippingType);
      } catch {
        // ignore invalid local draft
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'kvas_checkout_draft',
      JSON.stringify({ formData, shippingProvider, shippingType }),
    );
  }, [formData, shippingProvider, shippingType]);

  useEffect(() => {
    const loadPickupPoints = async () => {
      setShippingLoading(true);
      try {
        if (shippingProvider === 'boxnow') {
          const lockers = await apiGet<ShippingOffice[]>(`/api/shipping/boxnow/lockers?city=${encodeURIComponent(formData.city || '')}`);
          setShippingLockers(lockers);
          setShippingOffices([]);
          setShippingType('locker');
        } else {
          if (shippingProvider === 'speedy') {
            const [offices, lockers] = await Promise.all([
              getSpeedyOffices(formData.city || ''),
              getSpeedyLockers(formData.city || ''),
            ]);
            setShippingOffices((offices || []).map((o: any) => ({
              id: String(o.id || ''),
              name: String(o.name || 'Speedy Office'),
              city: String(o.city || ''),
              address: String(o.address || o.addressLine1 || ''),
            })));
            setShippingLockers((lockers || []).map((o: any) => ({
              id: String(o.id || ''),
              name: String(o.code || o.name || 'Speedy Locker'),
              city: String(o.city || ''),
              address: String(o.address || o.addressLine1 || ''),
            })));
          } else {
            const offices = await apiGet<ShippingOffice[]>(`/api/shipping/${shippingProvider}/offices?city=${encodeURIComponent(formData.city || '')}`);
            setShippingOffices(offices);
            setShippingLockers([]);
          }
        }
      } catch {
        setShippingOffices([]);
        setShippingLockers([]);
      } finally {
        setShippingLoading(false);
      }
    };
    void loadPickupPoints();
  }, [shippingProvider, formData.city]);

  useEffect(() => {
    const calculateShipping = async () => {
      try {
        const quote = await apiSend<{ price: number; freeShippingApplied: boolean; estimatedDeliveryDate: string }>(
          '/api/shipping/calculate',
          'POST',
          {
            provider: shippingProvider,
            shippingType,
            orderSubtotal: discountedSubtotal,
            city: formData.city,
          },
        );
        setShippingPrice(Number(quote.price || 0));
        setFreeShippingApplied(Boolean(quote.freeShippingApplied));
        setEstimatedDeliveryDate(quote.estimatedDeliveryDate || '');
      } catch {
        setShippingPrice(0);
        setFreeShippingApplied(false);
        setEstimatedDeliveryDate('');
      }
    };
    if (subtotal > 0) {
      void calculateShipping();
    }
  }, [shippingProvider, shippingType, subtotal, discountedSubtotal, formData.city]);

  useEffect(() => {
    const detectCheapest = async () => {
      try {
        const providers: ShippingProviderId[] = ['speedy', 'econt', 'boxnow'];
        const quotes = await Promise.all(
          providers.map(async (provider) => {
            const quote = await apiSend<{ price: number }>('/api/shipping/calculate', 'POST', {
              provider,
              shippingType: provider === 'boxnow' ? 'locker' : 'address',
              orderSubtotal: subtotal,
              city: formData.city,
            });
            return { provider, price: Number(quote.price || 0) };
          }),
        );
        quotes.sort((a, b) => a.price - b.price);
        setCheapestProvider(quotes[0] || null);
      } catch {
        setCheapestProvider(null);
      }
    };
    if (subtotal > 0) {
      void detectCheapest();
    }
  }, [subtotal, formData.city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const prefillFavoriteAddress = () => {
    if (!favoriteAddress) return;
    setFormData((prev) => ({
      ...prev,
      address: favoriteAddress.address || prev.address,
      city: favoriteAddress.city || prev.city,
      postalCode: favoriteAddress.postCode || prev.postalCode,
      phone: favoriteAddress.phone || prev.phone,
    }));
  };

  const saveFavoriteAddress = async () => {
    await apiSend('/api/profile/shipping-favorite', 'PUT', {
      address: formData.address,
      city: formData.city,
      postCode: formData.postalCode,
      phone: formData.phone,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Моля, попълнете всички задължителни полета.');
      return;
    }
    if (shippingType === 'address' && (!formData.address || !formData.city || !formData.postalCode)) {
      alert('Моля, попълнете адреса за доставка.');
      return;
    }

    if (shippingType === 'office' && (!formData.ibanName || !formData.ibanNumber)) {
      alert('Моля, изберете офис чрез полето Име/Код на офис и Адрес на офис.');
      return;
    }
    if (shippingType === 'locker' && !formData.ibanName) {
      alert('Моля, изберете locker.');
      return;
    }
    if (shippingProvider === 'boxnow' && !boxNowLocker?.lockerId) {
      alert('Моля, изберете BoxNow автомат.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Моля, въведете валиден имейл адрес.');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (!phoneRegex.test(formData.phone) || formData.phone.length < 8) {
      alert('Моля, въведете валиден телефонен номер.');
      return;
    }
    if (shippingProvider === 'boxnow' && !/^\+359\d{9}$/.test(formData.phone)) {
      alert('За BoxNow телефонът трябва да е във формат +359XXXXXXXXX.');
      return;
    }

    setCheckoutError(null);
    try {
      const response = await apiSend<{ checkoutUrl?: string }>('/api/checkout/place-order', 'POST', {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postCode: formData.postalCode,
      notes: formData.notes,
      shippingProvider,
      shippingType,
      shippingAddress: shippingType === 'address'
        ? (shippingProvider === 'speedy'
            ? [formData.street, formData.streetNo, formData.block && `бл. ${formData.block}`, formData.entrance && `вх. ${formData.entrance}`, formData.floor && `ет. ${formData.floor}`, formData.apartment && `ап. ${formData.apartment}`]
                .filter(Boolean)
                .join(', ')
            : formData.address)
        : null,
      shippingCity: shippingType === 'address' ? formData.city : null,
      shippingPostCode: shippingProvider === 'boxnow' ? boxNowLocker?.postalCode : shippingType === 'address' ? formData.postalCode : null,
      shippingOfficeId: shippingType === 'office' ? formData.ibanName : null,
      shippingOfficeName: shippingProvider === 'boxnow' ? boxNowLocker?.name : shippingType === 'office' ? formData.ibanNumber : null,
      shippingLockerId: shippingProvider === 'boxnow' ? boxNowLocker?.lockerId : shippingType === 'locker' ? formData.ibanName : null,
      paymentMethod,
      voucherCode: voucherCode.trim() || null,
    });

      if (paymentMethod === 'card' && response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
        return;
      }
    } catch (error) {
      setCheckoutError((error as Error).message || 'Грешка при създаване на поръчката');
      return;
    }

    setOrderPlaced(true);
    localStorage.removeItem('kvas_checkout_draft');
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const applyVoucher = async () => {
    const code = voucherCode.trim();
    if (!code) {
      setVoucherDiscount(0);
      setVoucherMessage('');
      return;
    }
    try {
      const result = await apiSend<{ valid: boolean; amount: number; status: string }>('/api/vouchers/validate', 'POST', { code });
      if (result.valid) {
        const discount = Number(result.amount || 0);
        setVoucherDiscount(discount);
        setVoucherMessage(`Ваучерът е приложен: -${discount.toFixed(2)} лв`);
      } else {
        setVoucherDiscount(0);
        setVoucherMessage(`Невалиден ваучер (${result.status || 'INVALID'})`);
      }
    } catch {
      setVoucherDiscount(0);
      setVoucherMessage('Грешка при валидиране на ваучера');
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>
          <h2 className="text-3xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Поръчката е Приета!
          </h2>
          <p className="text-gray-600 mb-2">
            Благодарим Ви за поръчката!
          </p>
          <p className="text-sm text-gray-500">
            Ще получите потвърждение на имейл адреса, който сте посочили.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-[#2C1810] mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            Завършване на Поръчката
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Section - Forms */}
              <div className="lg:col-span-8 space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Лични Данни</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Име *</label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия *</label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Имейл *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Адрес за Доставка</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Адрес *</label>
                      <input 
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Улица, номер, етаж, апартамент"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                      />
                    </div>
                    {shippingProvider === 'speedy' && shippingType === 'address' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Квартал</label>
                          <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Улица</label>
                          <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">№</label>
                          <input type="text" name="streetNo" value={formData.streetNo} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Блок</label>
                          <input type="text" name="block" value={formData.block} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Вход</label>
                          <input type="text" name="entrance" value={formData.entrance} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Етаж / Ап.</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" name="floor" value={formData.floor} onChange={handleInputChange} placeholder="Етаж" className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm" />
                            <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Ап." className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Град *</label>
                        <input 
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Пощенски код *</label>
                        <input 
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Бележки към поръчката</label>
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Допълнителна информация за доставката..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Shipping Provider */}
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#2C1810]">{labels.delivery}</h2>
                    <button
                      type="button"
                      onClick={() => setLocale((p) => (p === 'bg' ? 'en' : 'bg'))}
                      className="text-xs px-3 py-1 rounded-full border border-gray-300"
                    >
                      {locale.toUpperCase()}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button type="button" onClick={prefillFavoriteAddress} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                      {labels.useFavorite}
                    </button>
                    <button type="button" onClick={() => void saveFavoriteAddress()} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                      {labels.saveFavorite}
                    </button>
                  </div>
                  {cheapestProvider && (
                    <div className="mb-4 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      {labels.cheapest}: <strong>{cheapestProvider.provider.toUpperCase()}</strong> ({cheapestProvider.price.toFixed(2)} лв)
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'speedy', title: 'Speedy', desc: 'До адрес / офис / автомат', eta: '1-2 дни' },
                      { id: 'econt', title: 'Econt', desc: 'До адрес или офис', eta: '1-2 дни' },
                      { id: 'boxnow', title: 'BoxNow', desc: 'До locker box', eta: '1 ден' },
                    ].map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => {
                          setShippingProvider(provider.id as ShippingProviderId);
                          if (provider.id === 'boxnow') {
                            setShippingType('locker');
                          } else if (provider.id === 'speedy') {
                            setShippingType(speedyTab);
                          } else {
                            setShippingType('address');
                          }
                        }}
                        className={`text-left border rounded-xl p-4 transition-colors ${
                          shippingProvider === provider.id ? 'border-[#2C1810] bg-[#FAF8F5]' : 'border-gray-200 hover:border-[#2C1810]'
                        }`}
                      >
                        <p className="font-semibold text-[#2C1810]">{provider.title}</p>
                        <p className="text-xs text-gray-600">{provider.desc}</p>
                        <p className="text-xs text-gray-400 mt-1">Срок: {provider.eta}</p>
                      </button>
                    ))}
                  </div>

                  {shippingProvider === 'speedy' && (
                    <div className="mb-4 flex gap-2">
                      {[
                        { id: 'address', label: 'До адрес' },
                        { id: 'office', label: 'До офис' },
                        { id: 'locker', label: 'До автомат' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setSpeedyTab(tab.id as 'address' | 'office' | 'locker');
                            setShippingType(tab.id as ShippingTypeId);
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm border ${speedyTab === tab.id ? 'bg-[#1A0F08] text-white border-[#1A0F08]' : 'border-gray-300 text-gray-700'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {shippingProvider !== 'boxnow' && shippingProvider !== 'speedy' && (
                    <div className="mb-4 flex gap-4">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={shippingType === 'address'}
                          onChange={() => setShippingType('address')}
                        />
                        До адрес
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={shippingType === 'office'}
                          onChange={() => setShippingType('office')}
                        />
                        До офис
                      </label>
                    </div>
                  )}

                  {shippingProvider === 'boxnow' && (
                    <div className="mb-4">
                      <BoxNowPicker
                        selected={boxNowLocker}
                        requiredSize={requiredBoxSize}
                        onSelect={(selection) => {
                          setBoxNowLocker(selection);
                          setFormData((prev) => ({ ...prev, ibanName: selection.lockerId, ibanNumber: selection.address }));
                        }}
                      />
                    </div>
                  )}

                  {shippingType === 'office' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Избор на офис</label>
                      <input
                        value={shippingQuery}
                        onChange={(e) => setShippingQuery(e.target.value)}
                        placeholder="Търси офис..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                        {shippingOffices
                          .filter((x) => `${x.name} ${x.city}`.toLowerCase().includes(shippingQuery.toLowerCase()))
                          .map((office) => (
                            <button
                              key={office.id}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, ibanName: office.id, ibanNumber: `${office.name}, ${office.address}` }))}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-b-0"
                            >
                              <p className="font-medium">{office.name}</p>
                              <p className="text-xs text-gray-500">{office.address}</p>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {shippingProvider === 'speedy' && shippingType === 'locker' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Избор на автомат</label>
                      <input
                        value={shippingQuery}
                        onChange={(e) => setShippingQuery(e.target.value)}
                        placeholder="Търси автомат..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                        {shippingLockers
                          .filter((x) => `${x.name} ${x.city}`.toLowerCase().includes(shippingQuery.toLowerCase()))
                          .map((locker) => (
                            <button
                              key={locker.id}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, ibanName: locker.id, ibanNumber: `${locker.name}, ${locker.address}` }))}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-b-0"
                            >
                              <p className="font-medium">{locker.name}</p>
                              <p className="text-xs text-gray-500">{locker.address}</p>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {shippingType !== 'address' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {shippingType === 'locker' ? 'Locker ID' : 'Офис ID'}
                        </label>
                        <input
                          type="text"
                          name="ibanName"
                          value={formData.ibanName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {shippingType === 'locker' ? 'Адрес на locker' : 'Адрес на офис'}
                        </label>
                        <input
                          type="text"
                          name="ibanNumber"
                          value={formData.ibanNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {shippingLoading && <p className="text-xs text-gray-500 mt-2">Зареждане на офиси/locker-и...</p>}
                  {estimatedDeliveryDate && <p className="text-xs text-gray-500 mt-2">Очаквана доставка: {estimatedDeliveryDate}</p>}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Метод на Плащане</h2>
                  
                  <div className="space-y-4 mb-6">
                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-[#2C1810] ${paymentMethod === 'card' ? 'border-[#2C1810] bg-[#FAF8F5]' : 'border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 mr-3 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="ri-bank-card-line text-xl text-[#2C1810]"></i>
                          <span className="font-medium text-gray-900">Плащане с Карта</span>
                        </div>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Maestro</p>
                      </div>
                    </label>

                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-[#2C1810] ${paymentMethod === 'cash' ? 'border-[#2C1810] bg-[#FAF8F5]' : 'border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 mr-3 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="ri-money-dollar-circle-line text-xl text-[#2C1810]"></i>
                          <span className="font-medium text-gray-900">Наложен Платеж</span>
                        </div>
                        <p className="text-sm text-gray-600">Плащане в брой при доставка</p>
                      </div>
                    </label>

                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-[#2C1810] ${paymentMethod === 'bank' ? 'border-[#2C1810] bg-[#FAF8F5]' : 'border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 mr-3 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="ri-bank-line text-xl text-[#2C1810]"></i>
                          <span className="font-medium text-gray-900">Банков Превод</span>
                        </div>
                        <p className="text-sm text-gray-600">Директен превод по IBAN</p>
                      </div>
                    </label>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700">
                      При натискане на "Завърши Поръчката" ще бъдете пренасочени към защитена Stripe Checkout страница.
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === 'bank' && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-4">Банкови данни за превод:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Получател:</span>
                          <span className="font-medium">Квасен Хляб ЕООД</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IBAN:</span>
                          <span className="font-medium font-mono">BG80 BNBG 9661 3000 1234 56</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">BIC:</span>
                          <span className="font-medium font-mono">BNBGBGSD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Банка:</span>
                          <span className="font-medium">Българска Народна Банка</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-4">
                        * Моля, посочете номера на поръчката в основанието за превод
                      </p>
                    </div>
                  )}

                  {/* Cash on Delivery Info */}
                  {paymentMethod === 'cash' && (
                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <i className="ri-information-line text-xl text-green-600 mt-1"></i>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">Информация за наложен платеж</h3>
                          <p className="text-sm text-gray-700">
                            Ще заплатите поръчката в брой при получаване от куриера. 
                            Моля, подгответе точната сума или куриерът ще Ви върне ресто.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-32">
                  {checkoutError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {checkoutError}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Вашата Поръчка</h2>
                  
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} лв
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Промо код / ваучер</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        placeholder="Въведи код"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyVoucher}
                        className="px-4 py-2 rounded-lg bg-[#2C1810] text-white text-sm font-medium cursor-pointer"
                      >
                        Приложи
                      </button>
                    </div>
                    {voucherMessage && <p className="mt-2 text-xs text-gray-600">{voucherMessage}</p>}
                  </div>
                  
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>Междинна сума:</span>
                      <span className="font-medium">{subtotal.toFixed(2)} лв</span>
                    </div>
                    {voucherDiscount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Отстъпка от ваучер:</span>
                        <span className="font-medium">-{voucherDiscount.toFixed(2)} лв</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>След ваучер:</span>
                      <span className="font-medium">{discountedSubtotal.toFixed(2)} лв</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Доставка:</span>
                      <span className="font-medium">{shippingPrice.toFixed(2)} лв</span>
                    </div>
                    {freeShippingApplied && (
                      <div className="flex justify-between text-green-700 text-sm">
                        <span>Безплатна доставка:</span>
                        <span className="font-medium">приложена</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-xl font-bold text-[#2C1810] mb-8">
                    <span>Обща сума:</span>
                    <span>{total.toFixed(2)} лв</span>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#2C1810] text-white text-center rounded-full font-medium hover:bg-[#3D2415] transition-colors shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    Завърши Поръчката
                  </button>
                  
                  <Link 
                    to="/cart"
                    className="block w-full mt-4 py-4 bg-white text-[#2C1810] text-center rounded-full font-medium border-2 border-[#2C1810] hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Назад към Кошницата
                  </Link>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <i className="ri-shield-check-line text-green-600"></i>
                      <span>Сигурно плащане</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="ri-truck-line text-blue-600"></i>
                      <span>Безплатна доставка над 80 лв</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
