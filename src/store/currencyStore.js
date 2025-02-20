import { create } from "zustand";

const useCurrencyStore = create((set) => {
  let initialCurrency = "EUR"; // Valor predeterminado
  if (typeof window !== "undefined") {
    initialCurrency = localStorage.getItem("currency") || "EUR";
  }

  return {
    currency: initialCurrency,
    setCurrency: (newCurrency) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("currency", newCurrency);
      }
      set({ currency: newCurrency });
    },
  };
});

export default useCurrencyStore;
