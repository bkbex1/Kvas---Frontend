import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, apiGetAllCatalogProducts, normalizeProduct, toImageSrc, type ApiProduct } from '@/lib/api';

const DIFFICULTY_COLOR = {
  'Лесно': 'text-green-600 bg-green-50',
  'Средно': 'text-orange-500 bg-orange-50',
  'Напреднали': 'text-red-600 bg-red-50',
};

export default function RecipePage() {
  const [searchParams] = useSearchParams();
  const recipeId = Number(searchParams.get('id'));
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipeCategories, setRecipeCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const recipe = recipes.find(r => r.id === recipeId);

  useEffect(() => { window.scrollTo(0, 0); }, [recipeId]);
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
    apiGetAllCatalogProducts()
      .then((rows) => setProducts(rows.map(normalizeProduct)))
      .catch(() => setProducts([]));
  }, []);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div className="pt-40 pb-24 px-8 text-center">
          <h1 className="text-3xl font-bold text-[#1A0F08] mb-4">Рецептата не е намерена</h1>
          <Link to="/recipes" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A0F08] text-white rounded-full font-semibold cursor-pointer hover:bg-[#C17A3A] transition-colors">
            <i className="ri-arrow-left-line"></i> Към рецептите
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const linkedProducts = products.filter(p => recipe.linkedProductIds.includes(p.id));
  const relatedRecipes = recipes.filter(r => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img
          src={toImageSrc(recipe.imgQuery, recipe.title)}
          alt={recipe.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-8 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-4">
            <Link to="/" className="hover:text-white transition-colors cursor-pointer">Начало</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/recipes" className="hover:text-white transition-colors cursor-pointer">Рецепти</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-white/90 truncate">{recipe.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              {recipeCategories.find(c => c.id === recipe.category)?.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><i className="ri-time-line"></i> Подготовка: {recipe.prepTime}</span>
            <span className="flex items-center gap-1.5"><i className="ri-fire-line"></i> Печене: {recipe.bakingTime}</span>
            <span className="flex items-center gap-1.5"><i className="ri-calendar-line"></i> Общо: {recipe.totalTime}</span>
            <span className="flex items-center gap-1.5"><i className="ri-group-line"></i> {recipe.servings}</span>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ─── LEFT: Ingredients ─── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 sticky top-28">
              <h2 className="text-2xl font-bold text-[#1A0F08] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Продукти
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-[#C17A3A] flex-shrink-0 mt-2"></div>
                    <div>
                      <span className="text-sm font-bold text-[#1A0F08]">{ing.amount || `${ing.quantity || ''} ${ing.unit || ''}`.trim()}</span>
                      <span className="text-sm text-gray-600"> {ing.name}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pro tip */}
              <div className="mt-6 p-4 rounded-xl bg-[#F5EFE6]">
                <div className="flex items-start gap-2">
                  <i className="ri-lightbulb-line text-[#C17A3A] text-lg flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p className="text-xs font-semibold text-[#1A0F08] mb-1">Съвет на пекаря</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{recipe.tips}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Steps + Products ─── */}
          <div className="lg:col-span-2">

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-10">{recipe.description}</p>

            {/* Steps */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1A0F08] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Стъпки на приготвяне
              </h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A0F08] text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 leading-relaxed">{typeof step === 'string' ? step : (step.text || '')}</p>
                      {typeof step !== 'string' && step.image && (
                        <img src={toImageSrc(step.image, recipe.title)} alt="" className="mt-3 rounded-xl border border-gray-200 max-h-80 w-full object-cover" />
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {recipe.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-[#F5EFE6] text-[#C17A3A] text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            {/* ─── LINKED PRODUCTS ─── */}
            <div className="bg-[#1A0F08] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <i className="ri-tools-line text-[#F5C842] text-2xl"></i>
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Необходимо оборудване
                </h3>
              </div>
              <p className="text-white/60 text-sm mb-6">Тези продукти от нашия магазин ще ви помогнат да постигнете перфектен резултат:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {linkedProducts.map(p => (
                  <Link key={p.id} to={`/product?id=${p.id}`} className="group cursor-pointer">
                    <div className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-colors rounded-xl p-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5EFE6]">
                        <img
                          src={toImageSrc(p.imgQuery, p.name)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5C842] text-xs font-semibold uppercase tracking-wide mb-0.5">{p.categoryLabel}</p>
                        <p className="font-semibold text-white text-sm leading-tight truncate">{p.name}</p>
                        <p className="text-white/60 text-sm font-bold mt-1">{p.price.toFixed(2)} лв</p>
                      </div>
                      <i className="ri-arrow-right-line text-white/40 group-hover:text-white transition-colors flex-shrink-0"></i>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/shop"
                className="mt-6 flex items-center justify-center gap-2 py-3 bg-[#F5C842] text-[#1A0F08] rounded-xl font-bold text-sm hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-store-line"></i>
                Разгледайте пълния магазин
              </Link>
            </div>
          </div>
        </div>

        {/* ─── RELATED RECIPES ─── */}
        {relatedRecipes.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[#C17A3A] text-sm font-semibold uppercase tracking-widest mb-2">Може да харесате</p>
                <h2 className="text-3xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>Подобни рецепти</h2>
              </div>
              <Link to="/recipes" className="text-sm font-semibold text-[#1A0F08] border-b-2 border-[#1A0F08] hover:text-[#C17A3A] hover:border-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap pb-0.5">
                Всички рецепти <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedRecipes.map(r => (
                <Link key={r.id} to={`/recipe?id=${r.id}`} className="group cursor-pointer">
                  <article className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={toImageSrc(r.imgQuery, r.title)}
                        alt={r.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${DIFFICULTY_COLOR[r.difficulty]}`}>
                        {r.difficulty}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#1A0F08] leading-tight mb-2">{r.title}</h3>
                      <p className="text-gray-400 text-xs">{r.totalTime} · {r.servings}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
