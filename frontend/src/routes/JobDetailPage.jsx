import { useParams, useNavigate } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";
import { useState, useEffect } from "react";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchJobs = useJobStore((s) => s.fetchJobs);
  const markDone = useJobStore((s) => s.markDone);
  const updateNotes = useJobStore((s) => s.updateNotes);

  const [job, setJob] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure jobs are loaded and set this job
    const load = async () => {
      await fetchJobs();
      const found = useJobStore
        .getState()
        .jobs.find((j) => j._id === id || j.id === id);
      setJob(found || null);
    };
    load();
  }, [fetchJobs, id]);

  if (job === null) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500">Job not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-emerald-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatTime = (timestamp) => new Date(timestamp).toLocaleString("en-GB");

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    try {
      await updateNotes(job._id || job.id, newNote);
      // Refresh local job
      await fetchJobs();
      const updated = useJobStore
        .getState()
        .jobs.find((j) => j._id === id || j.id === id);
      setJob(updated);
      setNewNote("");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async () => {
    setLoading(true);
    try {
      await markDone(job._id || job.id);
      await fetchJobs();
      const updated = useJobStore
        .getState()
        .jobs.find((j) => j._id === id || j.id === id);
      setJob(updated);
    } catch (error) {
      console.error("Error marking done:", error);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-gray-50 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">Job Details</h2>
        {job.status !== "done" && (
          <button
            onClick={handleMarkDone}
            disabled={loading}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Mark Done"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 mb-8">
        <div className="space-y-2">
          <p>
            <strong>Plate:</strong> {job.plate}
          </p>
          <p>
            <strong>Model:</strong> {job.model}
          </p>
          <p>
            <strong>Requested Maintenance:</strong> {job.maintenance}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`capitalize ${
                job.status === "done" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {job.status}
            </span>
          </p>
          <p>
            <strong>Time In:</strong> {formatTime(job.timeIn)}
          </p>
          {job.timeOut && (
            <p>
              <strong>Time Out:</strong> {formatTime(job.timeOut)}
            </p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Add Maintenance Note
        </h3>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          placeholder="e.g. Replaced oil filter and checked brakes..."
        />
        <button
          onClick={handleSaveNote}
          disabled={loading}
          className={`mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </div>

      {job.notes?.length > 0 && (
        <div className="">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Maintenance History
          </h3>
          <ul className="space-y-3">
            {job.notes.map((note, idx) => (
              <li
                key={idx}
                className="bg-white p-4 rounded-lg border-l-4 border-emerald-500 whitespace-pre-wrap break-words shadow"
              >
                <p className="text-sm text-gray-600 mb-1">
                  {formatTime(note.timestamp)}
                </p>
                <p className="text-gray-800">{note.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
