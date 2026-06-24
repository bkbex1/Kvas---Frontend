import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet } from '@/lib/api';

type StatusResponse = {
  orderCode: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  total: number;
};

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Липсва session_id.');
      return;
    }
    apiGet<StatusResponse>(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`)
      .then(setStatus)
      .catch(() => setError('Не успяхме да заредим статуса на плащането.'));
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <div className="pt-36 pb-24 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 shadow-lg text-center">
          {!status && !error && <p className="text-gray-600">Проверяваме плащането...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {status && (
            <>
              <h1 className="text-3xl font-bold text-[#2C1810] mb-3">Stripe Checkout</h1>
              <p className="text-gray-600 mb-2">Поръчка: {status.orderCode}</p>
              <p className="text-gray-700 mb-2">Статус: <strong>{status.paymentStatus}</strong></p>
              <p className="text-gray-700 mb-6">Общо: {Number(status.total || 0).toFixed(2)} лв</p>
              <Link to="/" className="inline-block px-6 py-3 rounded-full bg-[#2C1810] text-white">
                Към начална страница
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
