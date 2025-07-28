import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to CarTracker
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          A smart solution to track car maintenance in real-time — manage
          entries, job details, and histories efficiently.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/add"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            Add New Car
          </Link>
          <Link
            to="/jobs"
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            View Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-emerald-400">
            Live Job Tracking
          </h3>
          <p className="text-sm text-gray-300">
            Instantly track all cars in the garage with assigned services and
            timestamps.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-emerald-400">
            Detailed Records
          </h3>
          <p className="text-sm text-gray-300">
            Record model, plate, requested services, time of entry, and detailed
            notes.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-emerald-400">
            Fast Workflow
          </h3>
          <p className="text-sm text-gray-300">
            Designed for speed, efficiency, and clarity. No clutter, just
            performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
