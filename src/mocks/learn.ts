export interface Book {
  id: number;
  title: string;
  author: string;
  desc: string;
  price: number;
  oldPrice?: number;
  imgQuery: string;
  pages: number;
  language: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  category: 'book' | 'ebook';
}

export interface VideoLesson {
  id: number;
  title: string;
  instructor: string;
  desc: string;
  price: number;
  oldPrice?: number;
  imgQuery: string;
  duration: string;
  lessons: number;
  level: 'Начинаещи' | 'Средно' | 'Напреднали';
  badge?: string;
  rating: number;
  reviewCount: number;
  topics: string[];
}

export const books: Book[] = [
  {
    id: 1,
    title: 'Квасен Хляб от А до Я',
    author: 'Мария Стоянова',
    desc: 'Пълното ръководство за квасен хляб — от създаване на квас до майсторски декорации на кора.',
    price: 34.99,
    imgQuery: 'artisan sourdough bread baking book cover dark moody warm tones wheat grain texture elegant typography hardcover studio photography',
    pages: 320,
    language: 'Български',
    badge: 'Бестселър',
    rating: 4.9,
    reviewCount: 234,
    category: 'book',
  },
  {
    id: 2,
    title: 'Тайните на Ферментацията',
    author: 'Иван Георгиев',
    desc: 'Научен поглед към ферментацията и микробиологията зад перфектния квас. За любознателните пекари.',
    price: 28.99,
    imgQuery: 'fermentation science bread book cover microscopic yeast natural textures grain laboratory dark warm studio photography book design',
    pages: 256,
    language: 'Български',
    rating: 4.7,
    reviewCount: 89,
    category: 'book',
  },
  {
    id: 3,
    title: 'Whole Grain Baking',
    author: 'King Arthur Baking',
    desc: 'Класическата американска книга за пълнозърнесто печене. На английски, с над 400 рецепти.',
    price: 49.99,
    imgQuery: 'whole grain baking cookbook professional photography warm rustic wooden table multiple grain bread loaves cover design american artisan',
    pages: 448,
    language: 'Английски',
    badge: 'Импортирана',
    rating: 4.8,
    reviewCount: 156,
    category: 'book',
  },
  {
    id: 4,
    title: 'Наръчник на Пекаря — Електронно издание',
    author: 'Квасен Занаят',
    desc: 'Дигиталното издание на нашия собствен наръчник — с видео линкове и интерактивни диаграми.',
    price: 14.99,
    oldPrice: 24.99,
    imgQuery: 'digital ebook sourdough baker handbook minimalist design tablet screen recipe guide modern flat design warm amber colors',
    pages: 180,
    language: 'Български',
    badge: 'Digital',
    rating: 4.8,
    reviewCount: 312,
    category: 'ebook',
  },
  {
    id: 5,
    title: 'Хлябът на Майстора',
    author: 'Петър Колев',
    desc: 'Напреднали техники за формиране, скориране и печене. Включва 50 рецепти за ръчно изработен хляб.',
    price: 39.99,
    imgQuery: 'master baker bread book advanced techniques dark elegant cover sourdough artisan scoring patterns photography professional studio warm',
    pages: 380,
    language: 'Български',
    rating: 4.9,
    reviewCount: 117,
    category: 'book',
  },
  {
    id: 6,
    title: 'Пица и Фокача с Квас',
    author: 'Анна Павлова',
    desc: 'Всичко за пица, фокача и питки с квасена ферментация. Включва италиански техники.',
    price: 29.99,
    imgQuery: 'sourdough pizza focaccia cookbook italian style warm colors baking book rustic ingredients tomatoes herbs cover design photography',
    pages: 220,
    language: 'Български',
    badge: 'Ново',
    rating: 4.7,
    reviewCount: 68,
    category: 'book',
  },
];

