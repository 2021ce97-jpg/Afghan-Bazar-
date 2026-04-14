import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Currency = 'AFN' | 'USD';

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number; // AFN to USD rate
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'AFN',
      setCurrency: (currency) => set({ currency }),
      exchangeRate: 71.50, // 1 USD = 71.50 AFN
    }),
    {
      name: 'bazar-currency-storage',
    }
  )
);
