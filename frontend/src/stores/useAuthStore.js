import { create } from "zustand";
import axios from "axios";

const API_BASE =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signup: async ({ name, email, password }) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_BASE}/auth/signup`, {
        name,
        email,
        password,
      });
      // Do NOT fetch user after signup; user will be fetched after login only
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      // After login, fetch user info
      await get().fetchUser();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_BASE}/auth/me`);
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_BASE}/auth/logout`);
      set({ user: null, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));

// On app load, fetch user info to restore session
if (typeof window !== "undefined") {
  const store = useAuthStore.getState();
  store.fetchUser();
}
