import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuthStore } from "../stores/useAuthStore";

const JobsPage = () => {
  const jobs = useJobStore((s) => s.jobs);
  const fetchJobs = useJobStore((s) => s.fetchJobs);
  const markDone = useJobStore((s) => s.markDone);
  const deleteJob = useJobStore((s) => s.deleteJob);
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [jobToModify, setJobToModify] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const formatTime = (ts) => new Date(ts).toLocaleString("en-GB");

  // Filter jobs by search term
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.plate.toLowerCase().includes(term) ||
      job.model.toLowerCase().includes(term)
    );
  });

  // Sort so that "done" status appears first
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return -1;
    if (b.status === "done" && a.status !== "done") return 1;
    return 0;
  });

  const handleConfirm = async () => {
    if (confirmAction === "done") {
      await markDone(jobToModify._id || jobToModify.id);
    } else if (confirmAction === "delete") {
      await deleteJob(jobToModify._id || jobToModify.id);
    }
    setConfirmAction(null);
    setJobToModify(null);
    fetchJobs();
  };

  const handleCancel = () => {
    setConfirmAction(null);
    setJobToModify(null);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Define headers & rows based on sorted jobs
    const head = [["No", "Plate", "Model", "Maintenance", "Time In", "Status"]];
    const body = sortedJobs.map((job, index) => [
      index + 1,
      job.plate,
      job.model,
      job.maintenance,
      formatTime(job.timeIn),
      job.status,
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.setFontSize(16);
    doc.text("Current Jobs", doc.internal.pageSize.getWidth() / 2, 12, {
      align: "center",
    });
    doc.save("jobs_table.pdf");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-start justify-center h-full w-full overflow-auto">
        <div
          className={`max-w-6xl mx-auto mt-20 px-6 py-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl transition-all ${
            confirmAction ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Current Jobs</h2>
            <button
              onClick={handleDownloadPDF}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
            >
              Download PDF
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plate or model..."
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl shadow-2xl bg-gray-900 bg-opacity-30 backdrop-blur-md">
            <table
              id="jobs-table"
              className="min-w-full table-auto divide-y divide-gray-700"
            >
              <thead className="sticky top-0 bg-gray-800">
                <tr>
                  {["No.", "Plate", "Model", "Maintenance", "Time In", "Status"]
                    .concat(role === "admin" ? ["Actions"] : [])
                    .map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedJobs.map((job, index) => (
                  <tr
                    key={job._id || job.id}
                    className={`transition-all ${
                      job.status === "done"
                        ? "bg-gray-600 bg-opacity-30"
                        : "bg-white/5"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">{job.plate}</td>
                    <td className="px-6 py-4 text-sm">{job.model}</td>
                    <td className="px-6 py-4 text-sm">{job.maintenance}</td>
                    <td className="px-6 py-4 text-sm">
                      {formatTime(job.timeIn)}
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {job.status}
                    </td>
                    {role === "admin" && (
                      <td className="px-6 py-4 space-x-2 text-sm">
                        {/* Only admin can mark done or delete */}
                        {job.status !== "done" && (
                          <button
                            onClick={() => {
                              setConfirmAction("done");
                              setJobToModify(job);
                            }}
                            className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-full transition"
                          >
                            Mark Done
                          </button>
                        )}
                        <Link
                          to={`/jobs/${job._id || job.id}`}
                          className="text-emerald-300 hover:text-emerald-100 transition"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            setConfirmAction("delete");
                            setJobToModify(job);
                          }}
                          className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {confirmAction === "done"
                  ? "Are you sure you want to mark this job as done?"
                  : "Are you sure you want to delete this job?"}
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-white rounded ${
                    confirmAction === "done"
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-red-600 hover:bg-red-700"
                  } transition`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
