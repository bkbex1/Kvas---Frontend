import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ApiProduct } from '@/lib/api';
import { apiSend } from '@/lib/api';

interface ProductInfoProps {
  product: ApiProduct;
  compareList: number[];
  onToggleCompare: (id: number) => void;
}

export default function ProductInfo({ product, compareList, onToggleCompare }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    await apiSend('/api/cart/items', 'POST', { productId: product.id, quantity });
    window.dispatchEvent(new CustomEvent('cart:updated'));
    setAddedToCart(true);
    setMessage('Добавено в количката.');
    setTimeout(() => setAddedToCart(false), 2000);
    setTimeout(() => setMessage(''), 2000);
  };

  const stockColor = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500';
  const stockIcon = product.stock > 10 ? 'ri-checkbox-circle-fill' : product.stock > 0 ? 'ri-error-warning-fill' : 'ri-close-circle-fill';
  const stockLabel = product.stock > 10 ? 'В наличност' : product.stock > 0 ? `Само ${product.stock} бр. налични` : 'Изчерпан';

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-[#1A0F08] transition-colors cursor-pointer">Начало</Link>
        <i className="ri-arrow-right-s-line"></i>
        <Link to="/shop" className="hover:text-[#1A0F08] transition-colors cursor-pointer">Магазин</Link>
        <i className="ri-arrow-right-s-line"></i>
        <span className="text-[#1A0F08] font-medium truncate">{product.name}</span>
      </nav>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-[#F5EFE6] text-[#C17A3A] text-xs font-semibold uppercase tracking-wider">
          {product.categoryLabel}
        </span>
        {product.badge && (
          <span className="px-3 py-1 rounded-full bg-[#1A0F08] text-white text-xs font-semibold">
            {product.badge}
          </span>
        )}
        {product.limited && (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1">
            <i className="ri-fire-line"></i> Ограничена наличност
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#1A0F08] leading-tight mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
        {product.name}
      </h1>
      <p className="text-gray-500 text-base mb-4">{product.desc}</p>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="flex">
          {[1,2,3,4,5].map(s => (
            <i key={s} className={`${s <= Math.round(product.rating) ? 'ri-star-fill text-[#F5C842]' : 'ri-star-line text-gray-300'} text-base`}></i>
          ))}
        </div>
        <span className="text-sm font-semibold text-[#1A0F08]">{product.rating}</span>
        <span className="text-sm text-gray-400">({product.reviewCount} отзива)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-4xl font-bold text-[#1A0F08]">{product.price.toFixed(2)} лв</span>
        {product.oldPrice && (
          <span className="text-xl text-gray-400 line-through">{product.oldPrice.toFixed(2)} лв</span>
        )}
        {product.oldPrice && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-6">Цената включва ДДС</p>

      {/* Stock */}
      <div className={`flex items-center gap-2 text-sm font-medium mb-6 ${stockColor}`}>
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`${stockIcon} text-base`}></i>
        </div>
        {stockLabel}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium text-gray-600">Количество:</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#F5EFE6] transition-colors cursor-pointer"
          >
            <i className="ri-subtract-line"></i>
          </button>
          <span className="w-12 text-center font-semibold text-[#1A0F08]">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#F5EFE6] transition-colors cursor-pointer disabled:opacity-30"
          >
            <i className="ri-add-line"></i>
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      {message && <div className="mb-3 text-sm bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2">{message}</div>}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => void handleAddToCart()}
          disabled={product.stock === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all cursor-pointer whitespace-nowrap ${
            addedToCart
              ? 'bg-green-500 text-white'
              : 'bg-[#1A0F08] text-white hover:bg-[#C17A3A]'
          } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          <i className={`${addedToCart ? 'ri-check-line' : 'ri-shopping-cart-line'} text-lg`}></i>
          {addedToCart ? 'Добавено!' : product.stock === 0 ? 'Изчерпан' : 'Добави в кошницата'}
        </button>
        <button
          onClick={() => {
            const next = !wishlisted;
            setWishlisted(next);
            void (next ? apiSend(`/api/profile/favorites/${product.id}`, 'POST') : apiSend(`/api/profile/favorites/${product.id}`, 'DELETE'))
              .then(() => window.dispatchEvent(new CustomEvent('favorites:updated')));
          }}
          className={`w-14 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${
            wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
          }`}
        >
          <i className={`${wishlisted ? 'ri-heart-fill' : 'ri-heart-line'} text-xl`}></i>
        </button>
      </div>

      {/* Buy Now */}
      <Link
        to="/checkout"
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-[#1A0F08] text-[#1A0F08] font-semibold hover:bg-[#1A0F08] hover:text-white transition-all cursor-pointer whitespace-nowrap mb-6"
      >
        <i className="ri-flashlight-line text-lg"></i>
        Купи сега
      </Link>

      {/* Compare */}
      <button
        onClick={() => onToggleCompare(product.id)}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer mb-6 ${
          compareList.includes(product.id)
            ? 'bg-[#F5EFE6] text-[#C17A3A] border border-[#C17A3A]'
            : 'bg-[#FAFAF7] text-gray-500 border border-gray-200 hover:border-gray-300'
        }`}
      >
        <i className={`${compareList.includes(product.id) ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'} text-base`}></i>
        {compareList.includes(product.id) ? 'Добавен за сравнение' : 'Добави за сравнение'}
      </button>

      {/* Delivery Info */}
      <div className="rounded-xl bg-[#F5EFE6] p-5 space-y-3">
        {[
          { icon: 'ri-truck-line', text: 'Безплатна доставка над 100 лв' },
          { icon: 'ri-refresh-line', text: 'Връщане до 30 дни' },
          { icon: 'ri-secure-payment-line', text: 'Сигурно плащане' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icon} text-[#C17A3A] text-base`}></i>
            </div>
            <span className="text-sm text-gray-600">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
