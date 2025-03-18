export interface Menu {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Option {
  id: number;
  name: string;
  price: number;
  type: 'main_topping' | 'sauce' | 'additional_topping' | 'side_topping';
}

export interface OrderItem {
  menuId: number;
  menuName: string;
  menuPrice: number;
  quantity: number;
  options: {
    id: number;
    name: string;
    price: number;
    type: string;
  }[];
  totalPrice: number;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  status?: 'pending' | 'completed' | 'cancelled';
} 