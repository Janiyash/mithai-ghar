import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const cartContext = useCart();
  const authContext = useAuth();

  if (!product || !cartContext || !authContext) return null;

  const { addToCart } = cartContext;
  const { user } = authContext;

  const outOfStock = product.quantity === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first to order 🛒");
      return;
    }

    if (outOfStock) return;

    addToCart(product);
    toast.success("Added to cart 🛒");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]">
      <img src={product.image} alt={product.name} className="w-full h-44 object-cover rounded-xl mb-4" />

      <h3 className="font-semibold text-lg">{product.name}</h3>

      <p className="text-orange-500 font-bold mt-1 text-lg">₹{product.price}</p>

      <p className="text-sm text-gray-500 mt-1">
        Weight: <span className="font-medium">{product.weight} g</span>
      </p>

      {outOfStock && (
        <p className="mt-2 text-sm font-semibold text-red-500">
          Currently unavailable
        </p>
      )}

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className={`mt-5 w-full py-2.5 rounded-full font-semibold transition
          ${outOfStock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90"
          }`}
      >
        {outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
