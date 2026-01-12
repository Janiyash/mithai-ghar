import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="hero-pattern">

      {/* HERO */}
      <section className="w-full px-6 md:px-20 lg:px-28 py-28 grid md:grid-cols-2 gap-20 items-center">

        <div>
          <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm shadow">
            ⭐ Trusted by 500+ customers
          </span>

          <h1 className="font-brand text-6xl leading-tight text-brown">
            Authentic Indian <br />
            <span className="text-primary">Sweets & Namkeen</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted max-w-xl">
            Experience the rich taste of tradition. Handcrafted with love
            using age-old recipes and the finest ingredients, delivered
            fresh to your doorstep.
          </p>

          <div className="mt-10 flex gap-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Explore Menu →
            </button>

            <button className="border px-8 py-3 rounded-full font-medium hover:bg-white transition">
              Our Story
            </button>
          </div>

          <div className="mt-14 flex gap-16">
            <div>
              <p className="text-primary text-3xl font-bold">2+</p>
              <p className="text-sm text-gray-500">Years of Trust</p>
            </div>
            <div>
              <p className="text-primary text-3xl font-bold">10+</p>
              <p className="text-sm text-gray-500">Varieties</p>
            </div>
            <div>
              <p className="text-primary text-3xl font-bold">4.9★</p>
              <p className="text-sm text-gray-500">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* Right Image Placeholder */}
        <div className="hidden md:flex justify-center">
          <div className="w-[420px] h-[420px] bg-white rounded-3xl shadow-xl flex items-center justify-center">
            <img
              src="https://t4.ftcdn.net/jpg/02/08/38/95/360_F_208389537_XYn1ukJfse2kVLxJYJpiBcjEkAHrWfBt.jpg"
              alt="Product"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>


      </section>

    </main>
  );
}
