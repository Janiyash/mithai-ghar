import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Create Auth User
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // 🧾 Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
        orders: []
      });

      alert("Account created successfully 🎉");
      navigate("/login");
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.svg')] bg-cover px-4">
      <form
        onSubmit={handleRegister}
        className="bg-[#fffaf3] w-full max-w-md rounded-2xl p-8 shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-orange-400 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            M
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-center">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us for the sweetest experience
        </p>

        {/* Full Name */}
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-lg border"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-lg border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="********"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-lg border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Confirm Password */}
        <label className="text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          placeholder="********"
          className="w-full mt-1 mb-6 px-4 py-3 rounded-lg border"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold
                     bg-gradient-to-r from-yellow-400 to-orange-500
                     hover:opacity-90 transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
