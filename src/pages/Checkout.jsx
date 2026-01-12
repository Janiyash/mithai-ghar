import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "emailjs-com";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    time: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.time) {
      alert("Please fill all fields");
      return;
    }

    let docRef;

    try {
      docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        email: user.email,
        items: cart,
        total,
        delivery: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          time: form.time,
        },
        status: "placed",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
      return;
    }

    // 📧 EMAIL (non-blocking)
    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          user_name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          delivery_time: form.time,
          items: cart
            .map(item => `${item.name} x ${item.quantity}`)
            .join("\n"),
          total,
          date: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        "YOUR_PUBLIC_KEY"
      );
    } catch (err) {
      console.error("Email failed:", err);
    }

    // ✅ SHOW SUCCESS FIRST
    setOrderId(docRef.id);
    setShowSuccess(true);
  };

  // ❗ FIX: Only show empty cart screen IF success popup is NOT visible
  if ((!cart || cart.length === 0) && !showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Your cart is empty 🛒</p>
      </div>
    );
  }

  return (
    <>
      {/* MAIN CHECKOUT */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold">Delivery Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            value={form.email}
            disabled
            className="w-full border rounded-lg px-4 py-2 bg-gray-100"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Delivery Time</option>
            <option>Morning (8am – 12pm)</option>
            <option>Afternoon (12pm – 4pm)</option>
            <option>Evening (4pm – 8pm)</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-semibold
                       bg-gradient-to-r from-yellow-400 to-orange-500"
          >
            Place Order
          </button>
        </form>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-3">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-orange-500">₹{total}</span>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl p-10 text-center text-white w-[360px] shadow-xl animate-scale-in">

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white text-red-500 flex items-center justify-center text-3xl">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Purchase Successful!
            </h2>

            <p className="text-sm mb-4">
              Your order has been placed successfully.
            </p>

            <p className="font-semibold mb-6">
              Order ID: <span className="underline">{orderId}</span>
            </p>

            <button
              onClick={() => {
                clearCart();        // ✅ clear ONLY when user clicks
                navigate("/");
              }}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
