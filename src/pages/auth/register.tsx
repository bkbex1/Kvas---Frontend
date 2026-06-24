import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useAuth } from '@/auth/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      return;
    }
    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
      navigate('/profile');
    } catch {
      setError('Неуспешна регистрация. Проверете данните.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-[#1A0F08] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Регистрация</h1>
          <p className="text-gray-500 text-sm mb-6">Създайте нов профил в Квасен Занаят.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Име"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
              />
            </div>
            <input
              type="email"
              placeholder="Имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
            />
            <input
              type="password"
              placeholder="Парола (минимум 6 символа)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
            />
            <input
              type="password"
              placeholder="Повтори парола"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A0F08] text-white rounded-xl font-semibold hover:bg-[#C17A3A] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Регистрация...' : 'Създай акаунт'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-5 text-center">
            Имате профил? <Link to="/login" className="text-[#1A0F08] font-semibold hover:text-[#C17A3A]">Вход</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

