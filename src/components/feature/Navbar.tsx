import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { apiGet } from '@/lib/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const refreshCartCount = () => {
    apiGet<any[]>('/api/cart')
      .then((items) => {
        const count = Array.isArray(items)
          ? items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
          : 0;
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  };

  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    refreshCartCount();
    const onCartUpdated = () => refreshCartCount();
    window.addEventListener('cart:updated', onCartUpdated);
    return () => window.removeEventListener('cart:updated', onCartUpdated);
  }, [location.pathname, isAuthenticated]);

  const transparent = isHome && !isScrolled;

  const navLinks = [
    { label: 'Магазин', to: '/shop' },
    { label: 'Комплекти', to: '/bundles' },
    { label: 'Курсове', to: '/vouchers' },
    { label: 'Учи & Книги', to: '/learn' },
    { label: 'Рецепти', to: '/recipes' },
    { label: 'Giveaway', to: '/giveaway' },
    { label: 'Блог', to: '/blog' },
    { label: 'За Нас', to: '/about' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent ? 'bg-transparent py-5' : 'bg-white/95 backdrop-blur-md py-3 border-b border-gray-100'
        }`}
      >
        <div className="w-full px-6 md:px-10">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${transparent ? 'bg-white/20' : 'bg-[#1A0F08]'}`}>
                <i className={`ri-bread-line text-xl ${transparent ? 'text-white' : 'text-[#F5C842]'}`}></i>
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${transparent ? 'text-white' : 'text-[#1A0F08]'}`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Квасен Занаят
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative group ${
                    transparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-[#1A0F08]'
                  } ${location.pathname === link.to ? (transparent ? 'text-white' : 'text-[#1A0F08] font-semibold') : ''}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-300 ${
                    location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  transparent
                    ? 'text-white/90 hover:bg-white/15'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className="ri-search-line text-xl"></i>
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                      transparent
                        ? 'text-white/90 hover:bg-white/15'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={user ? `${user.firstName} ${user.lastName}` : 'Профил'}
                  >
                    <i className="ri-user-3-line text-xl"></i>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      transparent
                        ? 'bg-white/15 text-white hover:bg-white/25'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Изход
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      transparent ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Вход
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      transparent ? 'bg-white text-[#1A0F08] hover:bg-[#F5C842]' : 'bg-[#1A0F08] text-white hover:bg-[#C17A3A]'
                    }`}
                  >
                    Регистрация
                  </Link>
                </div>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  transparent
                    ? 'text-white/90 hover:bg-white/15'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className="ri-shopping-bag-line text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#C17A3A] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Shop CTA */}
              <Link
                to="/shop"
                className={`hidden md:inline-flex items-center gap-1.5 ml-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  transparent
                    ? 'bg-white text-[#1A0F08] hover:bg-[#F5C842]'
                    : 'bg-[#1A0F08] text-white hover:bg-[#C17A3A]'
                }`}
              >
                Пазарувайте
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  transparent ? 'text-white hover:bg-white/15' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20' : 'max-h-0'}`}>
          <div className="px-6 md:px-10 py-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <i className="ri-search-line text-gray-400 text-xl flex-shrink-0"></i>
              <input
                type="text"
                placeholder="Търсете продукти..."
                autoFocus={searchOpen}
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                Начало
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 my-4"></div>
              <Link to="/subscription" className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                Абонамент
              </Link>
              <Link to="/vouchers" className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                Ваучери & Курсове
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                    Моят Профил
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg text-left text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                  >
                    Изход
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                    Вход
                  </Link>
                  <Link to="/register" className="px-4 py-3 rounded-lg text-[#1A0F08] font-medium hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                    Регистрация
                  </Link>
                </>
              )}
              {user?.isAdmin && (
                <Link to="/admin/dashboard" className="px-4 py-3 rounded-lg text-gray-500 text-sm hover:bg-[#F5EFE6] transition-colors cursor-pointer">
                  Администрация
                </Link>
              )}
              <Link
                to="/shop"
                className="mt-4 px-6 py-3 bg-[#1A0F08] text-white rounded-full text-center font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer"
              >
                Пазарувайте сега
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
