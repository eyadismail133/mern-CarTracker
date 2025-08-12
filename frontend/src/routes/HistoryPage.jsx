import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";

const HistoryPage = () => {
  const jobs = useJobStore((s) => s.jobs);
  const fetchJobs = useJobStore((s) => s.fetchJobs);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const doneJobs = jobs.filter((job) => job.status === "done");

  const formatTime = (ts) => new Date(ts).toLocaleString("en-GB");

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-start justify-center h-full w-full overflow-auto">
        <div className="max-w-6xl mx-auto mt-20 px-6 py-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Completed Jobs History
          </h2>

          <div className="overflow-x-auto rounded-2xl shadow-2xl bg-gray-900 bg-opacity-30 backdrop-blur-md">
            <table className="min-w-full table-auto divide-y divide-gray-700">
              <thead className="sticky top-0 bg-gray-800">
                <tr>
                  {[
                    "No",
                    "Plate",
                    "Model",
                    "Maintenance",
                    "Time In",
                    "Status",
                  ].map((col) => (
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
                {doneJobs.map((job, index) => (
                  <tr key={job._id || job.id} className="">
                    <td className="px-6 py-4 text-sm text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {job.plate}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {job.model}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {job.maintenance}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {formatTime(job.timeIn)}
                    </td>
                    <td className="px-6 py-4 text-sm capitalize text-white">
                      {job.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
