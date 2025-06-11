import { create } from "zustand";

interface UIState {
  isLoading: boolean;
  error: string | null;
  notification: {
    type: "success" | "error" | "info" | "warning" | null;
    message: string | null;
  };
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  showNotification: (
    type: "success" | "error" | "info" | "warning",
    message: string,
  ) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  error: null,
  notification: {
    type: null,
    message: null,
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  showNotification: (type, message) =>
    set({
      notification: {
        type,
        message,
      },
    }),

  clearNotification: () =>
    set({
      notification: {
        type: null,
        message: null,
      },
    }),
}));
