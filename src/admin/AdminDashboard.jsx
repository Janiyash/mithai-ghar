import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    earnings: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // USERS
      const usersSnap = await getDocs(collection(db, "users"));

      // PRODUCTS
      const productsSnap = await getDocs(collection(db, "products"));

      // ORDERS
      const ordersSnap = await getDocs(collection(db, "orders"));
      let totalEarnings = 0;

      ordersSnap.docs.forEach(doc => {
        const data = doc.data();
        totalEarnings += Number(data.total || 0);
      });

      setStats({
        users: usersSnap.size,
        products: productsSnap.size,
        orders: ordersSnap.size,
        earnings: totalEarnings,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-orange-500">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Earnings"
          value={`₹${stats.earnings}`}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, color }) {
  const iconMap = {
    "Total Users": "U",
    "Total Products": "P",
    "Total Orders": "O",
    "Total Earnings": "E",
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      <div className="p-6 flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}
        >
          <span className="text-xl font-bold">
            {iconMap[title]}
          </span>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}
