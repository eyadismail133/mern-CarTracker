const AboutPage = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
    <div className="flex items-center justify-center h-full w-full overflow-auto">
      <div className="max-w-3xl mx-auto p-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-6 text-emerald-300">
          About Our System
        </h1>
        <p className="mb-4 text-gray-200">
          Welcome to{" "}
          <span className="font-semibold text-white">CarTracker</span>, your
          all-in-one solution for managing employee records, attendance, and
          vehicle maintenance history.
        </p>
        <p className="mb-4 text-gray-200">
          Designed for service centers and fleet managers, this platform
          streamlines workflows, improves accountability, and offers real-time
          insights into ongoing jobs and completed tasks.
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
          <li>📋 Comprehensive employee profiles and role assignments</li>
          <li>🕒 Daily attendance tracking with history logs</li>
          <li>🔧 Job scheduling, maintenance tracking, and detailed reports</li>
          <li>🔒 Secure authentication and user-specific access control</li>
          <li>🔔 Real-time notifications and status updates</li>
        </ul>
        <p className="text-gray-400 text-sm">
          Built with React, Node.js, Express, and MongoDB, CarTracker offers a
          robust, scalable architecture and a sleek, modern interface to keep
          your operations running smoothly.
        </p>
        <p className="mt-6 text-gray-500 text-xs">
          &copy; 2025 Your Team. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
