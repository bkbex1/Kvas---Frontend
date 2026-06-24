import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type VoucherRow = {
  id: number;
  code: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string;
  expiresAt: string;
  redeemedAt?: string | null;
  recipientName?: string | null;
  senderName?: string | null;
};

type VoucherPayload = {
  purchased: VoucherRow[];
  received: VoucherRow[];
};

export default function ProfileVouchers() {
  const [data, setData] = useState<VoucherPayload>({ purchased: [], received: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<VoucherPayload>('/api/profile/vouchers')
      .then((payload) => setData(payload))
      .catch(() => setData({ purchased: [], received: [] }))
      .finally(() => setLoading(false));
  }, []);

  const renderList = (items: VoucherRow[], emptyText: string) => {
    if (items.length === 0) {
      return <p className="text-sm text-gray-500">{emptyText}</p>;
    }
    return (
      <div className="space-y-3">
        {items.map((voucher) => (
          <div key={voucher.id} className="rounded-xl border border-[#EFE8DE] bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[#1A0F08]">{voucher.code}</p>
              <span className="text-sm font-semibold text-[#C17A3A]">
                {Number(voucher.amount).toFixed(2)} {voucher.currency}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
              <span>Статус: {voucher.status}</span>
              <span>Валиден до: {voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString('bg-BG') : '-'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-[#EFE8DE] bg-[#FFFCF8] p-6">
        <h3 className="text-xl font-bold text-[#1A0F08] mb-3">Купени ваучери</h3>
        {loading ? <p className="text-sm text-gray-500">Зареждане...</p> : renderList(data.purchased, 'Все още нямате купени ваучери.')}
      </section>
      <section className="rounded-2xl border border-[#EFE8DE] bg-[#FFFCF8] p-6">
        <h3 className="text-xl font-bold text-[#1A0F08] mb-3">Получени ваучери</h3>
        {loading ? <p className="text-sm text-gray-500">Зареждане...</p> : renderList(data.received, 'Все още нямате получени ваучери.')}
      </section>
    </div>
  );
}
