import { apiGet, apiSend } from '@/lib/api';

let authExpiresAt = 0;
const officesCache = new Map<string, any[]>();

export async function authenticate() {
  authExpiresAt = Date.now() + 55 * 60 * 1000;
  return { ok: true };
}

export async function refreshTokenIfNeeded() {
  if (Date.now() > authExpiresAt) {
    await authenticate();
  }
}

export async function getOffices(cityId?: string) {
  await refreshTokenIfNeeded();
  const key = cityId || '';
  if (officesCache.has(key)) return officesCache.get(key)!;
  const data = await apiGet<any[]>(`/api/shipping/speedy/offices${cityId ? `?city=${encodeURIComponent(cityId)}` : ''}`);
  officesCache.set(key, data);
  return data;
}

export async function getSites(search?: string) {
  return getOffices(search);
}

export async function getLockers(city?: string) {
  await refreshTokenIfNeeded();
  return apiGet<any[]>(`/api/shipping/speedy/lockers${city ? `?city=${encodeURIComponent(city)}` : ''}`);
}

export async function validateAddress(data: Record<string, unknown>) {
  await refreshTokenIfNeeded();
  return apiSend('/api/shipping/speedy/validate-address', 'POST', data);
}

export async function calculatePrice(payload: Record<string, unknown>) {
  await refreshTokenIfNeeded();
  return apiSend('/api/shipping/calculate', 'POST', payload);
}

export async function createShipment(order: { orderId: number }) {
  return apiSend(`/api/admin/orders/${order.orderId}/create-shipment`, 'POST');
}

export async function printLabel(orderId: number) {
  return `http://localhost:8080/api/admin/orders/${orderId}/speedy/label`;
}

export async function trackShipment(orderId: number) {
  return apiSend(`/api/admin/orders/${orderId}/refresh-tracking`, 'POST');
}

export async function requestCourierPickup(orderId: number) {
  return apiSend(`/api/admin/orders/${orderId}/speedy/request-pickup`, 'POST');
}

export async function cancelShipment(orderId: number) {
  return apiSend(`/api/admin/orders/${orderId}/speedy/cancel`, 'POST');
}
