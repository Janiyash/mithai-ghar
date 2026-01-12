import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const cartContext = useCart();
  const authContext = useAuth();

  // 🛑 HARD SAFETY (prevents blank page)
  if (!product || !cartContext || !authContext) {
    return null;
  }

  const { addToCart } = cartContext;
  const { user } = authContext;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first to order 🛒", {
        iconTheme: {
          primary: "#f97316",
          secondary: "#fff",
        },
      });
      return;
    }

    addToCart(product);
  };

  return (
    <div
      className="
        bg-white rounded-2xl shadow-md p-6
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]
      "
    >
      <img
        src={product.image}
        alt={product.name}
        className="
          w-full h-44 object-cover rounded-xl mb-4
          transition-transform duration-300
          hover:scale-105
        "
      />

      <h3 className="font-semibold text-lg">{product.name}</h3>

      <p className="text-orange-500 font-bold mt-1 text-lg">
        ₹{product.price}
      </p>

      {/* ✅ WEIGHT */}
      <p className="text-sm text-gray-500 mt-1">
        Weight:{" "}
        <span className="font-medium">
          {product.weight ? `${product.weight} g` : "—"}
        </span>
      </p>

      <button
        onClick={handleAddToCart}
        className="
          mt-5 w-full py-2.5 rounded-full
          bg-gradient-to-r from-yellow-400 to-orange-500
          text-white font-semibold
          hover:opacity-90 transition
        "
      >
        Add to Cart
      </button>
    </div>
  );
}
