import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plate: { type: String, required: true },
  model: { type: String, required: true },
  maintenance: { type: String, required: true },
  timeIn: { type: Date, default: Date.now },
  timeOut: { type: Date },
  status: {
    type: String,
    enum: ["in-progress", "done"],
    default: "in-progress",
  },
  notes: [noteSchema],
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
