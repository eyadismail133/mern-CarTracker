import express from "express";
import Job from "../models/Job.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Create a new Job (admin only)
router.post("/", authorizeRoles("admin"), async (req, res) => {
  try {
    let userId = req.userId;
    if (req.user.role === "admin" && req.body.user) {
      userId = req.body.user;
    }
    const job = new Job({
      user: userId,
      plate: req.body.plate,
      model: req.body.model,
      maintenance: req.body.maintenance,
    });
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all jobs for the authenticated user
router.get("/", authorizeRoles("admin", "employee"), async (req, res) => {
  try {
    let jobs;
    if (req.user.role === "admin") {
      jobs = await Job.find().sort({ timeIn: -1 });
    } else if (req.user.role === "employee") {
      // Only show jobs created by admin
      const adminUsers = await import("../models/user.model.js").then((m) =>
        m.default.find({ role: "admin" })
      );
      const adminIds = adminUsers.map((u) => u._id);
      jobs = await Job.find({ user: { $in: adminIds } }).sort({ timeIn: -1 });
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single job by ID (admin only)
router.get("/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    let job;
    if (req.user.role === "admin") {
      job = await Job.findById(req.params.id);
    }
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job status or add a note (admin only)
router.patch("/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    let job;
    if (req.user.role === "admin") {
      job = await Job.findById(req.params.id);
    }
    if (!job) return res.status(404).json({ message: "Job not found" });
    const { status, note } = req.body;
    if (status === "done") {
      job.status = "done";
      job.timeOut = Date.now();
    }
    if (note) {
      job.notes.push({ content: note });
    }
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a job (admin only)
router.delete("/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    let deleted;
    if (req.user.role === "admin") {
      deleted = await Job.findByIdAndDelete(req.params.id);
    }
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific note on a job (admin only)
router.patch(
  "/:jobId/notes/:noteId",
  authorizeRoles("admin"),
  async (req, res) => {
    const { jobId, noteId } = req.params;
    const { content } = req.body;
    try {
      let job;
      if (req.user.role === "admin") {
        job = await Job.findById(jobId);
      }
      if (!job) return res.status(404).json({ message: "Job not found" });
      const note = job.notes.id(noteId);
      if (!note) return res.status(404).json({ message: "Note not found" });
      note.content = content;
      note.timestamp = Date.now();
      await job.save();
      res.json(note);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
