import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden 
                    hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name || "Product"}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">
          {product.name || "Unnamed"}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.description || "Fresh & delicious"}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-orange-500 font-bold">
            ₹{product.price || 0}
          </span>

          <button
            onClick={() => {
              addToCart(product);
              toast.success("Added to cart");
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
