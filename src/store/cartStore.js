// src/store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [], // Estado inicial del carrito

      // Añadir un producto al carrito
      addToCart: (item) => {
        const existingItem = get().cartItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          // Si el producto ya está en el carrito, incrementa la cantidad
          set((state) => ({
            cartItems: state.cartItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          }));
        } else {
          // Si no está en el carrito, añádelo con cantidad 1
          set((state) => ({
            cartItems: [...state.cartItems, { ...item, quantity: 1 }],
          }));
        }
      },

      // Eliminar un producto del carrito
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((cartItem) => cartItem.id !== id),
        })),

      // Limpiar el carrito
      clearCart: () => set({ cartItems: [] }),

      // Obtener el total de productos en el carrito
      getCartTotal: () =>
        get().cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
    }),
    {
      name: "cart-storage", // Nombre del almacenamiento en localStorage
    }
  )
);

export default useCartStore;
