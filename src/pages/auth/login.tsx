import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useAuth } from '@/auth/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fromPath =
    typeof (location.state as { from?: { pathname?: string } } | null)?.from?.pathname === 'string'
      ? (location.state as { from?: { pathname?: string } }).from?.pathname
      : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(fromPath || '/profile', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Невалиден имейл или парола.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-[#1A0F08] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Вход</h1>
          <p className="text-gray-500 text-sm mb-6">Влезте в профила си, за да продължите.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имейл</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Парола</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A0F08] text-white rounded-xl font-semibold hover:bg-[#C17A3A] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Влизане...' : 'Вход'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-5 text-center">
            Нямате акаунт? <Link to="/register" className="text-[#1A0F08] font-semibold hover:text-[#C17A3A]">Регистрация</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

