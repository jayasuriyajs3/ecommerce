import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" || !!sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (!isLoggedIn) {
    // Store the current path to redirect back after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
