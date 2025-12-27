import { Product } from './types';
const BASE = 'https://fakestoreapi.com';

// Timeout wrapper for fetch with default 10 second timeout
async function fetchWithTimeout(url: string, init?: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithTimeout(BASE + path, init);
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return res.json();
}

// Wrapper for getProducts with error handling that returns empty array on failure
export async function getProducts(): Promise<Product[]> {
  try {
    return await api<Product[]>('/products');
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export const getProduct = (id: string | number) => api<Product>(`/products/${id}`);
