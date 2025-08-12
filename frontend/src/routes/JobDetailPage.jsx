import { useParams, useNavigate, Link } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";
import { useState, useEffect } from "react";
import SpinnerPage from "../components/SpinnerPage";
import Spinner from "../components/Spinner";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchJobs = useJobStore((s) => s.fetchJobs);
  const markDone = useJobStore((s) => s.markDone);
  const updateNotes = useJobStore((s) => s.updateNotes);
  const editNote = useJobStore((s) => s.editNote);

  const [job, setJob] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      try {
        await fetchJobs();
        const found = useJobStore
          .getState()
          .jobs.find((j) => j._id === id || j.id === id);
        setJob(found || null);
      } catch (error) {
        console.error("Error loading job:", error);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [fetchJobs, id]);

  if (pageLoading) return <SpinnerPage />;

  if (!job)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Job not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-emerald-400 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const formatTime = (timestamp) => new Date(timestamp).toLocaleString("en-GB");

  const refreshJob = async () => {
    await fetchJobs();
    const updated = useJobStore
      .getState()
      .jobs.find((j) => j._id === id || j.id === id);
    setJob(updated);
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    setLoadingKey("saveNote");
    try {
      await updateNotes(job._id || job.id, newNote);
      await refreshJob();
      setNewNote("");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleMarkDone = async () => {
    setLoadingKey("markDone");
    try {
      await markDone(job._id || job.id);
      await refreshJob();
    } catch (error) {
      console.error("Error marking done:", error);
      alert("Failed to update status.");
    } finally {
      setLoadingKey(null);
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id || note._id);
    setEditedContent(note.content);
  };

  const handleEditSave = async () => {
    if (!editedContent.trim()) return;
    const key = `edit_${editingNoteId}`;
    setLoadingKey(key);
    try {
      await editNote(job._id || job.id, editingNoteId, editedContent);
      await refreshJob();
      setEditingNoteId(null);
      setEditedContent("");
    } catch (error) {
      console.error("Error editing note:", error);
      alert("Failed to edit note.");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-start justify-center h-full w-full overflow-auto">
        <div className="w-full max-w-5xl mx-auto mt-20 px-8 py-12 bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Job Details</h2>
            {job.status !== "done" && (
              <button
                onClick={handleMarkDone}
                disabled={loadingKey === "markDone"}
                className={`bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition ${
                  loadingKey === "markDone"
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {loadingKey === "markDone" ? <Spinner /> : "Mark Done"}
              </button>
            )}
          </div>

          {/* Job Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-200 mb-10">
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
                    job.status === "done" ? "text-teal-400" : "text-yellow-400"
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

          {/* Add Note */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Add Maintenance Note
            </h3>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full bg-gray-800 bg-opacity-60 border border-gray-700 rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"
              placeholder="e.g. Replaced oil filter and checked brakes..."
            />
            <button
              onClick={handleSaveNote}
              disabled={loadingKey === "saveNote"}
              className={`mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition ${
                loadingKey === "saveNote" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingKey === "saveNote" ? <Spinner /> : "Add Note"}
            </button>
          </div>

          {/* Maintenance History */}
          {job.notes?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Maintenance History
              </h3>
              <ul className="space-y-4">
                {job.notes.map((note) => {
                  const noteId = note.id || note._id;
                  const editKey = `edit_${noteId}`;
                  const isEditing = editingNoteId === noteId;
                  return (
                    <li
                      key={noteId}
                      className="bg-gray-800 bg-opacity-60 p-5 rounded-lg	border-l-4 border-emerald-400 shadow transition"
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-2">
                            {formatTime(note.timestamp)}
                          </p>
                          {isEditing ? (
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full bg-gray-800 bg-opacity-60	border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                              rows={4}
                            />
                          ) : (
                            <p className="text-gray-200 whitespace-pre-wrap break-words">
                              {note.content}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0 space-y-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleEditSave}
                                disabled={loadingKey === editKey}
                                className="text-white bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-xl text-sm transition"
                              >
                                {loadingKey === editKey ? <Spinner /> : "Save"}
                              </button>
                              <button
                                onClick={() => setEditingNoteId(null)}
                                disabled={loadingKey === editKey}
                                className="text-gray-400 hover:underline text-sm transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEditing(note)}
                              className="text-emerald-400 hover:underline text-sm transition"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
