import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function DashboardSection() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    apiGet('/api/admin/dashboard')
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, []);

  const stats = [
    { label: 'Общи Продажби', value: `${Number(dashboard?.stats?.totalSales || 0).toFixed(2)} лв`, change: '', icon: 'ri-money-dollar-circle-line', color: '#10B981' },
    { label: 'Активни Поръчки', value: String(dashboard?.stats?.activeOrders || 0), change: '', icon: 'ri-shopping-bag-line', color: '#3B82F6' },
    { label: 'Клиенти', value: String(dashboard?.stats?.customers || 0), change: '', icon: 'ri-user-add-line', color: '#8B5CF6' },
    { label: 'Приходи', value: `${Number(dashboard?.stats?.revenue || 0).toFixed(2)} лв`, change: '', icon: 'ri-line-chart-line', color: '#F59E0B' }
  ];

  const recentOrders = Array.isArray(dashboard?.recentOrders) ? dashboard.recentOrders : [];
  const topProducts = Array.isArray(dashboard?.topProducts) ? dashboard.topProducts : [];

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Dashboard</h2>
          <p className="text-gray-600">Добре дошли обратно, Мария!</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Търсене..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <i className="ri-notification-line text-2xl text-gray-700"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 bg-[#FFE4E1] rounded-full flex items-center justify-center cursor-pointer">
            <i className="ri-user-line text-xl text-[#2C1810]"></i>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <i className={`${stat.icon} text-2xl`} style={{ color: stat.color }}></i>
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-[#2C1810] mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2C1810]">Последни Поръчки</h3>
            <button className="text-sm text-[#8B4513] hover:underline cursor-pointer whitespace-nowrap">
              Виж всички
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Клиент</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Продукт</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Сума</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Дата</th>
                </tr>
              </thead>
              <tbody>
              {recentOrders.map((order: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-[#2C1810]">{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customer}</td>
                    <td className="py-3 px-4 text-sm">{order.product}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        order.status === 'Доставена' ? 'bg-green-100 text-green-700' :
                        order.status === 'Изпратена' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{Number(order.amount || 0).toFixed(2)} лв</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date ? new Date(order.date).toLocaleDateString('bg-BG') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-[#2C1810] mb-6">Топ Продукти</h3>
          <div className="space-y-4">
            {topProducts.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-[#2C1810] mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.sales} продажби</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2C1810]">{Number(product.revenue || 0).toFixed(2)} лв</p>
                  <i className="ri-arrow-up-line text-green-600 text-sm"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}