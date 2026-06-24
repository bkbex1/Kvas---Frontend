export interface MysteryBox {
  id: number;
  name: string;
  description: string;
  price: number;
  originalValue: number;
  items: string[];
  imgQuery: string;
  badge?: string;
  available: boolean;
  stock: number;
}

export interface GiveawayProduct {
  id: number;
  name: string;
  imgQuery: string;
}

export interface GiveawayData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  sectionTitle: string;
  sectionDescription: string;
  activeGiveaway: boolean;
  giveawayTitle: string;
  giveawayDescription: string;
  giveawayEndsAt: string;
  giveawayPrize: string;
  giveawayPrizeImage: string;
  howToParticipate: { step: string; desc: string }[];
  termsAndConditions: string;
}

export const giveawayData: GiveawayData = {
  heroTitle: 'Giveaway & Mystery Boxes',
  heroSubtitle: 'Изненади и Награди',
  heroDescription: 'Участвайте в нашите томболи и поръчайте Mystery Box — кутия, пълна с изненади за любителите на занаятчийски хляб.',
  heroImage: 'https://readdy.ai/api/search-image?query=artisan%20sourdough%20bakery%20surprise%20gift%20box%20wooden%20crate%20with%20bread%20tools%20flour%20ribbon%20festive%20arrangement%20warm%20golden%20light%20rustic%20natural%20tones%20premium%20photography&width=1920&height=800&seq=giveaway-hero&orientation=landscape',
  sectionTitle: 'Текущ Giveaway',
  sectionDescription: 'Участвайте сега и спечелете изключителни награди',
  activeGiveaway: true,
  giveawayTitle: 'Спечели Професионален Комплект за Квасен Хляб',
  giveawayDescription: 'Разиграваме луксозен комплект за занаятчийско хлебопроизводство на стойност над 400 лв! Включва холандска печка, дигитална везна, банетон, нож за рязане, ленена покривка и брашна. За участие следвай нашите три прости стъпки.',
  giveawayEndsAt: '2025-01-31',
  giveawayPrize: 'Професионален Комплект за Квасен Хляб',
  giveawayPrizeImage: 'https://readdy.ai/api/search-image?query=professional%20sourdough%20baking%20complete%20premium%20kit%20banneton%20scale%20dutch%20oven%20lame%20tools%20arranged%20elegantly%20wooden%20surface%20warm%20soft%20lighting%20artisan%20gift%20set&width=800&height=600&seq=giveaway-prize&orientation=landscape',
  howToParticipate: [
    { step: 'Последвайте', desc: 'Последвайте нашия Instagram и Facebook профил @kvasenzanat' },
    { step: 'Харесайте', desc: 'Харесайте тази публикация и я споделете в сторито си' },
    { step: 'Отбележете', desc: 'Отбележете двама приятели в коментарите' },
  ],
  termsAndConditions: 'Участниците трябва да са над 18 години и да живеят в България. Победителят се избира на случаен принцип на 31.01.2025. Победителят ще бъде уведомен чрез директно съобщение. Доставката е безплатна. Замяна с парична сума не е възможна.',
};

