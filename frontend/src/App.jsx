import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./routes/HomePage";
import JobsPage from "./routes/JobsPage";
import AddCarPage from "./routes/AddCarPage";
import JobDetailPage from "./routes/JobDetailPage";
import NotFoundPage from "./routes/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/add" element={<AddCarPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
