export interface BundleItem {
  name: string;
  qty: number;
  icon: string;
}

export interface Bundle {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  oldPrice: number;
  badge: string;
  imgQuery: string;
  items: BundleItem[];
  highlight: string;
  color: string;
}

export const bundles: Bundle[] = [
  {
    id: 101,
    name: 'Starter Kit за Начинаещи',
    subtitle: 'Всичко необходимо за вашия първи квасен хляб',
    price: 89.99,
    oldPrice: 129.90,
    badge: 'Хит',
    imgQuery: 'sourdough starter beginner baking kit glass jar banneton basket lame knife linen cloth measuring spoon recipe card arranged flat lay warm linen background rustic artisan style lifestyle product photography',
    highlight: 'Спестявате 39.91 лв',
    color: '#F5C842',
    items: [
      { name: 'Стъклен буркан за квас', qty: 1, icon: 'ri-goblet-line' },
      { name: 'Силиконова шпатула', qty: 1, icon: 'ri-restaurant-line' },
      { name: 'Кошница за втасване', qty: 1, icon: 'ri-inbox-line' },
      { name: 'Резец (lame) с ножчета', qty: 1, icon: 'ri-scissors-cut-line' },
      { name: 'Карта с рецепта', qty: 1, icon: 'ri-file-text-line' },
      { name: 'Ленено платно', qty: 1, icon: 'ri-layout-line' },
      { name: 'Мерителна лъжица', qty: 1, icon: 'ri-cup-line' },
    ],
  },
  {
    id: 102,
    name: 'Deluxe Комплект за Квас',
    subtitle: 'Разширена колекция за сериозния пекар',
    price: 179.99,
    oldPrice: 249.90,
    badge: 'Премиум',
    imgQuery: 'deluxe premium sourdough baking kit collection glass jar oval round banneton baskets lame knife set linen cloth ceramic bowl scale professional artisan flat lay dark moody studio photography',
    highlight: 'Спестявате 69.91 лв',
    color: '#C17A3A',
    items: [
      { name: 'Буркан за квас 2 л', qty: 1, icon: 'ri-goblet-line' },
      { name: 'Шпатула комплект', qty: 2, icon: 'ri-restaurant-line' },
      { name: 'Овална кошница за втасване', qty: 1, icon: 'ri-inbox-line' },
      { name: 'Кръгла кошница за втасване', qty: 1, icon: 'ri-inbox-line' },
      { name: 'Резец (lame) Про', qty: 1, icon: 'ri-scissors-cut-line' },
      { name: 'Резервни ножчета (10 бр)', qty: 10, icon: 'ri-scissors-cut-line' },
      { name: 'Карти с рецепти (5 бр)', qty: 5, icon: 'ri-file-text-line' },
      { name: 'Ленено платно 70×50 см', qty: 1, icon: 'ri-layout-line' },
      { name: 'Мерителна лъжица', qty: 2, icon: 'ri-cup-line' },
    ],
  },
  {
    id: 103,
    name: 'Подаръчен Комплект за Любител Пекар',
    subtitle: 'Идеалният подарък за всеки хлебар',
    price: 129.99,
    oldPrice: 179.90,
    badge: 'Подарък',
    imgQuery: 'artisan baker gift set elegant packaging natural kraft box linen ribbon banneton basket lame knife recipe cards sourdough baking tools warm studio photography neutral background',
    highlight: 'Подаръчна опаковка безплатно',
    color: '#8B6B47',
    items: [
      { name: 'Буркан за квас', qty: 1, icon: 'ri-goblet-line' },
      { name: 'Дървена шпатула', qty: 1, icon: 'ri-restaurant-line' },
      { name: 'Кошница за втасване', qty: 1, icon: 'ri-inbox-line' },
      { name: 'Резец (lame)', qty: 1, icon: 'ri-scissors-cut-line' },
      { name: 'Резервни ножчета', qty: 5, icon: 'ri-scissors-cut-line' },
      { name: 'Карта с рецепта', qty: 2, icon: 'ri-file-text-line' },
      { name: 'Ленено платно', qty: 1, icon: 'ri-layout-line' },
      { name: 'Мерителна лъжица', qty: 1, icon: 'ri-cup-line' },
    ],
  },
  {
    id: 104,
    name: 'Комплект "Първи Хляб"',
    subtitle: 'Минималистичен старт — само същественото',
    price: 59.99,
    oldPrice: 84.90,
    badge: 'За Начало',
    imgQuery: 'minimalist sourdough first bread starter kit glass jar small banneton linen cloth recipe card wooden spoon minimal clean flat lay cream white background lifestyle product photography',
    highlight: 'Спестявате 24.91 лв',
    color: '#6B8E6B',
    items: [
      { name: 'Буркан за квас', qty: 1, icon: 'ri-goblet-line' },
      { name: 'Шпатула', qty: 1, icon: 'ri-restaurant-line' },
      { name: 'Кошница за втасване', qty: 1, icon: 'ri-inbox-line' },
      { name: 'Резец (lame) с ножче', qty: 1, icon: 'ri-scissors-cut-line' },
      { name: 'Карта с рецепта', qty: 1, icon: 'ri-file-text-line' },
      { name: 'Мерителна лъжица', qty: 1, icon: 'ri-cup-line' },
    ],
  },
];

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  frequency: string;
  desc: string;
  items: string[];
  popular: boolean;
  color: string;
  icon: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Стартер',
    price: 39.99,
    frequency: 'на месец',
    desc: 'Идеален за начинаещи — брашна и основни консумативи всеки месец',
    popular: false,
    color: '#F5C842',
    icon: 'ri-seedling-line',
    items: [
      '2× брашна по избор (1 кг всяко)',
      '1× пакет с ръжено брашно',
      'Подбрани консумативи',
      'Рецепта на месеца',
      'Достъп до Members клуб',
    ],
  },
  {
    id: 'baker',
    name: 'Baker\'s Box',
    price: 69.99,
    frequency: 'на месец',
    desc: 'Пълна кутия с брашна, инструменти и изненади за активния пекар',
    popular: true,
    color: '#C17A3A',
    icon: 'ri-bread-line',
    items: [
      '4× премиум брашна',
      '1× нов инструмент или аксесоар',
      'Сезонни изненади',
      '2× рецепти с видео',
      'Достъп до Members клуб',
      '10% отстъпка в магазина',
    ],
  },
  {
    id: 'artisan',
    name: 'Artisan Pro',
    price: 119.99,
    frequency: 'на месец',
    desc: 'Всичко за сериозния занаятчийски пекар — пълно оборудване и ексклузивен достъп',
    popular: false,
    color: '#1A0F08',
    icon: 'ri-award-line',
    items: [
      '6× органични брашна (различни видове)',
      '2× нови инструмента или оборудване',
      'Ексклузивни рецепти преди всички',
      'Личен консулт с майстор пекар (30 мин)',
      'Достъп до ALL premium курсове',
      '20% отстъпка в магазина',
      'Приоритетна доставка',
    ],
  },
];
