import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";

const JobsPage = () => {
  const jobs = useJobStore((s) => s.jobs);
  const fetchJobs = useJobStore((s) => s.fetchJobs);
  const markDone = useJobStore((s) => s.markDone);
  const deleteJob = useJobStore((s) => s.deleteJob);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const formatTime = (ts) => new Date(ts).toLocaleString("en-GB");

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-6 text-emerald-700">Current Jobs</h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Plate</th>
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-left font-semibold">Maintenance</th>
              <th className="px-4 py-3 text-left font-semibold">Time In</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job._id || job.id}
                className={`border-t ${
                  job.status === "done" ? "bg-green-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3">{job.plate}</td>
                <td className="px-4 py-3">{job.model}</td>
                <td className="px-4 py-3">{job.maintenance}</td>
                <td className="px-4 py-3">{formatTime(job.timeIn)}</td>
                <td className="px-4 py-3 capitalize">{job.status}</td>
                <td className="px-4 py-3 space-x-2">
                  {job.status !== "done" && (
                    <button
                      onClick={async () => {
                        await markDone(job._id || job.id);
                        fetchJobs();
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-xl transition"
                    >
                      Mark Done
                    </button>
                  )}
                  <Link
                    to={`/jobs/${job._id || job.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Details
                  </Link>
                  <button
                    onClick={async () => {
                      await deleteJob(job._id || job.id);
                      fetchJobs();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsPage;
