import { Shop, ProductsResponse, Order, Coupon } from '../types';

const API = '/api';

export async function fetchShops(minRating?: number, maxRating?: number): Promise<Shop[]> {
  const params = new URLSearchParams();
  if (minRating !== undefined) params.set('minRating', String(minRating));
  if (maxRating !== undefined) params.set('maxRating', String(maxRating));
  const res = await fetch(`${API}/shops?${params}`);
  return res.json();
}

export async function fetchProducts(
  shopId: string,
  options: { category?: string; sort?: string; page?: number; limit?: number } = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.sort) params.set('sort', options.sort);
  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));
  const res = await fetch(`${API}/shops/${shopId}/products?${params}`);
  return res.json();
}

export async function createOrder(order: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { product: string; name: string; price: number; quantity: number }[];
  couponCode?: string;
}): Promise<Order> {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create order');
  }
  return res.json();
}

export async function searchOrders(params: {
  email?: string;
  phone?: string;
  orderId?: string;
}): Promise<Order[]> {
  const query = new URLSearchParams();
  if (params.email) query.set('email', params.email);
  if (params.phone) query.set('phone', params.phone);
  if (params.orderId) query.set('orderId', params.orderId);
  const res = await fetch(`${API}/orders?${query}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to search orders');
  }
  return res.json();
}

export async function fetchCoupons(): Promise<Coupon[]> {
  const res = await fetch(`${API}/coupons`);
  return res.json();
}

export async function validateCoupon(code: string): Promise<{ valid: boolean; discountPercent?: number; name?: string }> {
  const res = await fetch(`${API}/coupons/validate/${code}`);
  return res.json();
}