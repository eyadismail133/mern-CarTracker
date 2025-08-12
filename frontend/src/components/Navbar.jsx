import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [role, setRole] = useState(user?.role);

  useEffect(() => {
    setRole(user?.role);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-6 py-3 bg-gradient-to-r from-indigo-900 via-gray-900 to-indigo-900 bg-opacity-70 backdrop-blur-sm border-b border-gray-700 shadow-lg z-50 flex items-center justify-between">
      <Link
        to="/"
        className="text-2xl font-semibold tracking-wide text-white hover:text-emerald-300 transition"
      >
        CarTracker
      </Link>

      <div className="flex items-center space-x-4">
        {/* Always visible links */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-emerald-500 text-white"
                : "text-gray-200 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/achievements"
          className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-emerald-500 text-white"
                : "text-gray-200 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Achievements
        </NavLink>
        <NavLink
          to="/vehicles"
          className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-emerald-500 text-white"
                : "text-gray-200 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Our Vehicles
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-emerald-500 text-white"
                : "text-gray-200 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          About
        </NavLink>

        {/* Authenticated user links */}
        {!user ? (
          <>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-2 rounded-md transition ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-200 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-2 rounded-md transition ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-200 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              Login
            </NavLink>
          </>
        ) : (
          <>
            {/* Role-based Links */}
            {role === "admin" && (
              <NavLink
                to="/add"
                className={({ isActive }) =>
                  `text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-gray-200 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                Add Vehicle
              </NavLink>
            )}
            {(role === "admin" || role === "employee") && (
              <>
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    `text-sm font-medium px-4 py-2 rounded-md transition ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : "text-gray-200 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `text-sm font-medium px-4 py-2 rounded-md transition ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : "text-gray-200 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  History
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-gray-200 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                Employees
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
