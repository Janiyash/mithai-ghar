import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    await updateDoc(doc(db, "users", id), { role });
    toast.success("Role updated");
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Manage Users</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-primary text-black">
            <tr>
              <th className="p-3 text-left w-1/3">Name</th>
              <th className="p-3 text-left w-1/3">Email</th>
              <th className="p-3 text-center w-1/3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-center">
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value)}
                    className="border rounded px-3 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
