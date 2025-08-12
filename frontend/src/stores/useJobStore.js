import { create } from "zustand";
import axios from "axios";

const API_BASE =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api";

axios.defaults.withCredentials = true;

export const useJobStore = create((set) => ({
  jobs: [],

  fetchJobs: async (status) => {
    try {
      const url = status
        ? `${API_BASE}/jobs?status=${status}`
        : `${API_BASE}/jobs`;
      const { data } = await axios.get(url);
      set({ jobs: data });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  },

  addJob: async ({ plate, model, maintenance }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/jobs`, {
        plate,
        model,
        maintenance,
      });
      // prepend the new job
      set((state) => ({ jobs: [data, ...state.jobs] }));
    } catch (error) {
      console.error("Error adding job:", error);
    }
  },

  markDone: async (_id) => {
    try {
      const { data } = await axios.patch(`${API_BASE}/jobs/${_id}`, {
        status: "done",
      });
      set((state) => ({
        jobs: state.jobs.map((job) => (job._id === _id ? data : job)),
      }));
    } catch (error) {
      console.error("Error marking job done:", error);
    }
  },

  updateNotes: async (_id, noteContent) => {
    try {
      // our backend returns the full updated job
      const { data } = await axios.patch(`${API_BASE}/jobs/${_id}`, {
        note: noteContent,
      });
      set((state) => ({
        jobs: state.jobs.map((job) => (job._id === _id ? data : job)),
      }));
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  },

  deleteJob: async (_id) => {
    try {
      await axios.delete(`${API_BASE}/jobs/${_id}`);
      set((s) => ({
        jobs: s.jobs.filter((j) => j._id !== _id),
      }));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  },

  editNote: async (jobId, noteId, newContent) => {
    try {
      // returns the updated note
      const { data: updatedNote } = await axios.patch(
        `${API_BASE}/jobs/${jobId}/notes/${noteId}`,
        { content: newContent }
      );

      set((state) => ({
        jobs: state.jobs.map((job) => {
          if (job._id !== jobId) return job;
          return {
            ...job,
            notes: job.notes.map((n) => (n._id === noteId ? updatedNote : n)),
          };
        }),
      }));
    } catch (error) {
      console.error("Error editing note:", error);
    }
  },
}));
