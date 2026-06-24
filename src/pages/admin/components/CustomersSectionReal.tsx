import { useEffect, useMemo, useState } from 'react';
import { apiGet, type PageResponse } from '@/lib/api';

export default function CustomersSectionReal() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadCustomers = (page = currentPage) => {
    setLoading(true);
    apiGet<PageResponse<any>>(`/api/admin/customers?page=${page}&size=25&sort=createdAt,desc`)
      .then((data) => {
        setCustomers(Array.isArray(data?.content) ? data.content : []);
        setCurrentPage(Number(data?.number || 0));
        setTotalPages(Math.max(1, Number(data?.totalPages || 1)));
      })
      .catch(() => {
        setCustomers([]);
        setCurrentPage(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers(0);
  }, []);

  const filtered = useMemo(
    () => customers.filter(c => `${c.name || ''} ${c.email || ''}`.toLowerCase().includes(search.toLowerCase())),
    [customers, search],
  );

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Клиенти</h2>
          <p className="text-gray-600">Реални клиенти от базата</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative mb-6 max-w-md">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси клиент..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Клиент</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Телефон</th>
                <th className="text-left py-2">Поръчки</th>
                <th className="text-left py-2">Общо</th>
                <th className="text-left py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name || '-'}</td>
                  <td className="py-2">{c.email}</td>
                  <td className="py-2">{c.phone || '-'}</td>
                  <td className="py-2">{c.orders || 0}</td>
                  <td className="py-2">{Number(c.totalSpent || 0).toFixed(2)} лв</td>
                  <td className="py-2">
                    <button onClick={() => setSelected(c)} className="p-2 hover:bg-gray-100 rounded-lg"><i className="ri-eye-line"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => loadCustomers(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || loading}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Страница {currentPage + 1} от {totalPages}</span>
          <button
            onClick={() => loadCustomers(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2C1810]">{selected.name || selected.email}</h3>
              <button onClick={() => setSelected(null)}><i className="ri-close-line text-xl"></i></button>
            </div>
            <div className="space-y-2 text-sm">
              <p>Email: {selected.email}</p>
              <p>Телефон: {selected.phone || '-'}</p>
              <p>Адрес: {selected.address || '-'}</p>
              <p>Град: {selected.city || '-'}</p>
              <p>Поръчки: {selected.orders || 0}</p>
              <p>Общо: {Number(selected.totalSpent || 0).toFixed(2)} лв</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
