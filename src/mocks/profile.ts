export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  imgQuery: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Доставена' | 'В процес' | 'Изпратена' | 'Отказана';
  total: number;
  items: OrderItem[];
  address: string;
  trackingNumber?: string;
}

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  imgQuery: string;
  category: string;
  badge?: string;
  rating: number;
  inStock: boolean;
}

export interface UserSubscription {
  planId: string;
  planName: string;
  price: number;
  frequency: string;
  status: 'Активен' | 'Пауза' | 'Отказан';
  nextDelivery: string;
  startDate: string;
  color: string;
  items: string[];
  discount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarQuery: string;
  joinDate: string;
  address: string;
  city: string;
  postCode: string;
  loyaltyPoints: number;
}

export const userProfile: UserProfile = {
  name: 'Мария Иванова',
  email: 'maria.ivanova@example.com',
  phone: '+359 888 123 456',
  avatarQuery: 'professional woman portrait warm studio natural light soft smile friendly dark hair elegant casual',
  joinDate: 'Март 2023',
  address: 'ул. Витоша 45, ет. 3',
  city: 'София',
  postCode: '1000',
  loyaltyPoints: 1240,
};

export const userOrders: Order[] = [
  {
    id: '#ORD-2401',
    date: '15 Ян 2025',
    status: 'Доставена',
    total: 234.98,
    address: 'ул. Витоша 45, ет. 3, 1000 София',
    trackingNumber: 'BG12345678',
    items: [
      { name: 'Холандска Печка 5 л', qty: 1, price: 189.99, imgQuery: 'enameled cast iron dutch oven cream round lid artisan bread baking' },
      { name: 'Ленена Покривка', qty: 1, price: 28.99, imgQuery: 'natural linen bread proofing couche cloth beige folded' },
      { name: 'Нож за Рязане Про', qty: 1, price: 34.99, imgQuery: 'bread lame scoring knife natural wood handle sharp blade' },
    ],
  },
  {
    id: '#ORD-2389',
    date: '3 Яну 2025',
    status: 'Доставена',
    total: 89.99,
    address: 'ул. Витоша 45, ет. 3, 1000 София',
    trackingNumber: 'BG98765432',
    items: [
      { name: 'Дигитална Везна 5 кг', qty: 1, price: 89.99, imgQuery: 'modern sleek digital kitchen scale stainless steel platform precise LCD baking' },
    ],
  },
  {
    id: '#ORD-2367',
    date: '18 Дек 2024',
    status: 'Доставена',
    total: 149.99,
    address: 'ул. Витоша 45, ет. 3, 1000 София',
    trackingNumber: 'BG11223344',
    items: [
      { name: 'Стартер Кит за Начинаещи', qty: 1, price: 149.99, imgQuery: 'sourdough starter beginner kit flat lay glass jar banneton basket lame knife flour bag wooden tools' },
    ],
  },
  {
    id: '#ORD-2412',
    date: '20 Яну 2025',
    status: 'В процес',
    total: 57.98,
    address: 'ул. Витоша 45, ет. 3, 1000 София',
    items: [
      { name: 'Банетон Кошница Кръгла', qty: 1, price: 45.99, imgQuery: 'round woven rattan banneton proofing basket natural beige artisan sourdough' },
      { name: 'Скрепер Метален', qty: 1, price: 18.99, imgQuery: 'stainless steel bench scraper dough cutter sharp blade wooden handle professional' },
    ],
  },
  {
    id: '#ORD-2415',
    date: '21 Яну 2025',
    status: 'Изпратена',
    total: 219.99,
    address: 'ул. Витоша 45, ет. 3, 1000 София',
    trackingNumber: 'BG44556677',
    items: [
      { name: 'Холандска Печка 7 л', qty: 1, price: 219.99, imgQuery: 'large enameled cast iron dutch oven dark matte oval shape artisan bread baking' },
    ],
  },
];

export const favoriteProducts: FavoriteProduct[] = [
  {
    id: 5,
    name: 'Холандска Печка 5 л',
    price: 189.99,
    oldPrice: 229.99,
    imgQuery: 'enameled cast iron dutch oven 5 liter cream beige color with lid round shape artisan bread baking cookware studio warm neutral background',
    category: 'Оборудване',
    badge: 'Промоция',
    rating: 5.0,
    inStock: true,
  },
  {
    id: 1,
    name: 'Банетон Кошница Кръгла',
    price: 45.99,
    oldPrice: 59.99,
    imgQuery: 'round woven rattan banneton proofing basket natural beige artisan sourdough baking tool close up warm studio light clean cream background',
    category: 'Инструменти',
    badge: 'Хит',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 4,
    name: 'Дигитална Везна 5 кг',
    price: 89.99,
    imgQuery: 'modern sleek digital kitchen scale stainless steel platform precise LCD display minimal design baking measurements studio photography clean background',
    category: 'Оборудване',
    badge: 'Топ продукт',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 9,
    name: 'Нож за Рязане Про',
    price: 34.99,
    imgQuery: 'bread lame scoring knife natural wood handle sharp curved blade professional artisan sourdough baking tool studio photography clean white background warm tones',
    category: 'Инструменти',
    badge: 'Бестселър',
    rating: 4.8,
    inStock: true,
  },
  {
    id: 13,
    name: 'Стъклен Съд 3 л',
    price: 42.99,
    imgQuery: 'clear glass fermentation jar 3 liter transparent container sourdough starter storage with clip lid studio photography clean white background',
    category: 'Оборудване',
    badge: 'Ново',
    rating: 4.8,
    inStock: true,
  },
  {
    id: 18,
    name: 'Стартер Кит за Начинаещи',
    price: 149.99,
    oldPrice: 189.99,
    imgQuery: 'sourdough starter beginner kit flat lay glass jar banneton basket lame knife flour bag wooden tools arranged on linen cloth warm neutral background',
    category: 'Комплекти',
    badge: 'Промоция',
    rating: 5.0,
    inStock: true,
  },
];

export const userSubscription: UserSubscription = {
  planId: 'baker',
  planName: "Baker's Box",
  price: 69.99,
  frequency: 'на месец',
  status: 'Активен',
  nextDelivery: '1 Февруари 2025',
  startDate: 'Октомври 2024',
  color: '#C17A3A',
  items: [
    '4× премиум брашна',
    '1× нов инструмент или аксесоар',
    'Сезонни изненади',
    '2× рецепти с видео',
    'Достъп до Members клуб',
    '10% отстъпка в магазина',
  ],
  discount: 10,
};
