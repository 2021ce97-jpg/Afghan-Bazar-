import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'guest' | 'buyer' | 'seller' | 'admin';

interface User {
  id: string;
  name: string;
  phone?: string;
  cnic?: string;
  shopId?: string;
}

interface AuthState {
  user: User | null;
  role: Role;
  loginAsSeller: (phone: string, cnic: string) => void;
  loginAsAdmin: () => void;
  loginAsBuyer: (name: string, phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: 'guest',
      loginAsSeller: (phone, cnic) => 
        set({ 
          user: { id: 'seller-1', name: 'Ahmad Seller', phone, cnic, shopId: '1' }, 
          role: 'seller' 
        }),
      loginAsAdmin: () => 
        set({ 
          user: { id: 'admin-1', name: 'System Admin' }, 
          role: 'admin' 
        }),
      loginAsBuyer: (name, phone) => 
        set({ 
          user: { id: 'buyer-1', name, phone }, 
          role: 'buyer' 
        }),
      logout: () => set({ user: null, role: 'guest' }),
    }),
    {
      name: 'bazar-auth-storage',
    }
  )
);
