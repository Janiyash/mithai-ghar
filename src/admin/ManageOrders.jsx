import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const snap = await getDocs(collection(db, "orders"));

      const formattedOrders = snap.docs.map(o => {
        const data = o.data();

        // ✅ keep items as array (not string)
        const items = Array.isArray(data.items) ? data.items : [];

        // Date & time
        let dateTime = "—";
        if (data.createdAt?.toDate) {
          dateTime = data.createdAt
            .toDate()
            .toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });
        }

        return {
          id: o.id,
          items,
          userName: data.delivery?.name || "—",
          userPhone: data.delivery?.phone || "—",
          dateTime,
          total: data.total || 0,
          status: data.status || "placed",
        };
      });

      setOrders(formattedOrders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading orders...
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary">
        Manage Orders
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-primary text-black">
            <tr>
              <th className="px-2 py-2 text-left">Items</th>
              <th className="px-2 py-2 text-left">User</th>
              <th className="px-2 py-2 text-left">Phone</th>
              <th className="px-2 py-2 text-left">Date & Time</th>
              <th className="px-2 py-2 text-center">Total</th>
              <th className="px-2 py-2 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t align-top">
                {/* ✅ ITEMS IN NEW ROWS */}
                <td className="p-3 text-m text-gray-700">
                  {order.items.length > 0 ? (
                    <ul className="space-y-1">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.name}
                          {item.quantity && (
                            <span className="text-gray-500">
                              {" "}×{item.quantity}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="p-3">{order.userName}</td>
                <td className="p-3">{order.userPhone}</td>
                <td className="p-3 text-sm text-gray-600">
                  {order.dateTime}
                </td>
                <td className="p-3 text-center">
                  ₹{order.total}
                </td>
                <td className="p-3 text-center">
                  <select
                    value={order.status}
                    onChange={e =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="placed">Placed</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
