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
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>

          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)}>
              Admin Panel
            </Link>
          )}

          <Link to="/cart" onClick={() => setOpen(false)}>
            🧺 Cart
          </Link>

          {!user ? (
            <Link to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
