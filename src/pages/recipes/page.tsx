import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, toImageSrc } from '@/lib/api';

const DIFFICULTY_COLOR = {
  'Лесно': 'text-green-600 bg-green-50',
  'Средно': 'text-orange-500 bg-orange-50',
  'Напреднали': 'text-red-600 bg-red-50',
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipeCategories, setRecipeCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiGet<any>('/api/content/recipes')
      .then((data) => {
        setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
        setRecipeCategories(Array.isArray(data.recipeCategories) ? data.recipeCategories : []);
      })
      .catch(() => {
        setRecipes([]);
        setRecipeCategories([]);
      });
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter(r => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory;
      const matchDiff = activeDifficulty === 'all' || r.difficulty === activeDifficulty;
      const matchSearch = search === '' || r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchDiff && matchSearch;
    });
  }, [activeCategory, activeDifficulty, search]);

  const featured = recipes.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 h-96">
          <img
            src="https://readdy.ai/api/search-image?query=beautiful%20spread%20of%20artisan%20bread%20varieties%20sourdough%20focaccia%20rolls%20different%20shapes%20on%20rustic%20wooden%20table%20flour%20herbs%20editorial%20food%20photography%20overhead%20flat%20lay&width=1920&height=600&seq=recipes-hero&orientation=landscape"
            alt="Рецепти"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-[#FAFAF7]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-16">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">Кухня & Занаят</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Рецепти
          </h1>
          <p className="text-white/75 text-lg max-w-xl">
            {recipes.length} проверени рецепти за квасен хляб, фокача, питки и сладкиши — всяка с линкове към нужните инструменти.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 pb-24">

        {/* ─── FEATURED ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featured.map(r => (
            <Link key={r.id} to={`/recipe?id=${r.id}`} className="group cursor-pointer relative rounded-2xl overflow-hidden h-72 block">
              <img
                src={toImageSrc(r.imgQuery, r.title)}
                alt={r.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLOR[r.difficulty]}`}>
                    {r.difficulty}
                  </span>
                  <span className="text-white/70 text-xs">{r.totalTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{r.title}</h2>
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span><i className="ri-timer-line mr-1"></i>{r.bakingTime} печене</span>
                  <span><i className="ri-group-line mr-1"></i>{r.servings}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-white">Виж рецептата →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ─── FILTERS ─── */}
        <div className="bg-white rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 px-4 py-2.5 bg-[#FAFAF7] rounded-xl">
              <i className="ri-search-line text-gray-400 flex-shrink-0"></i>
              <input
                type="text"
                placeholder="Търсете рецепта..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-[#1A0F08] placeholder-gray-400"
              />
            </div>
            {/* Difficulty */}
            <div className="flex items-center gap-2">
              {['all', 'Лесно', 'Средно', 'Напреднали'].map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(d)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeDifficulty === d ? 'bg-[#1A0F08] text-white' : 'bg-[#FAFAF7] text-gray-600 hover:bg-[#F5EFE6]'
                  }`}
                >
                  {d === 'all' ? 'Всяка трудност' : d}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 flex-nowrap">
            {recipeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#1A0F08] text-white'
                    : 'bg-[#F5EFE6] text-[#1A0F08] hover:bg-[#e8e0d5]'
                }`}
              >
                <i className={`${cat.icon} text-sm`}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">{filtered.length} рецепти</p>

        {/* ─── RECIPES GRID ─── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-[#F5EFE6] rounded-full">
              <i className="ri-search-line text-2xl text-[#C17A3A]"></i>
            </div>
            <p className="text-lg font-semibold text-[#1A0F08]">Няма намерени рецепти</p>
            <p className="text-gray-500 text-sm mt-1">Опитайте различни филтри</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(r => (
              <Link key={r.id} to={`/recipe?id=${r.id}`} className="group cursor-pointer">
                <article className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={toImageSrc(r.imgQuery, r.title)}
                      alt={r.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${DIFFICULTY_COLOR[r.difficulty]}`}>
                        {r.difficulty}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-[#1A0F08]">
                      {r.totalTime}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[#C17A3A] text-xs font-semibold uppercase tracking-wider mb-1.5">
                      {recipeCategories.find(c => c.id === r.category)?.label}
                    </p>
                    <h3 className="font-bold text-[#1A0F08] text-base leading-tight mb-3 flex-1 line-clamp-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {r.title}
                    </h3>

                    <div className="flex items-center gap-3 text-gray-400 text-xs pt-3 border-t border-gray-50">
                      <span className="flex items-center gap-1">
                        <i className="ri-timer-2-line"></i>{r.bakingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-group-line"></i>{r.servings}
                      </span>
                      <span className="flex items-center gap-1 ml-auto text-[#C17A3A]">
                        <i className="ri-links-line"></i>{r.linkedProductIds.length} продукта
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
