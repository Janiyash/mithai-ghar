import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, role, loading } = useAuth();

  // Still checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin verified
  return <Outlet />;
}
