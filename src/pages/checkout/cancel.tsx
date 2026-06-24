import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <div className="pt-36 pb-24 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-[#2C1810] mb-3">Плащането е отказано</h1>
          <p className="text-gray-600 mb-6">Няма извършено плащане. Можете да се върнете в количката и да опитате отново.</p>
          <Link to="/cart" className="inline-block px-6 py-3 rounded-full bg-[#2C1810] text-white">
            Назад към кошницата
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
