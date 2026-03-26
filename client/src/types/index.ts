export interface Shop {
  _id: string;
  name: string;
  image: string;
  rating: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  shop: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  couponCode?: string;
  discount: number;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  name: string;
  code: string;
  discountPercent: number;
  image: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories: string[];
}