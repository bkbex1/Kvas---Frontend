import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

const statusColor: Record<string, string> = {
  'Доставена': 'bg-green-100 text-green-700',
  'В процес': 'bg-amber-100 text-amber-700',
  'Изпратена': 'bg-blue-100 text-blue-700',
  'Отказана': 'bg-red-100 text-red-700',
  'IN_TRANSIT': 'bg-blue-100 text-blue-700',
  'READY_FOR_SHIPMENT': 'bg-amber-100 text-amber-700',
  'DELIVERED': 'bg-green-100 text-green-700',
  'PENDING': 'bg-gray-100 text-gray-700',
};

export default function ProfileOrders() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    apiGet<any[]>('/api/profile/orders')
      .then((orders) => {
        const mapped = orders.map((order) => ({
          id: order.orderCode || `#ORD-${order.id}`,
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('bg-BG') : '',
          status: order.shipmentStatus || order.status || 'PENDING',
          total: Number(order.total || 0),
          items: Array.isArray(order.items) ? order.items : [],
          address: order.address || '',
          trackingNumber: order.trackingNumber || undefined,
          shippingProvider: order.shippingProvider || '',
        }));
        setUserOrders(mapped);
      })
      .catch(() => setUserOrders([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A0F08]" style={{ fontFamily: 'Playfair Display, serif' }}>
          История на Поръчки
        </h2>
        <span className="text-sm text-gray-500">{userOrders.length} поръчки общо</span>
      </div>

      <div className="space-y-4">
        {userOrders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Order Header */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F5EFE6] rounded-xl">
                  <i className="ri-shopping-bag-line text-[#C17A3A] text-xl"></i>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#1A0F08]">{order.id}</span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{order.date} &bull; {order.items.length} продукта &bull; {order.shippingProvider || 'courier n/a'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {order.trackingNumber && (
                  <span className="text-xs text-gray-500 hidden md:block">Проследяване: {order.trackingNumber}</span>
                )}
                <span className="font-bold text-[#1A0F08] text-lg">{order.total.toFixed(2)} лв</span>
                <i className={`${expanded === order.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-gray-400 text-xl`}></i>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === order.id && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Products */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Продукти</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28item.imgQuery%29%7D&width=80&height=80&seq=order-item-${order.id}-${idx}&orientation=squarish`}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover object-top"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1A0F08]">{item.productName}</p>
                            <p className="text-xs text-gray-500">{item.quantity}× &times; {Number(item.unitPrice || 0).toFixed(2)} лв</p>
                          </div>
                          <span className="text-sm font-bold text-[#1A0F08]">{(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)} лв</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Информация</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <i className="ri-map-pin-line text-gray-400 mt-0.5"></i>
                        <span className="text-sm text-gray-600">{order.address}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <i className="ri-truck-line text-gray-400"></i>
                          <span className="text-sm text-gray-600">Проследяване: <strong>{order.trackingNumber}</strong></span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <i className="ri-calendar-line text-gray-400"></i>
                        <span className="text-sm text-gray-600">Поръчана на {order.date}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Общо</span>
                      <span className="text-lg font-bold text-[#1A0F08]">{order.total.toFixed(2)} лв</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {order.status === 'Доставена' && (
                    <button className="px-4 py-2 bg-[#1A0F08] text-white rounded-full text-sm font-medium hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap">
                      Поръчай отново
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                    Детайли
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
