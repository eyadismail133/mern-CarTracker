import { create } from "zustand";
import axios from "axios";

const API_BASE =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const useJobStore = create((set) => ({
  jobs: [],
  fetchJobs: async (status) => {
    try {
      const url = status
        ? `${API_BASE}/jobs?status=${status}`
        : `${API_BASE}/jobs`;
      const response = await axios.get(url);
      set({ jobs: response.data });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  },

  addJob: async ({ plate, model, maintenance }) => {
    try {
      const response = await axios.post(`${API_BASE}/jobs`, {
        plate,
        model,
        maintenance,
      });
      set((state) => ({ jobs: [response.data, ...state.jobs] }));
    } catch (error) {
      console.error("Error adding job:", error);
    }
  },

  markDone: async (id) => {
    try {
      const response = await axios.patch(`${API_BASE}/jobs/${id}`, {
        status: "done",
      });
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? response.data : job)),
      }));
    } catch (error) {
      console.error("Error marking job done:", error);
    }
  },

  updateNotes: async (id, noteContent) => {
    try {
      const response = await axios.patch(`${API_BASE}/jobs/${id}`, {
        note: noteContent,
      });
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? response.data : job)),
      }));
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  },

  deleteJob: async (id) => {
    await axios.delete(`${API_BASE}/jobs/${id}`);
    set((s) => ({
      jobs: s.jobs.filter((j) => j._id !== id),
    }));
  },
}));
