import { create } from "zustand";
import { getMe } from "@/shared/api/services";
import type { Me } from "@/shared/api/types";

interface UserState {
  user: Me | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: Me) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const me = await getMe();
      set({ user: me, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "خطا در دریافت اطلاعات کاربر",
        loading: false,
      });
    }
  },

  setUser: (user) => set({ user }),
}));
