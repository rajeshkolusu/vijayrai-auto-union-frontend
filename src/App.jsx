import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Drivers from "./pages/Drivers";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";

import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApprove from "./pages/AdminApprove";

import DriverProfile from "./pages/DriverProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public ---------- */}
        
        <Route path="/" element={<Home />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateProfile />} />

        {/* ---------- Admin ---------- */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/approve"
          element={
            <AdminProtectedRoute>
              <AdminApprove />
            </AdminProtectedRoute>
          }
        />

        {/* ---------- Driver ---------- */}
        <Route path="/driver/profile" element={<DriverProfile />} />
      </Routes>

      {/* 🔔 Toast Notifications (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
