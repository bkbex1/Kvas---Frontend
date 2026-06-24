const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const TOKEN_KEY = 'kvas_token';

export interface ApiProduct {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  desc: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  imgQuery: string;
  images: string[];
  stock: number;
  limited: boolean;
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
  description: string;
  features: string[];
  tags?: string[];
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function buildError(response: Response): Promise<ApiError> {
  let details: any = null;
  try {
    details = await response.json();
  } catch {
    /* ignore non-JSON bodies */
  }
  const message = (details && (details.message || details.error)) || `API request failed: ${response.status}`;
  return new ApiError(message, response.status, details);
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) {
    throw await buildError(response);
  }
  return response.json();
}

export async function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: unknown): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw await buildError(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export async function apiUploadImage(path: string, file: File): Promise<{ url: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!response.ok) {
    throw await buildError(response);
  }
  return response.json();
}

export function toImageSrc(value: string | null | undefined, fallback = 'artisan baking product'): string {
  const raw = (value || '').trim();
  if (!raw) {
    return `https://readdy.ai/api/search-image?query=${encodeURIComponent(fallback)}&width=700&height=500&orientation=landscape`;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  if (raw.startsWith('/uploads/')) {
    return `${API_BASE_URL}${raw}`;
  }
  return `https://readdy.ai/api/search-image?query=${encodeURIComponent(raw)}&width=700&height=500&orientation=landscape`;
}

export function normalizeProduct(raw: any): ApiProduct {
  const images = Array.isArray(raw.images)
    ? raw.images.filter((x: unknown) => typeof x === 'string' && x.trim().length > 0)
    : [];
  const primaryImage = images[0] || raw.imgQuery || raw.name || 'artisan baking product';
  return {
    id: Number(raw.id),
    name: raw.name || '',
    category: raw.category || 'tools',
    categoryLabel: raw.categoryLabel || 'Инструменти',
    desc: raw.desc || raw.description || '',
    price: Number(raw.price || 0),
    oldPrice: raw.oldPrice != null ? Number(raw.oldPrice) : undefined,
    badge: raw.badge || undefined,
    imgQuery: primaryImage,
    images,
    stock: Number(raw.stock || 0),
    limited: Boolean(raw.limited) || Number(raw.stock || 0) <= 10,
    rating: Number(raw.rating || 4.5),
    reviewCount: Number(raw.reviewCount || 0),
    specs: raw.specs || {},
    description: raw.description || raw.desc || '',
    features: Array.isArray(raw.features) ? raw.features : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

export function asContentArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  const page = payload as { content?: unknown };
  return Array.isArray(page?.content) ? (page.content as T[]) : [];
}

export async function apiGetAllCatalogProducts(): Promise<any[]> {
  const all: any[] = [];
  let page = 0;
  let totalPages = 1;
  while (page < totalPages) {
    const payload = await apiGet<any>(`/api/catalog/products?page=${page}&size=100&sort=name,asc`);
    const content = asContentArray<any>(payload);
    all.push(...content);
    totalPages = typeof payload?.totalPages === 'number' ? payload.totalPages : 1;
    page += 1;
    if (Array.isArray(payload)) break;
  }
  return all;
}

