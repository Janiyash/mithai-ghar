import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚫 NOT LOGGED IN
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] px-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-2xl">
              📦
            </div>

            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your orders
            </p>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-full text-white font-semibold
                         bg-gradient-to-r from-yellow-400 to-orange-500"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // 🔥 FETCH ORDERS
  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const list = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        list.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });

        if (mounted) setOrders(list);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => (mounted = false);
  }, [user]);

  // 🎨 STATUS STYLE MAP (SMALL + ONE LINE)
  const statusStyles = {
    placed: "bg-orange-100 text-orange-600",
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-600",
    completed: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#fffaf3] py-12 px-6">
        <div className="max-w-5xl mx-auto">

          <h1 className="text-3xl font-serif text-center mb-10">
            My <span className="text-orange-500">Orders</span>
          </h1>

          {/* LOADING */}
          {loading && (
            <div className="text-center text-gray-600">
              Loading your orders...
            </div>
          )}

          {/* NO ORDERS */}
          {!loading && orders.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">
              <p className="text-gray-600 mb-4">
                You haven’t placed any orders yet 🛒
              </p>

              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 rounded-full text-white font-semibold
                           bg-gradient-to-r from-yellow-400 to-orange-500"
              >
                Browse Products
              </button>
            </div>
          )}

          {/* ORDERS LIST */}
          <div className="space-y-8">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">{order.id}</p>
                  </div>

                  {/* ✅ SMALL ONE-LINE STATUS */}
                  <span
                    className={`
                      inline-flex items-center
                      px-3 py-1
                      rounded-full
                      text-xs font-semibold
                      whitespace-nowrap
                      ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}
                    `}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="border-t pt-4 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
