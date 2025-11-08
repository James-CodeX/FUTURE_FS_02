export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
export interface CartItem { product: Product; qty: number; }
export interface Order { id: string; items: CartItem[]; total: number; createdAt: string; }
export interface User { username: string; token?: string; }
