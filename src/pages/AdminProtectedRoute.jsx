import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("adminToken");

  if (role !== "admin" || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
