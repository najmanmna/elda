// src/store/index.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/sanity.types";
import type { SanityImage } from "@/types/sanity-helpers";
import toast from "react-hot-toast";

// ✅ 1. Import the ProductPayload type
import { ProductPayload } from "@/types";

export interface CartVariant {
  _key: string;
  name?: string; 
  availableStock?: number;
  images?: SanityImage[];
}

export interface CartItem {
  // ✅ 2. Use ProductPayload instead of the base Product type
  product: ProductPayload;
  variant: CartVariant;
  itemKey: string;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  // The product parameter now correctly expects a ProductPayload
  addItem: (product: ProductPayload, variant: CartVariant, quantity?: number) => void;
  increaseQuantity: (itemKey: string) => void;
  decreaseQuantity: (itemKey: string) => void;
  deleteCartProduct: (itemKey: string) => void;
  resetCart: () => void;
  updateItemVariant: (itemKey: string, variant: CartVariant) => void;
  getItemCount: (itemKey: string) => number;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) =>
        set((state) => {
          const itemKey = `${product._id}-${variant._key}`;
          const existing = state.items.find((i) => i.itemKey === itemKey);

          const stock = variant.availableStock ?? 0;
          const requestedQuantity = existing ? existing.quantity + quantity : quantity;
          
          if (requestedQuantity > stock) {
            toast.error("Cannot add more than available stock");
            return state;
          }

          if (existing) {
            toast.success(`${product.name} quantity updated!`);
            return {
              items: state.items.map((i) =>
                i.itemKey === itemKey
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          } else {
            toast.success(`${product.name} (${variant.name ?? "default"}) added!`);
            return {
              items: [...state.items, { product, variant, itemKey, quantity }],
            };
          }
        }),

      increaseQuantity: (itemKey) =>
        set((state) => {
          const item = state.items.find((i) => i.itemKey === itemKey);
          if (!item) return state;

          // This line will now work correctly without errors
          const isFabric = item.product.category?.slug === 'fabrics';
          const increment = isFabric ? 0.5 : 1;

          const stock = item.variant.availableStock ?? 0;
          if (item.quantity + increment <= stock) {
            return {
              items: state.items.map((i) =>
                i.itemKey === itemKey
                  ? { ...i, quantity: i.quantity + increment }
                  : i
              ),
            };
          } else {
            toast.error("Cannot add more than available stock");
            return state;
          }
        }),

      decreaseQuantity: (itemKey) =>
        set((state) => {
          const item = state.items.find((i) => i.itemKey === itemKey);
          if (!item) return state;

          // This line will now work correctly without errors
          const isFabric = item.product.category?.slug === 'fabrics';
          const decrement = isFabric ? 0.5 : 1;
          const newQuantity = item.quantity - decrement;

          return {
            items: state.items
              .map((i) =>
                i.itemKey === itemKey ? { ...i, quantity: newQuantity } : i
              )
              .filter((i) => i.quantity > 0), 
          };
        }),

      deleteCartProduct: (itemKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemKey !== itemKey),
        })),

      resetCart: () => set({ items: [] }),

      updateItemVariant: (itemKey, variant) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.itemKey === itemKey ? { ...i, variant: { ...variant } } : i
          ),
        })),

      getItemCount: (itemKey: string) => {
        const item = get().items.find((i) => i.itemKey === itemKey);
        return item ? item.quantity : 0;
      },
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;