import { useEffect, useMemo, useRef, useState } from 'react';
import { apiGet } from '@/lib/api';
import { getDestinations, type BoxNowLockerSelection } from '@/services/shipping/boxnow';

declare global {
  interface Window {
    _bn_map_widget_config?: Record<string, unknown>;
    boxnowWidget?: { open: () => void };
  }
}

type Props = {
  selected: BoxNowLockerSelection | null;
  onSelect: (value: BoxNowLockerSelection) => void;
  requiredSize: 1 | 2 | 3;
};

export default function BoxNowPicker({ selected, onSelect, requiredSize }: Props) {
  const [widgetLoading, setWidgetLoading] = useState(false);
  const [widgetError, setWidgetError] = useState('');
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackList, setFallbackList] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [config, setConfig] = useState<{ partnerId: string; env: string } | null>(null);

  useEffect(() => {
    apiGet<{ partnerId: string; env: string }>('/api/shipping/boxnow/widget-config')
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const openWidget = async () => {
    setWidgetError('');
    setWidgetLoading(true);
    try {
      if (!document.getElementById('boxnow-widget-script')) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'boxnow-widget-script';
          script.src = 'https://widget-cdn.boxnow.bg/map-widget/client/v5.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('script-load-failed'));
          document.body.appendChild(script);
        });
      }

      window._bn_map_widget_config = {
        partnerId: config?.partnerId || '',
        parentElement: '#boxnowmap',
        type: window.innerWidth < 768 ? 'fullscreen' : 'popup',
        gps: true,
        autoclose: true,
        afterSelect: (picked: any) => {
          onSelect({
            lockerId: String(picked?.boxnowLockerId || ''),
            postalCode: String(picked?.boxnowLockerPostalCode || ''),
            address: String(picked?.boxnowLockerAddressLine1 || ''),
            name: String(picked?.boxnowLockerName || picked?.boxnowLockerAddressLine1 || ''),
          });
        },
      };

      if (window.boxnowWidget?.open) {
        window.boxnowWidget.open();
      }
    } catch {
      setWidgetError('Widget не може да се зареди в момента.');
    } finally {
      setWidgetLoading(false);
    }
  };

  useEffect(() => {
    if (widgetError === '') return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setFallbackLoading(true);
      getDestinations({ city: query, locationType: 'apm', requiredSize: String(requiredSize) })
        .then((list) => {
          if (!controller.signal.aborted) setFallbackList(list);
        })
        .catch(() => {
          if (!controller.signal.aborted) setFallbackList([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setFallbackLoading(false);
        });
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [widgetError, query, requiredSize]);

  const filteredFallback = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return fallbackList;
    return fallbackList.filter((x) =>
      `${x.name || ''} ${x.city || ''} ${x.addressLine1 || x.address || ''}`.toLowerCase().includes(q),
    );
  }, [fallbackList, query]);

  return (
    <div className="rounded-xl border border-[#E7DDD1] p-4 bg-[#FFFCF9]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-[#2C1810]">BoxNow автомат</p>
          <p className="text-xs text-gray-500">Удобно получаване 24/7</p>
        </div>
        <button type="button" onClick={() => void openWidget()} className="px-4 py-2 rounded-full bg-[#1A0F08] text-white text-sm hover:bg-[#C17A3A]">
          {selected ? 'Смени автомат' : 'Избери автомат'}
        </button>
      </div>

      <div id="boxnowmap" className="h-0 overflow-hidden" />

      {widgetLoading && <p className="mt-3 text-xs text-gray-500">Зареждане на BoxNow карта...</p>}

      {widgetError && (
        <div className="mt-3 p-3 rounded-lg border border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{widgetError}</p>
          <button type="button" onClick={() => void openWidget()} className="mt-2 text-xs text-red-700 underline">
            Retry widget
          </button>
        </div>
      )}

      {widgetError && (
        <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-sm font-medium text-[#2C1810] mb-2">Fallback избор на автомат</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Търси по град..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {fallbackLoading && <p className="mt-2 text-xs text-gray-500">Зареждане...</p>}
          <div className="mt-2 max-h-44 overflow-y-auto divide-y">
            {filteredFallback.map((item, idx) => (
              <button
                key={`${item.id || item.locationId || idx}`}
                type="button"
                onClick={() =>
                  onSelect({
                    lockerId: String(item.id || item.locationId || ''),
                    postalCode: String(item.postalCode || ''),
                    address: String(item.addressLine1 || item.address || ''),
                    name: String(item.name || item.addressLine1 || ''),
                  })
                }
                className="w-full text-left py-2 text-sm hover:bg-gray-50 px-1"
              >
                <p className="font-medium text-[#2C1810]">{item.name || item.addressLine1 || 'BoxNow Locker'}</p>
                <p className="text-xs text-gray-500">{item.addressLine1 || item.address || ''}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
          <p className="font-semibold text-green-800">Избран автомат: {selected.name}</p>
          <p className="text-green-700">{selected.address}</p>
          <p className="text-xs text-green-700">Пощ. код: {selected.postalCode} | Locker ID: {selected.lockerId}</p>
        </div>
      )}
    </div>
  );
}
