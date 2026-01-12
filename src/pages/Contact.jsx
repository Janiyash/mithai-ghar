import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await fetch("https://formsubmit.co/ajax/admin@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: "📩 New Contact Message – Mithai Ghar",
          name: form.name,
          email: form.email,
          message: form.message,
          date: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        }),
      });

      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Have a question, feedback, or special request? We’d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* INFO */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Get in Touch
          </h2>
          <p className="text-gray-600">
            Our support team is always ready to help you.
          </p>

          <div className="space-y-4 text-gray-700">
            <p>📍 <strong>Address:</strong> Tower-21-303 Labh Residency, OPP Vachnamrut Residency, Atladara , Vadodara , Gujarat, India</p>
            <p>📞 <strong>Phone:</strong> +91 78029 13513</p>
            <p>📧 <strong>Email:</strong> vishalmotwani04@gmail.com</p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-orange-500">
            Send a Message
          </h3>

          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            name="message"
            rows={4}
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white font-semibold
                       bg-gradient-to-r from-orange-500 to-yellow-400
                       hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
}
