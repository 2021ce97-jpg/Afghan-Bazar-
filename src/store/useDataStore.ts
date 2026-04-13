import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_PRODUCTS, MOCK_SHOPS } from '../lib/seedData';

export type Product = {
  id: string;
  shopId: string;
  title: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviews?: number;
  variants?: any[];
  isFeatured?: boolean;
};
export type Shop = typeof MOCK_SHOPS[0] & {
  isOpen?: boolean;
  deliveryAvailable?: boolean;
  tazkiraUrl?: string;
};

interface DataState {
  products: Product[];
  shops: Shop[];
  updateProduct: (id: string, data: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateShop: (id: string, data: Partial<Shop>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,
      shops: MOCK_SHOPS,
      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      updateShop: (id, data) =>
        set((state) => ({
          shops: state.shops.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),
    }),
    {
      name: 'bazar-data-storage',
    }
  )
);
