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
    setImageFile(null);
    setPreview(null);
    setEditId(null);
    setExistingImage(null);
  };

  const saveProduct = async () => {
    if (!name || !price) {
      return toast.error("Name and price are required");
    }

    try {
      setLoading(true);

      let imageURL = existingImage || null;

      // Upload new image ONLY if selected
      if (imageFile) {
        const imageRef = ref(
          storage,
          `products/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
      }

      if (editId) {
        // UPDATE PRODUCT
        await updateDoc(doc(db, "products", editId), {
          name,
          price: Number(price),
          ...(imageURL && { image: imageURL }),
        });

        toast.success("Product updated successfully");
      } else {
        // ADD PRODUCT
        await addDoc(collection(db, "products"), {
          name,
          price: Number(price),
          ...(imageURL && { image: imageURL }),
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
    setExistingImage(product.image || null);
    setPreview(product.image || null);
    setImageFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* ADD / EDIT FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 items-center">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="border rounded px-3 py-2 w-32"
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={saveProduct}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : editId ? "Update" : "Add"}
        </button>
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Image Preview</p>
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded shadow"
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-primary text-black">
            <tr>
              <th className="p-3 text-left w-1/4">Image</th>
              <th className="p-3 text-left w-1/2">Name</th>
              <th className="p-3 text-center w-1/6">Price</th>
              <th className="p-3 text-center w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-center">₹{p.price}</td>
                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => editProduct(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
