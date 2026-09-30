import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { blogPosts } from '../../src/mocks/blog.ts';
import { recipes } from '../../src/mocks/recipes.ts';
import { videoLessons } from '../../src/mocks/learn.ts';
import { mysteryBoxes } from '../../src/mocks/giveaway.ts';

const themeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = (name) => path.join(themeRoot, 'templates', name);
const readTemplate = async (name) => JSON.parse(await readFile(templatePath(name), 'utf8'));
const writeTemplate = async (name, value) => writeFile(templatePath(name), JSON.stringify(value, null, 2) + '\n', 'utf8');
const richtext = (value) => `<p>${String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>`;

const blog = await readTemplate('blog.json');
blog.sections.main.blocks = Object.fromEntries(blogPosts.map((item) => [`article${item.id}`, {
  type: 'article',
  settings: {
    fallback_asset: `kv-blog-${item.id}.jpg`,
    heading: item.title,
    category: item.category,
    meta: `${item.author} · ${item.date} · ${item.readTime}`,
    text: richtext(item.excerpt),
  },
}]));
blog.sections.main.block_order = blogPosts.map((item) => `article${item.id}`);
await writeTemplate('blog.json', blog);

const recipeTemplate = await readTemplate('page.recipes.json');
recipeTemplate.sections.main.blocks = Object.fromEntries(recipes.map((item) => [`recipe${item.id}`, {
  type: 'recipe',
  settings: {
    fallback_asset: `kv-recipe-${item.id}.jpg`,
    heading: item.title,
    category: item.category,
    meta: `${item.difficulty} · ${item.totalTime} · ${item.servings}`,
    text: richtext(item.description),
  },
}]));
recipeTemplate.sections.main.block_order = recipes.map((item) => `recipe${item.id}`);
await writeTemplate('page.recipes.json', recipeTemplate);

const learn = await readTemplate('page.learn.json');
learn.sections.videos.blocks = Object.fromEntries(videoLessons.map((item) => [`video${item.id}`, {
  type: 'card',
  settings: {
    fallback_asset: `kv-video-${item.id}.jpg`,
    heading: item.title,
    text: richtext(`${item.desc} ${item.instructor} · ${item.duration} · ${item.lessons} урока · ${item.level}`),
    label: 'Виж урока',
    url: '/collections/all',
  },
}]));
learn.sections.videos.block_order = videoLessons.map((item) => `video${item.id}`);
await writeTemplate('page.learn.json', learn);

const giveaway = await readTemplate('page.giveaway.json');
giveaway.sections.cards.blocks = Object.fromEntries(mysteryBoxes.map((item) => [`box${item.id}`, {
  type: 'card',
  settings: {
    fallback_asset: `kv-mystery-box-${item.id}.jpg`,
    heading: item.name,
    text: richtext(item.description),
    label: 'Разгледайте',
    url: '/collections/all',
  },
}]));
giveaway.sections.cards.block_order = mysteryBoxes.map((item) => `box${item.id}`);
giveaway.sections.products.settings.fallback_catalog = 'bundles';
await writeTemplate('page.giveaway.json', giveaway);

console.log(`Updated templates with ${blogPosts.length} articles, ${recipes.length} recipes, ${videoLessons.length} lessons and ${mysteryBoxes.length} giveaway cards.`);
