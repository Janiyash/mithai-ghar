import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import products from "./data/products.js";

const seedProducts = async () => {
  try {
    const ref = collection(db, "products");

    for (const product of products) {
      await addDoc(ref, product);
      console.log("Added:", product.name);
    }

    console.log("✅ All products added successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
};

seedProducts();
