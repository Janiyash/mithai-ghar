import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]); // ✅ NEW
  const [activeCategory, setActiveCategory] = useState("all"); // ✅ NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const list = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (mounted) setProducts(list);
      } catch (err) {
        console.error(err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchCategories = async () => {
      const snap = await getDocs(collection(db, "categories"));
      setCategories(snap.docs.map(d => d.data()));
    };

    fetchProducts();
    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading products...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No products found
      </div>
    );
  }

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#fffaf3] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-serif text-center mb-6">
          Our <span className="text-orange-500">Products</span>
        </h1>

        {/* ✅ CATEGORY PILLS */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition
              ${activeCategory === "all"
                ? "bg-red-500 text-white border-red-500"
                : "border-red-300 text-red-500 hover:bg-red-50"
              }`}
          >
            All
          </button>

          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setActiveCategory(c.slug)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition
                ${activeCategory === c.slug
                  ? "bg-red-500 text-white border-red-500"
                  : "border-red-300 text-red-500 hover:bg-red-50"
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

      </div>
    </div>
  );
}
