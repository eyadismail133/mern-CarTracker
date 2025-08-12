import { create } from "zustand";
import axios from "axios";

const API_BASE =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export const useEmployeeStore = create((set) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_BASE}/employees`);
      set({ employees: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addEmployee: async (employee) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`${API_BASE}/employees`, employee);
      set((state) => ({
        employees: [data, ...state.employees],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  updateEmployee: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(`${API_BASE}/employees/${id}`, updates);
      set((state) => ({
        employees: state.employees.map((e) => (e._id === id ? data : e)),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE}/employees/${id}`);
      set((state) => ({
        employees: state.employees.filter((e) => e._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addAttendance: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API_BASE}/employees/${id}/attendance`,
        { status }
      );
      set((state) => ({
        employees: state.employees.map((e) => (e._id === id ? data : e)),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchAttendance: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(
        `${API_BASE}/employees/${id}/attendance`
      );
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      return [];
    }
  },
}));
