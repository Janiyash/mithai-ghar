import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveCategory = async () => {
    if (!name.trim()) return toast.error("Category name required");

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    try {
      if (editId) {
        await updateDoc(doc(db, "categories", editId), { name, slug });
        toast.success("Category updated");
      } else {
        await addDoc(collection(db, "categories"), {
          name,
          slug,
          createdAt: serverTimestamp(),
        });
        toast.success("Category added");
      }

      setName("");
      setEditId(null);
      fetchCategories();
    } catch {
      toast.error("Operation failed");
    }
  };

  const editCategory = (c) => {
    setName(c.name);
    setEditId(c.id);
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    toast.success("Category deleted");
    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary">
        Manage Categories
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button
          onClick={saveCategory}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-primary text-black">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-gray-500">{c.slug}</td>
                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => editCategory(c)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
