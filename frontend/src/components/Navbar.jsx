import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        CarTracker
      </Link>
      <div className="space-x-10">
        <NavLink to="/" className="hover:text-emerald-400">
          Home
        </NavLink>
        <NavLink to="/jobs" className="hover:text-emerald-400">
          Jobs
        </NavLink>
        <NavLink to="/add" className="hover:text-emerald-400">
          Add Car
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
