import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiSend, normalizeProduct, toImageSrc, type ApiProduct } from '@/lib/api';

export default function ProfileFavorites() {
  const [favorites, setFavorites] = useState<ApiProduct[]>([]);
  const [message, setMessage] = useState('');

  const loadFavorites = () => {
    apiGet<any[]>('/api/profile/favorites')
      .then((data) => setFavorites(data.map(normalizeProduct)))
      .catch(() => setFavorites([]));
  };

  useEffect(() => {
    loadFavorites();
    const onFavoritesUpdated = () => loadFavorites();
    window.addEventListener('favorites:updated', onFavoritesUpdated);
    return () => window.removeEventListener('favorites:updated', onFavoritesUpdated);
  }, []);

  const removeFavorite = async (id: number) => {
    await apiSend(`/api/profile/favorites/${id}`, 'DELETE');
    setFavorites(prev => prev.filter(p => p.id !== id));
    window.dispatchEvent(new CustomEvent('favorites:updated'));
    setMessage('Продуктът е премахнат от любими.');
    window.setTimeout(() => setMessage(''), 2000);
  };

  const addToCart = async (productId: number) => {
    await apiSend('/api/cart/items', 'POST', { productId, quantity: 1 });
    window.dispatchEvent(new CustomEvent('cart:updated'));
    setMessage('Продуктът е добавен в количката.');
    window.setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Любими Продукти
        </h2>
        <span className="text-sm text-gray-500">{favorites.length} продукта</span>
      </div>
      {message && <div className="mb-4 text-sm bg-green-50 text-green-700 border border-green-200 rounded-xl px-3 py-2">{message}</div>}

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#F5EFE6] rounded-full mb-4">
            <i className="ri-heart-line text-3xl text-[#C17A3A]"></i>
          </div>
          <h3 className="text-lg font-semibold text-[#1A0F08] mb-2">Нямате любими продукти</h3>
          <p className="text-gray-500 text-sm mb-6">Разгледайте магазина и добавете продукти в любими</p>
          <Link to="/shop" className="px-6 py-3 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
            Към Магазина
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:border-[#C17A3A]/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={toImageSrc(product.imgQuery, product.name)}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => void removeFavorite(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <i className="ri-heart-fill"></i>
                </button>
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-[#1A0F08] text-white text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
                <h3 className="font-semibold text-[#1A0F08] mt-1 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <i className="ri-star-fill text-[#F5C842] text-sm"></i>
                  <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[#1A0F08] text-lg">{product.price.toFixed(2)} лв</span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">{product.oldPrice.toFixed(2)} лв</span>
                    )}
                  </div>
                  <button onClick={() => void addToCart(product.id)} className="px-4 py-1.5 bg-[#1A0F08] text-white rounded-full text-xs font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
                    В кошницата
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
