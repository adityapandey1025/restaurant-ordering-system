import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartState = { count: number; add: (quantity?: number) => void; reset: () => void };

export const useCartStore = create<CartState>()(persist(
  (set) => ({ count: 0, add: (quantity = 1) => set((state) => ({ count: state.count + quantity })), reset: () => set({ count: 0 }) }),
  { name: "restaurant-cart-session", storage: createJSONStorage(() => sessionStorage) },
));
