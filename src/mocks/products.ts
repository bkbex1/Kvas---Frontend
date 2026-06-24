export interface ProductSpec {
  [key: string]: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  desc: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  imgQuery: string;
  images?: string[];
  stock: number;
  limited: boolean;
  rating: number;
  reviewCount: number;
  specs: ProductSpec;
  description: string;
  features: string[];
}

export const SPEC_LABELS: Record<string, string> = {
  material: 'Материал', size: 'Размер', weight: 'Тегло', origin: 'Произход',
  care: 'Грижа', capacity: 'Капацитет', precision: 'Прецизност', display: 'Дисплей',
  power: 'Захранване', diameter: 'Диаметър', maxTemp: 'Макс. температура',
  thickness: 'Дебелина', range: 'Диапазон', accuracy: 'Точност',
  distance: 'Разстояние', handle: 'Дръжка', length: 'Дължина',
  blades: 'Ножчета', pieces: 'Броя', caseType: 'Кутия', dimensions: 'Габарити',
};

export const products: Product[] = [
  {
    id: 1, name: 'Банетон Кошница Кръгла', category: 'tools', categoryLabel: 'Инструменти',
    desc: 'Естествен ратан, 25 см', price: 45.99, oldPrice: 59.99, badge: 'Хит',
    imgQuery: 'round woven rattan banneton proofing basket natural beige artisan sourdough baking tool close up warm studio light clean cream background professional product photo',
    stock: 15, limited: false, rating: 4.9, reviewCount: 87,
    specs: { material: 'Естествен ратан', size: '25 см диаметър', weight: '350 г', origin: 'Германия', care: 'Суха четка' },
    description: 'Тази банетон кошница е изработена от висококачествен естествен ратан. Идеална за ферментиране на кръгли хлябове с тегло до 1 кг. Ратанът абсорбира излишната влага и отпечатва красив спирален модел върху хляба. Подходяща за домашна и занаятчийска употреба.',
    features: ['Естествен ратан от Германия', 'Красив спирален модел върху хляба', 'Абсорбира излишна влага', 'Подходяща за тесто до 1 кг', 'Лесна за поддръжка'],
  },
  {
    id: 2, name: 'Банетон Кошница Овална', category: 'tools', categoryLabel: 'Инструменти',
    desc: 'Естествен ратан, 30 см', price: 52.99,
    imgQuery: 'oval woven rattan banneton bread proofing basket natural color elongated shape artisan baking studio photography clean cream background soft lighting',
    stock: 12, limited: false, rating: 4.8, reviewCount: 64,
    specs: { material: 'Естествен ратан', size: '30 см дължина', weight: '400 г', origin: 'Германия', care: 'Суха четка' },
    description: 'Овална банетон кошница за класически батони и овални хлябове. Изработена от висококачествен естествен ратан с традиционни техники.',
    features: ['Овална форма за батони', 'Естествен ратан', 'За тесто до 1.2 кг', 'Отпечатва красив модел', 'Дълготрайна конструкция'],
  },
  {
    id: 3, name: 'Ленена Покривка', category: 'tools', categoryLabel: 'Инструменти',
    desc: '100% лен, 70×50 см', price: 28.99, badge: 'Ново',
    imgQuery: 'natural linen bread proofing couche cloth beige cream folded fabric artisan baking tool studio product photography clean white background',
    stock: 25, limited: false, rating: 4.7, reviewCount: 42,
    specs: { material: '100% лен', size: '70×50 см', weight: '180 г', origin: 'Франция', care: 'Пране 30°C' },
    description: 'Професионална ленена покривка за ферментация на тесто. Изработена от 100% натурален лен, внесен от Франция. Абсорбира влагата и предотвратява залепването.',
    features: ['100% натурален лен', 'Абсорбира излишна влага', 'Машинно перима на 30°C', 'Голям работен размер', 'Нещо суха тъкан'],
  },
  {
    id: 4, name: 'Дигитална Везна 5 кг', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'Прецизност 1 г', price: 89.99, badge: 'Топ продукт',
    imgQuery: 'modern sleek digital kitchen scale stainless steel platform precise LCD display minimal design baking measurements studio photography clean white background',
    stock: 8, limited: true, rating: 4.9, reviewCount: 112,
    specs: { capacity: '5 кг', precision: '1 г', display: 'LCD с подсветка', power: '2× AAA', material: 'Неръждаема стомана' },
    description: 'Прецизна дигитална везна с точност до 1 грам. Незаменим инструмент за всеки пекар, тъй като точното претегляне е ключово за успешен квасен хляб.',
    features: ['Точност до 1 грам', 'Капацитет 5 кг', 'LCD дисплей с подсветка', 'Функция тара', 'Неръждаема стоманена платформа'],
  },
  {
    id: 5, name: 'Холандска Печка 5 л', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'Емайлиран чугун', price: 189.99, oldPrice: 229.99, badge: 'Промоция',
    imgQuery: 'enameled cast iron dutch oven 5 liter cream beige color with lid round shape artisan bread baking cookware studio photography warm neutral background',
    stock: 6, limited: true, rating: 5.0, reviewCount: 203,
    specs: { capacity: '5 литра', material: 'Емайлиран чугун', diameter: '26 см', weight: '5.5 кг', maxTemp: '260°C' },
    description: 'Тази холандска печка от емайлиран чугун е наистина незаменима за получаване на хрупкава, карамелизирана кора на вашия квасен хляб. Затвореното пространство създава идеалните условия за пара.',
    features: ['Емайлиран чугун с висока плътност', 'Равномерно разпределение на топлина', 'Задържа пара за перфектна коричка', 'Подходяща за всички котлони и фурни', 'Лесна за почистване'],
  },
  {
    id: 6, name: 'Холандска Печка 7 л', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'Емайлиран чугун, голяма', price: 219.99,
    imgQuery: 'large enameled cast iron dutch oven 7 liter dark matte with lid oval shape artisan bread baking cookware studio photography neutral background',
    stock: 4, limited: true, rating: 4.9, reviewCount: 78,
    specs: { capacity: '7 литра', material: 'Емайлиран чугун', diameter: '30 см', weight: '7 кг', maxTemp: '260°C' },
    description: 'По-голямата версия на нашата холандска печка — идеална за хлябове с по-голямо тегло и за по-широки формати. Същото изключително качество на чугун.',
    features: ['Голям капацитет 7 л', 'За хлябове до 1.5 кг', 'Овална форма', 'Издръжлива на щ.температури', 'Подходяща за индукция'],
  },
  {
    id: 7, name: 'Камък за Печене', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'Кордиерит, 38×30 см', price: 79.99,
    imgQuery: 'rectangular cordierite baking pizza stone textured surface gray natural color bread baking studio product photography white background',
    stock: 10, limited: false, rating: 4.7, reviewCount: 55,
    specs: { material: 'Кордиерит', dimensions: '38×30 см', thickness: '1.5 см', weight: '3.2 кг', maxTemp: '300°C' },
    description: 'Камъкът за печене от кордиерит поема и разпределя топлината равномерно, осигурявайки хрупкава долна кора, каквато само фурна с камък може да даде.',
    features: ['Кордиерит с висока топлоустойчивост', 'Равномерно разпределение на топлина', 'Хрупкава долна коричка', 'Дълготраен и устойчив', 'Лесен за почистване'],
  },
  {
    id: 8, name: 'Инфрачервен Термометър', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'Безконтактен, до 550°C', price: 64.99,
    imgQuery: 'infrared digital thermometer gun white gray LCD display non contact temperature measurement baking cooking professional tool studio photography clean background',
    stock: 18, limited: false, rating: 4.6, reviewCount: 39,
    specs: { range: '-50°C до 550°C', accuracy: '±1.5°C', display: 'LCD с подсветка', power: 'Батерия 9V', distance: '30 см оптимално' },
    description: 'Безконтактният инфрачервен термометър ви позволява да измервате температурата на фурната, камъка или тестото мигновено и прецизно без контакт.',
    features: ['Безконтактно измерване', 'Широк диапазон −50 до 550°C', 'Бързо измерване (0.5 сек)', 'LCD дисплей с подсветка', 'Компактен и лесен за употреба'],
  },
  {
    id: 9, name: 'Нож за Рязане Про', category: 'tools', categoryLabel: 'Инструменти',
    desc: 'Дървена дръжка + 5 ножчета', price: 34.99, badge: 'Бестселър',
    imgQuery: 'bread lame scoring knife natural wood handle sharp curved blade professional artisan sourdough baking tool studio photography clean white background warm tones',
    stock: 22, limited: false, rating: 4.8, reviewCount: 94,
    specs: { material: 'Неръждаема стомана', handle: 'Естествено дърво', length: '18 см', weight: '45 г', blades: '5 резервни' },
    description: 'Нож за рязане (lame) с ергономична дървена дръжка и набор от сменяеми ножчета. Позволява прецизни и красиви разрези върху хляба преди печене.',
    features: ['Ергономична дървена дръжка', 'Изключително остри ножчета', '5 резервни ножчета включени', 'Прецизни декоративни разрези', 'Лесна смяна на ножчетата'],
  },
  {
    id: 10, name: 'Комплект Ножове 3 бр.', category: 'tools', categoryLabel: 'Инструменти',
    desc: 'Три различни форми', price: 59.99,
    imgQuery: 'set of 3 bread scoring lame knives different blade shapes wooden handles arranged together professional baking tools studio photography neutral background',
    stock: 14, limited: false, rating: 4.7, reviewCount: 47,
    specs: { pieces: '3 ножа', material: 'Неръждаема стомана', handle: 'Дърво', blades: '15 резервни', caseType: 'Кожена кутия' },
    description: 'Комплект от три различни lame ножа за разнообразни техники на рязане. Включва права, кривата и овална форма. Идеален подарък за всеки пекар.',
    features: ['3 различни форми на ножа', 'Дървени дръжки от орехово дърво', '15 резервни ножчета', 'Кожена защитна кутия', 'Подходящ за подарък'],
  },
  {
    id: 11, name: 'Скрепер Метален', category: 'tools', categoryLabel: 'Инструменти',
    desc: 'Неръждаема стомана', price: 18.99,
    imgQuery: 'stainless steel bench scraper dough cutter sharp blade wooden handle professional baking tool studio photography clean white background',
    stock: 30, limited: false, rating: 4.5, reviewCount: 61,
    specs: { material: 'Неръждаема стомана', handle: 'Бук', dimensions: '15×12 см', weight: '120 г', care: 'Миялна машина' },
    description: 'Незаменим инструмент за всеки пекар. Металният скрепер помага при разделяне, оформяне и преместване на тестото, а също и за почистване на работния плот.',
    features: ['Закалена неръждаема стомана', 'Ергономична буков дръжка', 'Скала за измерване', 'Подходящ за миялна машина', 'Многофункционален'],
  },
  {
    id: 12, name: 'Скрепери Комплект 3 бр.', category: 'tools', categoryLabel: 'Инструменти',
    desc: 'Пластмасови, различни цветове', price: 12.99,
    imgQuery: 'set of plastic flexible bowl dough scrapers three pieces different colors red green yellow baking tools studio photography clean background',
    stock: 45, limited: false, rating: 4.4, reviewCount: 33,
    specs: { material: 'Хранителна пластмаса', pieces: '3 броя', dimensions: '10×8 см', care: 'Миялна машина' },
    description: 'Гъвкави пластмасови скрепери за изгребване на тесто от купата. Удобни, цветни и лесни за почистване. Идеални за начинаещи.',
    features: ['Гъвкав пластмасов материал', 'Три различни цвята', 'Безопасни за хранителни продукти', 'Подходящи за миялна машина', 'Лесно почистване'],
  },
  {
    id: 13, name: 'Стъклен Съд 3 л', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'За квас, с капак', price: 42.99, badge: 'Ново',
    imgQuery: 'clear glass fermentation jar 3 liter transparent container sourdough starter storage with clip lid studio photography clean white background',
    stock: 20, limited: false, rating: 4.8, reviewCount: 76,
    specs: { material: 'Боросиликатно стъкло', capacity: '3 литра', dimensions: '15×25 см', care: 'Миялна машина' },
    description: 'Прозрачен стъклен съд от боросиликатно стъкло — идеален за поддържане и наблюдаване на вашия квас. Виждате ферментацията в реално време.',
    features: ['Боросиликатно стъкло', 'Прозрачен за наблюдение', 'Клипс капак за уплътнение', 'Устойчив на температури', 'Подходящ за миялна машина'],
  },
  {
    id: 14, name: 'Керамичен Съд 2 л', category: 'equipment', categoryLabel: 'Оборудване',
    desc: 'Ръчна изработка', price: 68.99,
    imgQuery: 'handmade ceramic pottery crock jar 2 liter beige cream glazed sourdough starter container artisan studio photography warm neutral background',
    stock: 7, limited: true, rating: 4.9, reviewCount: 28,
    specs: { material: 'Ръчно изработена керамика', capacity: '2 литра', origin: 'България', care: 'Ръчно миене' },
    description: 'Красив ръчно изработен керамичен съд за вашия квас. Всеки е уникален поради ръчната изработка. Регулира влажността естествено.',
    features: ['Ръчно изработена от местен грънчар', 'Уникален дизайн', 'Регулира влажността естествено', 'Естетически красив', 'Направен в България'],
  },
  {
    id: 15, name: 'Пшенично Брашно Тип 500', category: 'flour', categoryLabel: 'Брашна',
    desc: 'Биологично, 1 кг', price: 8.99, badge: 'Органик',
    imgQuery: 'organic wheat flour type 500 kraft paper bag 1kg natural packaging artisan bread baking ingredient studio photography clean warm background',
    stock: 50, limited: false, rating: 4.7, reviewCount: 145,
    specs: { material: 'Пшеница Тип 500', weight: '1 кг', origin: 'България', care: 'Сухо място' },
    description: 'Биологично пшенично брашно тип 500 от местни производители. Идеално за квасен хляб с лека, въздушна текстура и мека коричка.',
    features: ['100% биологично пшеничено', 'Местно производство', 'Богато на глутен', 'Идеално за квасен хляб', 'Без добавки'],
  },
  {
    id: 16, name: 'Ръжено Брашно Пълнозърнесто', category: 'flour', categoryLabel: 'Брашна',
    desc: 'Биологично, 1 кг', price: 9.99,
    imgQuery: 'organic dark rye flour whole grain kraft paper bag 1kg natural packaging artisan bread baking studio photography clean warm background',
    stock: 40, limited: false, rating: 4.8, reviewCount: 98,
    specs: { material: 'Ръж, пълнозърнеста', weight: '1 кг', origin: 'Германия', care: 'Сухо място' },
    description: 'Пълнозърнесто ръжено брашно за богат, земен вкус и наситен аромат. Подобрява ферментацията на кваса и придава тъмен цвят.',
    features: ['Пълнозърнеста ръж', 'Ускорява ферментацията на квас', 'Богат тъмен цвят', 'Дълбок аромат', '100% биологично'],
  },
  {
    id: 17, name: 'Спелтово Брашно', category: 'flour', categoryLabel: 'Брашна',
    desc: 'Биологично, 1 кг', price: 12.99, badge: 'Специален',
    imgQuery: 'organic spelt flour ancient grain kraft paper bag 1kg light tan color artisan bread baking studio photography clean background warm tones',
    stock: 25, limited: false, rating: 4.6, reviewCount: 67,
    specs: { material: 'Спелта (прастара пшеница)', weight: '1 кг', origin: 'Австрия', care: 'Сухо място' },
    description: 'Спелтово брашно от прастара пшеница с нежен орехов вкус. По-лесно смилаемо от обикновената пшеница и подходящо за хора с лека непоносимост.',
    features: ['Прастара пшеница спелта', 'Нежен орехов вкус', 'По-лесно смилаемо', 'Богато на протеини', 'Австрийски произход'],
  },
  {
    id: 18, name: 'Стартер Кит за Начинаещи', category: 'kits', categoryLabel: 'Комплекти',
    desc: 'Всичко за първия хляб', price: 149.99, oldPrice: 189.99, badge: 'Промоция',
    imgQuery: 'sourdough starter beginner kit flat lay glass jar banneton basket lame knife flour bag wooden tools arranged on linen cloth warm neutral background lifestyle photography',
    stock: 15, limited: false, rating: 5.0, reviewCount: 178,
    specs: { pieces: '7 артикула', material: 'Смесени материали', weight: '2.1 кг', caseType: 'Подаръчна кутия' },
    description: 'Перфектният комплект за всеки, който иска да навлезе в света на квасения хляб. Включва всичко необходимо — от съд за квас до банетон и нож за рязане.',
    features: ['7 внимателно подбрани артикула', 'Стъклен съд за квас', 'Кръгла банетон кошница', 'Нож за рязане с ножчета', 'Ленена покривка + инструкции'],
  },
  {
    id: 19, name: 'Професионален Комплект', category: 'kits', categoryLabel: 'Комплекти',
    desc: 'Пълно оборудване', price: 399.99,
    imgQuery: 'professional sourdough baking complete kit premium collection banneton scale dutch oven lame tools arranged elegantly dark moody studio photography',
    stock: 5, limited: true, rating: 4.9, reviewCount: 41,
    specs: { pieces: '12 артикула', material: 'Премиум качество', weight: '8 кг', caseType: 'Дървена кутия' },
    description: 'Пълният набор от инструменти за сериозния занаятчийски пекар. Включва везна, холандска печка, два банетона, термометър, ножове и брашна.',
    features: ['12 премиум артикула', 'Дигитална везна', 'Холандска печка 5л', 'Два банетона (кръгъл + овален)', 'Луксозна дървена кутия'],
  },
  {
    id: 20, name: 'Подаръчен Сет Делукс', category: 'kits', categoryLabel: 'Комплекти',
    desc: 'Луксозна опаковка', price: 249.99, oldPrice: 299.99, badge: 'Подарък',
    imgQuery: 'deluxe sourdough gift set luxury premium packaging elegant wooden box baking tools artisan collection lifestyle photography warm neutral tones',
    stock: 8, limited: false, rating: 4.8, reviewCount: 53,
    specs: { pieces: '9 артикула', material: 'Смесени премиум', weight: '3.5 кг', caseType: 'Луксозна кутия' },
    description: 'Луксозен подаръчен комплект за любителите на занаятчийски хляб. Красива опаковка, подходяща за рожден ден, Коледа или просто специален повод.',
    features: ['9 внимателно подбрани артикула', 'Луксозна опаковка с панделка', 'Персонализирана картичка', 'Включва рецептна книга', 'Безплатна доставка'],
  },
];

export const categories = [
  { id: 'all', name: 'Всички', icon: 'ri-apps-line' },
  { id: 'tools', name: 'Инструменти', icon: 'ri-tools-line' },
  { id: 'equipment', name: 'Оборудване', icon: 'ri-box-3-line' },
  { id: 'flour', name: 'Брашна', icon: 'ri-leaf-line' },
  { id: 'kits', name: 'Комплекти', icon: 'ri-gift-line' },
];
