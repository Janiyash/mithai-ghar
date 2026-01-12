import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();
  const cartContext = useCart();
  const { user } = useAuth();

  // SAFETY CHECK
  if (!cartContext) {
    return <p className="p-6">Cart not available</p>;
  }

  // 🔐 USER NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff7ed]">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-3xl">
            🛍️
          </div>

          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your cart
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-full text-white font-semibold
                       bg-gradient-to-r from-yellow-400 to-orange-500
                       hover:opacity-90 transition"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const { cart, increaseQty, decreaseQty, removeFromCart } = cartContext;

  // EMPTY CART
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl text-gray-600">Your cart is empty 🛒</h2>
      </div>
    );
  }

  // TOTAL PRICE
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (item) => {
    removeFromCart(item.id);

    toast.error("Item removed from cart", {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {/* CART ITEMS */}
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between"
          >
            {/* LEFT */}
            <div className="flex items-center gap-5">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="font-bold text-orange-500 text-lg">
                ₹{item.price * item.quantity}
              </p>

              <button
                onClick={() => handleRemove(item)}
                className="text-red-500 text-sm mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL + CHECKOUT */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Total</h2>
          <span className="text-xl font-bold text-orange-500">₹{total}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full py-3 rounded-full text-white font-semibold
                     bg-gradient-to-r from-yellow-400 to-orange-500
                     hover:opacity-90 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
