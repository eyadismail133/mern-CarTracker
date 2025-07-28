import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";

const AddCarPage = () => {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [loading, setLoading] = useState(false);

  const addJob = useJobStore((state) => state.addJob);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plate.trim() || !model.trim() || !maintenance.trim()) {
      return alert("Please fill in all fields.");
    }

    setLoading(true);
    try {
      await addJob({ plate, model, maintenance });
      // Refresh list
      await fetchJobs();
      // Reset form
      setPlate("");
      setModel("");
      setMaintenance("");
      // Navigate to jobs page
      navigate("/jobs");
    } catch (error) {
      console.error("Failed to add job:", error);
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-emerald-700">Add New Car</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Plate Number
          </label>
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="e.g. ABC-1234"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Car Model
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="e.g. Toyota Corolla"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Maintenance Needed
          </label>
          <textarea
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            placeholder="Describe the required service..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCarPage;
