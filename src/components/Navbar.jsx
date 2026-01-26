import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const auth = useAuth();               // ✅ SAFE ACCESS
  const user = auth?.user;
  const role = auth?.role;
  const logout = auth?.logout;
  const loading = auth?.loading;

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isAdmin = role === "admin";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b sticky top-0 z-50 w-full">
      <div className="w-full px-4 md:px-12 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            M
          </div>
          <span className="text-xl font-brand">
            Mithai<span className="text-primary">Ghar</span>
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-600">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full bg-black text-white text-sm"
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/cart"
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold"
          >
            🧺 Cart
          </Link>

          {!loading && !user && (
            <Link
              to="/login"
              className="bg-primary text-white px-5 py-2 rounded-full text-sm"
            >
              Login
            </Link>
          )}

          {!loading && user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold"
              >
                {user.email?.[0]?.toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1c1c1c] text-white rounded-xl shadow-xl">
                  <div className="px-4 py-3 border-b border-gray-700 text-sm">
                    {user.email}
                  </div>

                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
{/* MOBILE MENU */}
{open && (
  <div className="md:hidden bg-white border-t px-6 py-6 space-y-6 text-sm">

    {/* NAVIGATION */}
    <div className="space-y-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        Navigation
      </p>

      {["Home", "Products", "About", "Contact"].map((item) => (
        <Link
          key={item}
          to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
          onClick={() => setOpen(false)}
          className="block text-gray-700 font-medium hover:text-primary transition"
        >
          {item}
        </Link>
      ))}
    </div>

    {/* ACTIONS */}
    {/* ACTIONS */}
    <div className="space-y-4 pt-4 border-t">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        Actions
      </p>
        
      {/* Cart Button (same as desktop) */}
      <Link
        to="/cart"
        onClick={() => setOpen(false)}
        className="
          inline-flex items-center gap-2
          px-5 py-2 rounded-full
          border border-gray-300
          text-sm font-semibold text-gray-800
          hover:bg-gray-100 transition
        "
      >
        🧺 Cart
      </Link>
        
      {/* Admin Panel Button (same as desktop) */}
      {isAdmin && (
        <Link
          to="/admin"
          onClick={() => setOpen(false)}
          className="
            inline-flex items-center justify-center
            px-5 py-2 rounded-full
            bg-black text-white
            text-sm font-semibold
            hover:bg-gray-900 transition
          "
        >
          Admin Panel
        </Link>
      )}
    </div>

    {/* ACCOUNT */}
    <div className="pt-4 border-t">
      {!user ? (
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className="block font-semibold text-primary"
        >
          Login
        </Link>
      ) : (
        <button
          onClick={() => {
            logout();
            setOpen(false);
          }}
          className="block w-full text-left font-semibold text-red-500 hover:text-red-600 transition"
        >
          Logout
        </button>

          )}
        </div>
      </div>
    )}
    </header>
  );
}