export const videoLessons: VideoLesson[] = [
  {
    id: 1,
    title: 'Квас от Нулата — Пълен Курс',
    instructor: 'Мария Стоянова',
    desc: 'Стъпка по стъпка — от намесване на квас до изпичане на вашия първи перфектен хляб.',
    price: 79.99,
    oldPrice: 119.99,
    imgQuery: 'sourdough bread baking online course promo image instructor teaching kitchen hands mixing dough warm studio natural light professional',
    duration: '6 часа 30 мин',
    lessons: 24,
    level: 'Начинаещи',
    badge: 'Хит',
    rating: 4.9,
    reviewCount: 487,
    topics: ['Създаване на квас', 'Намесване', 'Ферментация', 'Оформяне', 'Печене', 'Съхранение'],
  },
  {
    id: 2,
    title: 'Майсторски Разрези и Декорации',
    instructor: 'Иван Георгиев',
    desc: 'Научете как да правите невероятни декоративни разрези върху хляба — листа, цветя, геометрични форми.',
    price: 49.99,
    imgQuery: 'sourdough bread scoring patterns artistic decorative cuts wheat leaf flower design tutorial hands lame knife demonstration video course',
    duration: '3 часа 15 мин',
    lessons: 14,
    level: 'Средно',
    badge: 'Популярен',
    rating: 4.8,
    reviewCount: 203,
    topics: ['Инструменти', 'Основни разрези', 'Флорални мотиви', 'Геометрия', 'Напреднали техники'],
  },
  {
    id: 3,
    title: 'Пълнозърнести Хлябове',
    instructor: 'Петър Колев',
    desc: 'Спелта, ъргъ, ечемик — научете как да работите с алтернативни брашна за по-здравословен хляб.',
    price: 59.99,
    imgQuery: 'whole grain ancient grain sourdough bread baking course video tutorial various grain loaves dark seeded crust artisan',
    duration: '4 часа 20 мин',
    lessons: 18,
    level: 'Средно',
    rating: 4.7,
    reviewCount: 134,
    topics: ['Спелта', 'Ръж', 'Ечемик', 'Хибридни рецепти', 'Хидратация'],
  },
  {
    id: 4,
    title: 'Пица с Квас — Неаполитанска Техника',
    instructor: 'Анна Павлова',
    desc: 'Автентичната неаполитанска пица с квасена ферментация — тесто, разпъване, печене.',
    price: 44.99,
    imgQuery: 'neapolitan pizza sourdough baking course instructor hands stretching dough wood fired oven technique video professional kitchen warm',
    duration: '2 часа 45 мин',
    lessons: 10,
    level: 'Начинаещи',
    badge: 'Ново',
    rating: 4.8,
    reviewCount: 92,
    topics: ['Квасено тесто за пица', 'Разпъване', 'Доматен сос', 'Печене', 'Неаполитанска традиция'],
  },
  {
    id: 5,
    title: 'Напреднали Техники за Хлебари',
    instructor: 'Иван Георгиев',
    desc: 'Диференциална ферментация, ламинация, натурални оцветители, сложни формирания — за истинските маестри.',
    price: 99.99,
    imgQuery: 'advanced artisan bread baking masterclass professional instructor sourdough laminated dough complex shaping dark studio dramatic lighting',
    duration: '8 часа 10 мин',
    lessons: 32,
    level: 'Напреднали',
    badge: 'Masterclass',
    rating: 5.0,
    reviewCount: 67,
    topics: ['Ламинация', 'Диф. ферментация', 'Натурални цветове', 'Сложни форми', 'Фурни', 'Продажба'],
  },
  {
    id: 6,
    title: 'Детски Курс: Хлябче с Мама/Татко',
    instructor: 'Мария Стоянова',
    desc: 'Забавен курс за деца и родители — лесни рецепти, безопасни техники, много смях и хляб!',
    price: 29.99,
    imgQuery: 'kids family bread baking course children and parent hands mixing dough fun colorful kitchen warm cheerful cooking together',
    duration: '1 час 30 мин',
    lessons: 6,
    level: 'Начинаещи',
    badge: 'Семеен',
    rating: 4.9,
    reviewCount: 178,
    topics: ['Безопасност', 'Основи', 'Прости рецепти', 'Декорации', 'Забавни форми'],
  },
];
