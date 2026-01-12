import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-black text-white flex flex-col">
        
        {/* LOGO / BRAND */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-primary  text-white flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold">Mithai Ghar</h1>
              <p className="text-xs text-primary">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarLink to="/admin" end label="Dashboard" />
          <SidebarLink to="/admin/users" label="Manage Users" />
          <SidebarLink to="/admin/products" label="Manage Products" />
          <SidebarLink to="/admin/orders" label="Manage Orders" />
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="px-4 py-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-700 py-2 text-sm hover:bg-gray-800 transition"
          >
            ← Back To Site
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

/* ================= SIDEBAR LINK COMPONENT ================= */
function SidebarLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block rounded-lg px-4 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-white text-black"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
