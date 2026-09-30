import { copyFile, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../../src/mocks/products.ts';
import { blogPosts } from '../../src/mocks/blog.ts';
import { recipes } from '../../src/mocks/recipes.ts';
import { books, videoLessons } from '../../src/mocks/learn.ts';
import { bundles } from '../../src/mocks/bundles.ts';
import { mysteryBoxes, teamMembers, giveawayData, aboutContent } from '../../src/mocks/giveaway.ts';

const themeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(themeRoot, 'assets');
const importsDir = path.join(themeRoot, 'imports');
await mkdir(assetsDir, { recursive: true });
await mkdir(importsDir, { recursive: true });

const imageUrl = ({ query, width = 700, height = 500, orientation = 'landscape', seq }) => {
  const url = new URL('https://readdy.ai/api/search-image');
  url.searchParams.set('query', query);
  url.searchParams.set('width', String(width));
  url.searchParams.set('height', String(height));
  if (seq) url.searchParams.set('seq', seq);
  url.searchParams.set('orientation', orientation);
  return url.toString();
};

const media = [
  { id: 'home-hero', query: 'artisan sourdough bread freshly baked golden crust on rustic wooden table with flour dust linen cloth warm dramatic side lighting professional food photography editorial moody tones', width: 1920, height: 1080, seq: 'hero-main', orientation: 'landscape' },
  { id: 'home-story', query: 'artisan baker hands shaping sourdough bread dough on floured wooden surface close up warm natural window light rustic kitchen authentic craft', width: 800, height: 1000, seq: 'story1', orientation: 'portrait' },
  { id: 'home-cta', query: 'artisan sourdough bread bakery workshop rustic wooden counter flour tools warm golden hour light wide angle editorial lifestyle photography', width: 1920, height: 600, seq: 'cta-final', orientation: 'landscape' },
  { id: 'home-product-1', query: 'round banneton proofing basket natural rattan wicker for sourdough bread artisan baking close up product photography warm cream background soft natural light', width: 600, height: 600, seq: 'fp1', orientation: 'squarish' },
  { id: 'home-product-2', query: 'sleek digital kitchen scale stainless steel modern minimal design for precise baking measurements white clean background studio light', width: 600, height: 600, seq: 'fp2', orientation: 'squarish' },
  { id: 'home-product-3', query: 'enameled cast iron dutch oven pot with lid matte black for baking artisan sourdough bread studio photography clean neutral background', width: 600, height: 600, seq: 'fp3', orientation: 'squarish' },
  { id: 'home-product-4', query: 'sourdough starter kit gift set glass jar flour lame knife banneton basket collection laid flat overhead photography warm neutral linen background', width: 600, height: 600, seq: 'fp4', orientation: 'squarish' },
  { id: 'home-category-bannetons', query: 'collection of banneton proofing baskets different shapes oval round natural rattan artisan bread making tools arranged beautifully warm wooden table', width: 800, height: 600, seq: 'cat1', orientation: 'landscape' },
  { id: 'home-category-measuring', query: 'precision kitchen baking scale and thermometer tools arranged neatly on clean marble surface professional food photography', width: 800, height: 600, seq: 'cat2', orientation: 'landscape' },
  { id: 'home-category-dutch-ovens', query: 'cast iron dutch oven enameled cookware rustic wooden kitchen table warm moody photography artisan baking', width: 800, height: 600, seq: 'cat3', orientation: 'landscape' },
  { id: 'home-category-flours', query: 'organic flour bags wheat grain seeds arranged on rustic wooden surface artisan bread baking ingredients warm natural tones', width: 800, height: 600, seq: 'cat4', orientation: 'landscape' },
  { id: 'shop-hero', query: 'artisan sourdough bread baking tools banneton baskets flour spread on rustic wooden table wide angle overhead flat lay professional food photography warm tones', width: 1920, height: 500, seq: 'shop-hero', orientation: 'landscape' },
  { id: 'bundles-hero', query: 'artisan sourdough baking kit collection flat lay banneton basket glass jar lame knife linen cloth recipe card wooden tools arranged beautifully warm cream linen background overhead professional lifestyle photography natural light', width: 1920, height: 560, seq: 'bundles-hero', orientation: 'landscape' },
  { id: 'learn-hero', query: 'artisan bread baking workshop online course instructor teaching sourdough techniques open cookbook flour dusty wooden table warm golden hour light professional photography cinematic natural', width: 1920, height: 560, seq: 'learn-hero', orientation: 'landscape' },
  { id: 'blog-hero', query: 'artisan bread baking books recipes flour kitchen counter rustic cozy workspace flat lay warm tones editorial food photography', width: 1920, height: 500, seq: 'blog-hero', orientation: 'landscape' },
  { id: 'recipes-hero', query: 'beautiful spread of artisan bread varieties sourdough focaccia rolls different shapes on rustic wooden table flour herbs editorial food photography overhead flat lay', width: 1920, height: 600, seq: 'recipes-hero', orientation: 'landscape' },
  { id: 'giveaway-hero', query: 'artisan sourdough bakery surprise gift box wooden crate with bread tools flour ribbon festive arrangement warm golden light rustic natural tones premium photography', width: 1920, height: 800, seq: 'giveaway-hero', orientation: 'landscape' },
  { id: 'giveaway-prize', query: 'professional sourdough baking complete premium kit banneton scale dutch oven lame tools arranged elegantly wooden surface warm soft lighting artisan gift set', width: 800, height: 600, seq: 'giveaway-prize', orientation: 'landscape' },
  { id: 'subscription-hero', query: 'artisan bread subscription box monthly delivery organic flour sourdough tools premium packaging natural kraft box linen ribbon arranged on wooden table lifestyle product photography overhead warm neutral tones', width: 1920, height: 600, seq: 'sub-hero', orientation: 'landscape' },
  { id: 'vouchers-hero', query: 'elegant gift voucher card artisan bakery premium present ribbon bow soft warm golden tones natural linen fabric bread baking lifestyle photography beautiful wrapped gift certificate', width: 1920, height: 560, seq: 'vouchers-hero', orientation: 'landscape' },
  { id: 'about-hero', query: 'artisan bakery workshop with sourdough bread baking tools rustic wooden shelves warm natural light professional photography', width: 1920, height: 800, orientation: 'landscape' },
  { id: 'about-bread', query: 'artisan sourdough bread loaf with beautiful scoring golden crust on wooden board professional food photography', width: 400, height: 500, orientation: 'portrait' },
  { id: 'about-dough', query: 'baker hands shaping sourdough bread dough artisan technique flour dusted professional photography', width: 400, height: 300, orientation: 'landscape' },
  { id: 'about-starter', query: 'sourdough starter in glass jar bubbling active fermentation close up professional food photography', width: 400, height: 300, orientation: 'landscape' },
  { id: 'about-bakery', query: 'rustic bakery shelves with fresh sourdough bread loaves artisan bakery interior warm lighting', width: 400, height: 500, orientation: 'portrait' },
  ...products.map((item) => ({ id: `product-${item.id}`, query: item.imgQuery, width: 900, height: 900, orientation: 'squarish' })),
  ...blogPosts.map((item) => ({ id: `blog-${item.id}`, query: item.imgQuery, width: 1000, height: 700, orientation: 'landscape' })),
  ...recipes.map((item) => ({ id: `recipe-${item.id}`, query: item.imgQuery, width: 1000, height: 700, orientation: 'landscape' })),
  ...books.map((item) => ({ id: `book-${item.id}`, query: item.imgQuery, width: 700, height: 900, orientation: 'portrait' })),
  ...videoLessons.map((item) => ({ id: `video-${item.id}`, query: item.imgQuery, width: 1000, height: 650, orientation: 'landscape' })),
  ...bundles.map((item) => ({ id: `bundle-${item.id}`, query: item.imgQuery, width: 1000, height: 700, orientation: 'landscape' })),
  ...mysteryBoxes.map((item) => ({ id: `mystery-box-${item.id}`, query: item.imgQuery, width: 800, height: 600, orientation: 'landscape' })),
  ...teamMembers.map((item) => ({ id: `team-${item.id}`, query: item.imgQuery, width: 700, height: 700, orientation: 'squarish' })),
];

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

async function download(item) {
  const fileName = `kv-${item.id}.jpg`;
  const destination = path.join(assetsDir, fileName);
  if (await exists(destination)) return { ...item, fileName, url: imageUrl(item), skipped: true };
  const attempts = [item, { ...item, seq: undefined }, { ...item, width: 700, height: 500, seq: undefined, orientation: 'landscape' }];
  let lastError;
  for (const attempt of attempts) {
    const url = imageUrl(attempt);
    try {
      const response = await fetch(url, { headers: { accept: 'image/jpeg,image/*;q=0.9' } });
      if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!(bytes[0] === 0xff && bytes[1] === 0xd8)) throw new Error('response is not JPEG');
      await writeFile(destination, bytes);
      return { ...item, fileName, url, bytes: bytes.length, recovered: attempt !== item };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`${item.id}: ${lastError?.message || 'download failed'}`);
}

const downloaded = [];
const failed = [];
for (let offset = 0; offset < media.length; offset += 4) {
  const batch = media.slice(offset, offset + 4);
  const results = await Promise.allSettled(batch.map(download));
  for (let index = 0; index < results.length; index += 1) {
    const result = results[index];
    if (result.status === 'fulfilled') downloaded.push(result.value);
    else failed.push({ id: batch[index].id, message: result.reason?.message || String(result.reason) });
  }
  console.log(`Downloaded ${Math.min(offset + batch.length, media.length)}/${media.length}`);
}

const fallbackFor = (id) => {
  if (id === 'subscription-hero') return 'kv-bundles-hero.jpg';
  if (id.startsWith('product-')) {
    const product = products.find((entry) => `product-${entry.id}` === id);
    if (product?.id === 1) return 'kv-home-product-1.jpg';
    if (product?.id === 4) return 'kv-home-product-2.jpg';
    if (product?.id === 5) return 'kv-home-product-3.jpg';
    if (product?.id === 18) return 'kv-home-product-4.jpg';
    if (product?.category === 'equipment') return 'kv-home-category-dutch-ovens.jpg';
    if (product?.category === 'ingredients') return 'kv-home-category-flours.jpg';
    if (product?.category === 'kits') return 'kv-giveaway-prize.jpg';
    return 'kv-home-category-bannetons.jpg';
  }
  if (id.startsWith('blog-')) return 'kv-blog-hero.jpg';
  if (id.startsWith('recipe-')) return 'kv-recipes-hero.jpg';
  if (id.startsWith('book-') || id.startsWith('video-')) return 'kv-learn-hero.jpg';
  if (id.startsWith('bundle-')) return 'kv-bundles-hero.jpg';
  if (id.startsWith('mystery-box-')) return 'kv-giveaway-prize.jpg';
  if (id.startsWith('team-')) return 'kv-about-bread.jpg';
  return 'kv-home-hero.jpg';
};

for (const failure of failed) {
  const destination = path.join(assetsDir, `kv-${failure.id}.jpg`);
  if (!(await exists(destination))) await copyFile(path.join(assetsDir, fallbackFor(failure.id)), destination);
}

const slugify = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const csvEscape = (value) => {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const githubAssetUrl = (id) => `https://raw.githubusercontent.com/bkbex1/Kvas---Frontend/shopify-theme/shopify-theme/assets/kv-${id}.jpg`;

const headers = [
  'Title', 'URL handle', 'Description', 'Vendor', 'Type', 'Tags', 'Published on online store',
  'Status', 'SKU', 'Option1 name', 'Option1 value', 'Price', 'Compare-at price', 'Charge tax',
  'Inventory tracker', 'Inventory quantity', 'Continue selling when out of stock', 'Weight value (grams)',
  'Requires shipping', 'Fulfillment service', 'Product image URL', 'Image position', 'Image alt text',
  'Gift card', 'SEO title', 'SEO description', 'Collection'
];

const productRows = products.map((item) => ({
  Title: item.name,
  'URL handle': `kvaseya-${slugify(item.name) || item.id}`,
  Description: `<p>${item.description}</p><h3>Характеристики</h3><ul>${item.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>`,
  Vendor: 'Квасен Занаят', Type: item.categoryLabel,
  Tags: [item.category, item.badge, ...(item.tags || [])].filter(Boolean).join(', '),
  'Published on online store': 'false', Status: 'draft', SKU: `KV-${String(item.id).padStart(3, '0')}`,
  'Option1 name': 'Title', 'Option1 value': 'Default Title', Price: item.price.toFixed(2),
  'Compare-at price': item.oldPrice?.toFixed(2) || '', 'Charge tax': 'true',
  'Inventory tracker': 'shopify', 'Inventory quantity': item.stock, 'Continue selling when out of stock': 'false',
  'Weight value (grams)': item.specs?.weight ? String(parseInt(item.specs.weight, 10) || 0) : '0',
  'Requires shipping': 'true', 'Fulfillment service': 'manual',
  'Product image URL': githubAssetUrl(`product-${item.id}`),
  'Image position': '1', 'Image alt text': item.name, 'Gift card': 'false', 'SEO title': item.name,
  'SEO description': item.desc, Collection: item.categoryLabel,
}));

const extraRows = [
  ...bundles.map((item) => ({ item, kind: 'Комплекти', prefix: 'BND', shipping: true, description: `<p>${item.subtitle}</p><ul>${item.items.map((entry) => `<li>${entry.qty}× ${entry.name}</li>`).join('')}</ul>`, image: `bundle-${item.id}` })),
  ...books.map((item) => ({ item, kind: item.category === 'ebook' ? 'Електронни книги' : 'Книги', prefix: 'BK', shipping: item.category !== 'ebook', description: `<p>${item.desc}</p><p>${item.author} · ${item.pages} страници · ${item.language}</p>`, image: `book-${item.id}` })),
  ...videoLessons.map((item) => ({ item, kind: 'Видео уроци', prefix: 'VID', shipping: false, description: `<p>${item.desc}</p><p>${item.instructor} · ${item.duration} · ${item.lessons} урока · ${item.level}</p><ul>${item.topics.map((topic) => `<li>${topic}</li>`).join('')}</ul>`, image: `video-${item.id}` })),
].map(({ item, kind, prefix, shipping, description, image }) => {
  const mediaItem = media.find((entry) => entry.id === image);
  return {
    Title: item.name || item.title,
    'URL handle': `kvaseya-${slugify(item.name || item.title) || item.id}`,
    Description: description, Vendor: 'Квасен Занаят', Type: kind,
    Tags: [kind, item.badge].filter(Boolean).join(', '), 'Published on online store': 'false', Status: 'draft',
    SKU: `${prefix}-${String(item.id).padStart(3, '0')}`, 'Option1 name': 'Title', 'Option1 value': 'Default Title',
    Price: item.price.toFixed(2), 'Compare-at price': item.oldPrice?.toFixed(2) || '', 'Charge tax': 'true',
    'Inventory tracker': shipping ? 'shopify' : '', 'Inventory quantity': shipping ? '10' : '',
    'Continue selling when out of stock': 'false', 'Weight value (grams)': '0',
    'Requires shipping': String(shipping), 'Fulfillment service': 'manual',
    'Product image URL': githubAssetUrl(image), 'Image position': '1', 'Image alt text': item.name || item.title,
    'Gift card': 'false', 'SEO title': item.name || item.title, 'SEO description': item.subtitle || item.desc,
    Collection: kind,
  };
});

const rows = [...productRows, ...extraRows];
const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(','))].join('\n') + '\n';
await writeFile(path.join(importsDir, 'kvaseya-products.csv'), `\ufeff${csv}`, 'utf8');
await writeFile(path.join(importsDir, 'blog-articles.json'), JSON.stringify(blogPosts, null, 2) + '\n', 'utf8');
await writeFile(path.join(importsDir, 'recipes.json'), JSON.stringify(recipes, null, 2) + '\n', 'utf8');
await writeFile(path.join(importsDir, 'source-content.json'), JSON.stringify({ giveawayData, aboutContent, mysteryBoxes, teamMembers, books, videoLessons, bundles }, null, 2) + '\n', 'utf8');
await writeFile(path.join(importsDir, 'media-manifest.json'), JSON.stringify(downloaded, null, 2) + '\n', 'utf8');
await writeFile(path.join(importsDir, 'media-failures.json'), JSON.stringify(failed, null, 2) + '\n', 'utf8');
console.log(`Prepared ${downloaded.length} images and ${rows.length} Shopify product rows. Failed: ${failed.length}.`);
