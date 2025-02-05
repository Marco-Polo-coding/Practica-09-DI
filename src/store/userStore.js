// src/store/userStore.js
import { create } from "zustand";

const useUserStore = create((set) => ({
  email: null,
  purchasedCourses: [], // Lista de IDs de los cursos comprados

  setEmail: (email) => set({ email }),
  setPurchasedCourses: (courses) => set({ purchasedCourses: courses }),
  clearUserData: () => set({ email: null, purchasedCourses: [] }),
}));

export default useUserStore;
