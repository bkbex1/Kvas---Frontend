import { useState } from 'react';

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#2C1810]">Настройки</h2>
        <p className="text-gray-600">Конфигурация на магазина</p>
      </div>

      <div className="flex space-x-2 mb-8">
        {[
          { id: 'general', label: 'Общи', icon: 'ri-settings-3-line' },
          { id: 'store', label: 'Магазин', icon: 'ri-store-line' },
          { id: 'shipping', label: 'Доставка', icon: 'ri-truck-line' },
          { id: 'payment', label: 'Плащане', icon: 'ri-bank-card-line' },
          { id: 'notifications', label: 'Известия', icon: 'ri-notification-line' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#2C1810] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-[#2C1810] mb-6">Общи Настройки</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Име на Магазина</label>
              <input 
                type="text" 
                defaultValue="Квасен Занаят"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email за Контакт</label>
              <input 
                type="email" 
                defaultValue="info@kvasenzanat.bg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
              <input 
                type="tel" 
                defaultValue="+359 88 123 4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
              <textarea 
                rows={3}
                defaultValue="ул. Витоша 15, София 1000, България"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Описание на Магазина</label>
              <textarea 
                rows={4}
                defaultValue="Професионално оборудване и инструменти за приготвяне на квасен хляб. Висококачествени продукти за всеки любител на занаята."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]"
              ></textarea>
            </div>
            <div className="flex items-center justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap"
              >
                Запази Промени
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Store Settings */}
      {activeTab === 'store' && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-[#2C1810] mb-6">Настройки на Магазина</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Валута</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]">
                <option>BGN (лв)</option>
                <option>EUR (€)</option>
                <option>USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Минимална Поръчка</label>
              <input 
                type="number" 
                defaultValue="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ДДС (%)</label>
              <input 
                type="number" 
                defaultValue="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="stock" className="w-4 h-4" defaultChecked />
              <label htmlFor="stock" className="text-sm text-gray-700">Показвай наличност на продукти</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="reviews" className="w-4 h-4" defaultChecked />
              <label htmlFor="reviews" className="text-sm text-gray-700">Разреши отзиви от клиенти</label>
            </div>
            <div className="flex items-center justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap"
              >
                Запази Промени
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-[#2C1810] mb-6">Настройки за Доставка</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Безплатна Доставка над</label>
              <input 
                type="number" 
                defaultValue="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цена на Доставка (лв)</label>
              <input 
                type="number" 
                defaultValue="5.99"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Срок за Доставка (дни)</label>
              <input 
                type="text" 
                defaultValue="2-3 работни дни"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Куриерска Фирма</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]">
                <option>Speedy</option>
                <option>Econt</option>
                <option>DHL</option>
                <option>Bulgarian Post</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="tracking" className="w-4 h-4" defaultChecked />
              <label htmlFor="tracking" className="text-sm text-gray-700">Проследяване на пратки</label>
            </div>
            <div className="flex items-center justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap"
              >
                Запази Промени
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-[#2C1810] mb-6">Настройки за Плащане</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Методи за Плащане</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="card" className="w-4 h-4" defaultChecked />
                    <label htmlFor="card" className="text-sm font-medium">Кредитна/Дебитна Карта</label>
                  </div>
                  <i className="ri-bank-card-line text-2xl text-gray-400"></i>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="cod" className="w-4 h-4" defaultChecked />
                    <label htmlFor="cod" className="text-sm font-medium">Наложен Платеж</label>
                  </div>
                  <i className="ri-money-dollar-circle-line text-2xl text-gray-400"></i>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="bank" className="w-4 h-4" />
                    <label htmlFor="bank" className="text-sm font-medium">Банков Превод</label>
                  </div>
                  <i className="ri-bank-line text-2xl text-gray-400"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Такса Наложен Платеж (лв)</label>
              <input 
                type="number" 
                defaultValue="2.50"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div className="flex items-center justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap"
              >
                Запази Промени
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-[#2C1810] mb-6">Настройки за Известия</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Email Известия</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="new-order" className="w-4 h-4" defaultChecked />
                  <label htmlFor="new-order" className="text-sm text-gray-700">Нова поръчка</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="low-stock" className="w-4 h-4" defaultChecked />
                  <label htmlFor="low-stock" className="text-sm text-gray-700">Ниска наличност</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="new-customer" className="w-4 h-4" />
                  <label htmlFor="new-customer" className="text-sm text-gray-700">Нов клиент</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="new-review" className="w-4 h-4" defaultChecked />
                  <label htmlFor="new-review" className="text-sm text-gray-700">Нов отзив</label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email за Известия</label>
              <input 
                type="email" 
                defaultValue="admin@kvasenzanat.bg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">SMS Известия</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="sms-order" className="w-4 h-4" />
                  <label htmlFor="sms-order" className="text-sm text-gray-700">Нова поръчка</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="sms-urgent" className="w-4 h-4" defaultChecked />
                  <label htmlFor="sms-urgent" className="text-sm text-gray-700">Спешни известия</label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap"
              >
                Запази Промени
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}