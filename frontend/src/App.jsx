import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./routes/HomePage";
import JobsPage from "./routes/JobsPage";
import AddCarPage from "./routes/AddCarPage";
import JobDetailPage from "./routes/JobDetailPage";
import HistoryPage from "./routes/HistoryPage";
import NotFoundPage from "./routes/NotFoundPage";
import SignUpPage from "./routes/SignupPage";
import LoginPage from "./routes/LoginPage";
import EmployeesPage from "./routes/EmployeesPage";
import AboutPage from "./routes/AboutPage";
import AchievementPage from "./routes/AchievementPage";
import VehiclePage from "./routes/VehiclePage";
import { useAuthStore } from "../src/stores/useAuthStore";
import { Toaster } from "react-hot-toast";

function App() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <BrowserRouter>
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(24, 24, 27, 0.8)",
            color: "white",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          },
        }}
      />

      <div className="px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {role === "admin" || role === "employee" ? (
            <>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </>
          ) : null}
          {role === "admin" && (
            <>
              <Route path="/add" element={<AddCarPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
            </>
          )}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/achievements" element={<AchievementPage />} />
          <Route path="/vehicles" element={<VehiclePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
