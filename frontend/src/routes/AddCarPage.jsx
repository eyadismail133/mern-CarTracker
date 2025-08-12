import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore";
import Spinner from "../components/Spinner";

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
      await fetchJobs();
      setPlate("");
      setModel("");
      setMaintenance("");
      navigate("/jobs");
    } catch (error) {
      console.error("Failed to add job:", error);
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-full max-w-lg mt-12 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-xl p-8 max-h-[85%] overflow-auto border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white tracking-tight text-center drop-shadow-md">
            Add New Vehicle
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              {
                label: "Plate Number",
                value: plate,
                onChange: setPlate,
                placeholder: "e.g. ABC-1234",
              },
              {
                label: "Car Model",
                value: model,
                onChange: setModel,
                placeholder: "e.g. Toyota Corolla",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label}>
                <label className="block text-gray-200 font-semibold mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Maintenance Needed
              </label>
              <textarea
                value={maintenance}
                onChange={(e) => setMaintenance(e.target.value)}
                className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl px-4 py-3 min-h-[120px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                placeholder="Describe the required service..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-full shadow-md transition transform hover:scale-105 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? <Spinner /> : "Add Vehicle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;
