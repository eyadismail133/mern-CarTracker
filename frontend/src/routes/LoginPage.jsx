import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      toast.success("Login successful!");
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email: form.email, password: form.password });
    } catch {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-start justify-center h-full w-full overflow-auto">
        <div className="w-full max-w-md mx-auto mt-40 px-6 py-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Login
          </h2>

          {error && (
            <div className="mb-4 text-red-400 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              {
                label: "Email",
                name: "email",
                type: "email",
                value: form.email,
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                value: form.password,
              },
            ].map(({ label, name, type, value }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1 text-gray-200">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 bg-opacity-60 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-full shadow-md transition transform hover:scale-105 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