export const mysteryBoxes: MysteryBox[] = [
  {
    id: 1,
    name: 'Mystery Box Starter',
    description: 'Перфектна кутия за начинаещи пекари — изненадващи продукти на изключителна цена.',
    price: 79.99,
    originalValue: 130,
    items: ['3-4 случайни продукта', 'Мини рецептна книга', 'Изненада', 'Персонална картичка'],
    imgQuery: 'mystery gift box sourdough starter kit brown kraft box with ribbon surprise artisan baking tools inside warm golden light clean studio photography',
    badge: 'Най-популярна',
    available: true,
    stock: 20,
  },
  {
    id: 2,
    name: 'Mystery Box Artisan',
    description: 'За по-напреднали пекари — висококачествени инструменти и специалитети.',
    price: 139.99,
    originalValue: 230,
    items: ['5-6 случайни продукта', 'Премиум инструмент', 'Рядко брашно', 'Изненада + картичка'],
    imgQuery: 'premium artisan mystery gift box dark elegant wooden crate with sourdough baking tools flour bread accessories luxury presentation warm moody lighting',
    badge: 'Бестселър',
    available: true,
    stock: 12,
  },
  {
    id: 3,
    name: 'Mystery Box Deluxe',
    description: 'Луксозна кутия за истинските ценители — само от най-доброто.',
    price: 219.99,
    originalValue: 400,
    items: ['7-9 случайни продукта', 'Холандска печка или везна', 'Специални брашна', 'Луксозна опаковка'],
    imgQuery: 'luxury deluxe mystery gift box premium sourdough artisan collection wooden box with velvet interior baking equipment tools elegant holiday gift photography',
    available: true,
    stock: 7,
  },
  {
    id: 4,
    name: 'Mystery Box Сезонна',
    description: 'Специална сезонна кутия с продукти, вдъхновени от текущия сезон.',
    price: 99.99,
    originalValue: 165,
    items: ['4-5 сезонни продукта', 'Сезонни рецепти', 'Специална изненада', 'Тематична декорация'],
    imgQuery: 'seasonal sourdough gift box autumn winter theme kraft packaging with pine cones cinnamon sticks artisan bread baking accessories warm cozy photography',
    badge: 'Ограничена',
    available: true,
    stock: 5,
  },
];

export const teamMembers = [
  {
    id: 1,
    name: 'Мария Иванова',
    role: 'Основател & CEO',
    bio: 'Страстен пекар с над 10 години опит в занаятчийския хляб. Основава Квасен Занаят с идеята да направи занаятчийското хлебопроизводство достъпно за всеки.',
    imgQuery: 'professional woman baker entrepreneur portrait smiling warm studio lighting natural tones confident mature elegant',
  },
  {
    id: 2,
    name: 'Георги Петров',
    role: 'Главен Пекар',
    bio: 'Обучаван в Париж и Копенхаген, Георги носи европейски стандарти за качество в нашия екип.',
    imgQuery: 'professional male baker chef portrait warm studio lighting natural tones friendly confident skilled',
  },
  {
    id: 3,
    name: 'Елена Димитрова',
    role: 'Мениджър Продукти',
    bio: 'Отговорна за подбора на всеки продукт в нашия каталог. Елена тества лично всичко преди да го предложим на клиентите.',
    imgQuery: 'professional woman product manager portrait smiling warm studio lighting natural tones friendly confident',
  },
  {
    id: 4,
    name: 'Иван Стоянов',
    role: 'Обслужване Клиенти',
    bio: 'Иван е лицето на нашата поддръжка. Винаги готов да помогне с въпроси, поръчки и съвети.',
    imgQuery: 'professional man customer service representative portrait smiling warm studio lighting natural tones friendly helpful',
  },
];

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyP1: string;
  storyP2: string;
  storyP3: string;
  values: { icon: string; title: string; desc: string; color: string }[];
}

export const aboutContent: AboutContent = {
  heroTitle: 'За Нас',
  heroSubtitle: 'Страстта към занаятчийския хляб ни обединява',
  storyTitle: 'Как Всичко Започна',
  storyP1: 'През 2018 година, движени от любовта към автентичния квасен хляб, решихме да създадем място, където всеки може да намери професионално оборудване и знания за производство на качествен хляб.',
  storyP2: 'Започнахме с малък магазин в София, но бързо разбрахме, че има огромна общност от хора, които споделят нашата страст. Днес обслужваме хиляди доволни клиенти в цяла България.',
  storyP3: 'Нашата мисия е да направим занаятчийското хлебопроизводство достъпно за всеки - от любители до професионални пекари.',
  values: [
    { icon: 'ri-heart-line', title: 'Страст', desc: 'Обичаме това, което правим и се стремим да предадем тази страст на нашите клиенти.', color: '#FFE4E1' },
    { icon: 'ri-shield-check-line', title: 'Качество', desc: 'Предлагаме само продукти, които сами бихме използвали в нашите кухни.', color: '#E0F2F7' },
    { icon: 'ri-team-line', title: 'Общност', desc: 'Изграждаме общност от хора, които споделят любовта към занаятчийския хляб.', color: '#FFF8DC' },
  ],
};
