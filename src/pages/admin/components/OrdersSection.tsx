import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend, type PageResponse } from '@/lib/api';

const ORDER_STATUSES = [
  { value: 'NEW', label: 'Нова' },
  { value: 'PROCESSING', label: 'Обработва се' },
  { value: 'SHIPPED', label: 'Изпратена' },
] as const;

const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: 'Нова',
  PROCESSING: 'Обработва се',
  SHIPPED: 'Изпратена',
};

export default function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'PROCESSING' | 'SHIPPED'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadOrders = (page = currentPage, status = statusFilter) => {
    setLoading(true);
    const statusParam = status === 'ALL' ? '' : `&status=${status}`;
    apiGet<PageResponse<any>>(`/api/admin/orders?page=${page}&size=25&sort=createdAt,desc${statusParam}`)
      .then((rows) => {
        setOrders(Array.isArray(rows?.content) ? rows.content : []);
        setCurrentPage(Number(rows?.number || 0));
        setTotalPages(Math.max(1, Number(rows?.totalPages || 1)));
        setTotalElements(Number(rows?.totalElements || 0));
      })
      .catch(() => {
        setOrders([]);
        setCurrentPage(0);
        setTotalPages(1);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  const refreshSelectedOrder = async (orderId: number) => {
    const refreshed = await apiGet<PageResponse<any>>(`/api/admin/orders?page=0&size=100&sort=createdAt,desc`);
    const row = (Array.isArray(refreshed?.content) ? refreshed.content : []).find((r) => r.id === orderId);
    if (row) setSelectedOrder(row);
  };

  const withAction = async (key: string, fn: () => Promise<void>) => {
    setBusyAction(key);
    setActionError('');
    setActionSuccess('');
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Неуспешна заявка');
    } finally {
      setBusyAction(null);
    }
  };

  useEffect(() => {
    loadOrders(0, statusFilter);
  }, []);

  useEffect(() => {
    loadOrders(0, statusFilter);
  }, [statusFilter]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = `${o.orderCode || ''} ${o.userKey || ''} ${o.customerName || ''} ${o.customerPhone || ''}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const rowStatus = String(o.status || 'NEW').toUpperCase();
      const matchesStatus = statusFilter === 'ALL' ? true : rowStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = async (orderId: number, status: 'NEW' | 'PROCESSING' | 'SHIPPED') => {
    await withAction(`status-${orderId}`, async () => {
      await apiSend(`/api/admin/orders/${orderId}/status`, 'PATCH', { status });
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => (prev ? { ...prev, status } : prev));
      }
      setActionSuccess('Статусът на поръчката е обновен.');
    });
  };

  const createShipment = async (orderId: number) => {
    await withAction('create', async () => {
      await apiSend(`/api/admin/orders/${orderId}/create-shipment`, 'POST');
      loadOrders();
      if (selectedOrder?.id === orderId) await refreshSelectedOrder(orderId);
      setActionSuccess('Пратката е създадена успешно.');
    });
  };

  const refreshTracking = async (orderId: number) => {
    await withAction('refresh', async () => {
      await apiSend(`/api/admin/orders/${orderId}/refresh-tracking`, 'POST');
      loadOrders();
      if (selectedOrder?.id === orderId) await refreshSelectedOrder(orderId);
      setActionSuccess('Tracking статусът е обновен.');
    });
  };

  const cancelShipment = async (orderId: number) => {
    await withAction('cancel', async () => {
      const provider = String(selectedOrder?.shippingProvider || '').toLowerCase();
      const cancelPath = provider === 'speedy'
        ? `/api/admin/orders/${orderId}/speedy/cancel`
        : `/api/admin/orders/${orderId}/boxnow/cancel`;
      await apiSend(cancelPath, 'POST');
      loadOrders();
      if (selectedOrder?.id === orderId) await refreshSelectedOrder(orderId);
      setActionSuccess('Пратката е отказана.');
    });
  };

  const retrySync = async (orderId: number) => {
    await withAction('sync', async () => {
      await apiSend(`/api/admin/orders/${orderId}/retry-sync`, 'POST');
      loadOrders();
      if (selectedOrder?.id === orderId) await refreshSelectedOrder(orderId);
      setActionSuccess('Синхронизацията е успешна.');
    });
  };

  const downloadSpeedyLabel = async (orderId: number) => {
    await withAction('label', async () => {
      const token = localStorage.getItem('kvas_token');
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/admin/orders/${orderId}/speedy/label`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error(`Неуспешно сваляне (${response.status})`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `speedy-label-${orderId}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setActionSuccess('Етикетът е изтеглен.');
    });
  };

  const cancelSpeedy = async (orderId: number) => {
    await withAction('cancel-speedy', async () => {
      await apiSend(`/api/admin/orders/${orderId}/speedy/cancel`, 'POST');
      loadOrders();
      if (selectedOrder?.id === orderId) await refreshSelectedOrder(orderId);
      setActionSuccess('Speedy пратката е отказана.');
    });
  };

  const requestPickup = async (orderId: number) => {
    await withAction('pickup', async () => {
      await apiSend(`/api/admin/orders/${orderId}/speedy/request-pickup`, 'POST');
      setActionSuccess('Заявката за куриер е изпратена.');
    });
  };

  const downloadLabel = async (orderId: number) => {
    await withAction('label-boxnow', async () => {
      const token = localStorage.getItem('kvas_token');
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/admin/orders/${orderId}/boxnow/label`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error(`Неуспешно сваляне (${response.status})`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boxnow-label-${orderId}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setActionSuccess('Етикетът е изтеглен.');
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Поръчки</h2>
          <p className="text-gray-600">Управление на всички поръчки</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>
            Експорт
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Всички Поръчки', value: String(totalElements), icon: 'ri-file-list-line', color: '#3B82F6' },
          { label: 'Готови за изпращане', value: String(orders.filter(o => o.shipmentStatus === 'READY_FOR_SHIPMENT').length), icon: 'ri-time-line', color: '#F59E0B' },
          { label: 'В Транзит', value: String(orders.filter(o => o.shipmentStatus === 'IN_TRANSIT').length), icon: 'ri-truck-line', color: '#8B5CF6' },
          { label: 'Доставени', value: String(orders.filter(o => o.shipmentStatus === 'DELIVERED').length), icon: 'ri-checkbox-circle-line', color: '#10B981' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#2C1810]">{stat.value}</h3>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <i className={`${stat.icon} text-2xl`} style={{ color: stat.color }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text"
              placeholder="Търси поръчка..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'NEW' | 'PROCESSING' | 'SHIPPED')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#2C1810]"
            >
              <option value="ALL">Всички статуси</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID Поръчка</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Клиент</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Продукти</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Сума</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Дата</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-[#2C1810]">{order.orderCode}</td>
                  <td className="py-3 px-4 text-sm">
                    <p className="font-medium text-[#2C1810]">{order.customerName || order.userKey}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone || order.customerEmail || order.userKey}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{Array.isArray(order.items) ? order.items.length : 0} продукта</td>
                  <td className="py-3 px-4">
                    <select
                      value={String(order.status || 'NEW').toUpperCase()}
                      onChange={(e) => void updateOrderStatus(order.id, e.target.value as 'NEW' | 'PROCESSING' | 'SHIPPED')}
                      disabled={busyAction === `status-${order.id}`}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{Number(order.total || 0).toFixed(2)} лв</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('bg-BG') : '-'}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <i className="ri-eye-line text-gray-600"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => loadOrders(Math.max(0, currentPage - 1), statusFilter)}
            disabled={currentPage === 0 || loading}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Страница {currentPage + 1} от {totalPages}</span>
          <button
            onClick={() => loadOrders(Math.min(totalPages - 1, currentPage + 1), statusFilter)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#2C1810]">Детайли на Поръчка {selectedOrder.orderCode}</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Клиент</p>
                <p className="text-sm font-medium text-[#2C1810]">{selectedOrder.customerName || selectedOrder.userKey || '-'}</p>
                <p className="text-xs text-gray-600">{selectedOrder.customerPhone || selectedOrder.customerEmail || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Статус</p>
                <p className="text-sm font-medium text-[#2C1810]">
                  {ORDER_STATUS_LABELS[String(selectedOrder.status || 'NEW').toUpperCase()] || 'Нова'}
                </p>
                <p className="text-xs text-gray-600">{selectedOrder.shipmentStatus || 'PENDING'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Доставка</p>
                <p className="text-sm font-medium text-[#2C1810]">{selectedOrder.shippingProvider || '-'}</p>
                <p className="text-xs text-gray-600">{selectedOrder.trackingNumber || 'Без номер'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Общо</p>
                <p className="text-sm font-medium text-[#2C1810]">{Number(selectedOrder.total || 0).toFixed(2)} лв</p>
                <p className="text-xs text-gray-600">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('bg-BG') : '-'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-[#2C1810] mb-2">Кратка информация</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p>
                  <span className="text-gray-600">Адрес:</span>{' '}
                  {selectedOrder.shippingAddress || selectedOrder.address || '-'}
                </p>
                <p>
                  <span className="text-gray-600">Офис/Locker:</span>{' '}
                  {selectedOrder.shippingOfficeName || selectedOrder.boxnowLockerName || selectedOrder.shippingLockerId || '-'}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{' '}
                  {selectedOrder.customerEmail || selectedOrder.userKey || '-'}
                </p>
                <p>
                  <span className="text-gray-600">COD:</span>{' '}
                  {selectedOrder.codAmount ? `${Number(selectedOrder.codAmount).toFixed(2)} лв` : 'не'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-[#2C1810] mb-3">Продукти</h4>
              <div className="space-y-2">
                {(selectedOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                    <span className="truncate">{item.productName}</span>
                    <span className="text-gray-600">{item.quantity} бр</span>
                    <span className="font-medium">{Number(item.unitPrice || 0).toFixed(2)} лв</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 mt-4 pt-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Крайна сума</span>
                  <span className="text-[#2C1810]">{Number(selectedOrder.total || 0).toFixed(2)} лв</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <button disabled={!!busyAction} onClick={() => void createShipment(selectedOrder.id)} className="px-4 py-2 bg-[#1A0F08] disabled:opacity-50 text-white rounded-lg text-sm hover:bg-[#C17A3A]">
                Create Shipment
              </button>
              <button disabled={!!busyAction} onClick={() => void refreshTracking(selectedOrder.id)} className="px-4 py-2 border border-[#1A0F08] disabled:opacity-50 text-[#1A0F08] rounded-lg text-sm hover:bg-gray-50">
                Refresh Tracking
              </button>
              <button disabled={!!busyAction} onClick={() => void downloadLabel(selectedOrder.id)} className="px-4 py-2 border border-[#1A0F08] disabled:opacity-50 text-[#1A0F08] rounded-lg text-sm hover:bg-gray-50">
                Download Label
              </button>
              <button disabled={!!busyAction} onClick={() => void cancelShipment(selectedOrder.id)} className="px-4 py-2 border border-red-300 disabled:opacity-50 text-red-700 rounded-lg text-sm hover:bg-red-50">
                Cancel Shipment
              </button>
              <button disabled={!!busyAction} onClick={() => void retrySync(selectedOrder.id)} className="px-4 py-2 border border-gray-300 disabled:opacity-50 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                Retry Sync
              </button>
              {selectedOrder.shippingProvider === 'speedy' && (
                <>
                  <button disabled={!!busyAction} onClick={() => void downloadSpeedyLabel(selectedOrder.id)} className="px-4 py-2 border border-[#1A0F08] disabled:opacity-50 text-[#1A0F08] rounded-lg text-sm hover:bg-gray-50">
                    Print Label
                  </button>
                  <button disabled={!!busyAction} onClick={() => void cancelSpeedy(selectedOrder.id)} className="px-4 py-2 border border-red-300 disabled:opacity-50 text-red-700 rounded-lg text-sm hover:bg-red-50">
                    Cancel Shipment
                  </button>
                  <button disabled={!!busyAction} onClick={() => void requestPickup(selectedOrder.id)} className="px-4 py-2 border border-gray-300 disabled:opacity-50 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                    Request Courier Pickup
                  </button>
                </>
              )}
            </div>
            {actionError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {actionSuccess}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                Затвори
              </button>
              <button onClick={() => loadOrders()} className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap">Опресни</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}