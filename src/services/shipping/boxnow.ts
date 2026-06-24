import { apiGet, apiSend } from '@/lib/api';

export type BoxNowLockerSelection = {
  lockerId: string;
  postalCode: string;
  address: string;
  name: string;
};

type DestinationFilters = {
  latlng?: string;
  radius?: string;
  requiredSize?: string;
  locationType?: 'apm';
  city?: string;
};

const destinationsCache = new Map<string, any[]>();
let authExpiresAt = 0;

export async function authenticate() {
  // Backend-only OAuth proxy. Frontend just keeps a lightweight ttl marker.
  authExpiresAt = Date.now() + 55 * 60 * 1000;
  return { ok: true };
}

export async function refreshTokenIfNeeded() {
  if (Date.now() > authExpiresAt) {
    await authenticate();
  }
}

export async function getOrigins() {
  await refreshTokenIfNeeded();
  return apiGet<any[]>('/api/shipping/boxnow/origins');
}

export async function getDestinations(filters: DestinationFilters = {}) {
  await refreshTokenIfNeeded();
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const key = params.toString();
  if (destinationsCache.has(key)) {
    return destinationsCache.get(key)!;
  }
  const data = await apiGet<any[]>(`/api/shipping/boxnow/destinations${key ? `?${key}` : ''}`);
  destinationsCache.set(key, data);
  return data;
}

export async function createDeliveryRequest(order: { orderId: number }) {
  return apiSend(`/api/admin/orders/${order.orderId}/create-shipment`, 'POST');
}

export async function getLabel(parcelIdOrOrderId: string) {
  return `/api/shipping/boxnow/parcels/${encodeURIComponent(parcelIdOrOrderId)}/label`;
}

export async function cancelParcel(parcelIdOrOrderId: string) {
  return apiSend(`/api/shipping/boxnow/parcels/${encodeURIComponent(parcelIdOrOrderId)}/cancel`, 'POST');
}
