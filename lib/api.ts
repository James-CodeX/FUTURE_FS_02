import { Product } from './types';
const BASE = 'https://fakestoreapi.com';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init);
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return res.json();
}
export const getProducts = () => api<Product[]>('/products');
export const getProduct = (id: string | number) => api<Product>(`/products/${id}`);
