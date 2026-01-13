import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase";
import toast from "react-hot-toast";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState(""); // ✅ NEW
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editId, setEditId] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setWeight("");
    setQuantity("");
    setImageFile(null);
    setPreview(null);
    setEditId(null);
    setExistingImage(null);
  };

  const saveProduct = async () => {
    if (!name || !price || !weight || !quantity) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      let imageURL = existingImage || null;

      if (imageFile) {
        const imageRef = ref(
          storage,
          `products/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
      }

      const data = {
        name,
        price: Number(price),
        weight: Number(weight),
        quantity: Number(quantity), // ✅ NEW
        ...(imageURL && { image: imageURL }),
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), data);
        toast.success("Product updated successfully");
      } else {
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }

    setLoading(false);
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted");
    fetchProducts();
  };

  const editProduct = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setWeight(product.weight);
    setQuantity(product.quantity); // ✅ NEW
    setExistingImage(product.image || null);
    setPreview(product.image || null);
    setImageFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Manage Products</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 items-center">
        <input className="border rounded px-3 py-2 w-full" placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded px-3 py-2 w-32" placeholder="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input className="border rounded px-3 py-2 w-40" placeholder="Weight (grams)" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        <input className="border rounded px-3 py-2 w-40" placeholder="Stock Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleImageChange} className="border rounded px-3 py-2" />
        <button onClick={saveProduct} disabled={loading} className="bg-black text-white px-6 py-2 rounded disabled:opacity-50">
          {loading ? "Saving..." : editId ? "Update" : "Add"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-primary text-black">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Weight</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.image && <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-center">₹{p.price}</td>
                <td className="p-3 text-center">{p.weight} g</td>
                <td className="p-3 text-center">{p.quantity}</td>
                <td className="p-3 text-center space-x-3">
                  <button onClick={() => editProduct(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
