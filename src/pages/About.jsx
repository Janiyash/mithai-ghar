export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Mithai Ghar
          </h1>
          <p className="max-w-3xl mx-auto text-lg opacity-90">
            Delivering freshness, tradition, and taste right to your doorstep.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Mithai Ghar was founded with one simple goal — to bring authentic
            Indian sweets and snacks to everyone with the same quality, taste,
            and freshness as a traditional sweet shop.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From festive mithai to everyday namkeen, every product is prepared
            with premium ingredients and hygienic processes, ensuring a
            delightful experience in every bite.
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h3 className="text-2xl font-bold text-orange-500">
            Why Choose Us?
          </h3>

          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-xl">✔</span>
              Freshly prepared products with premium quality ingredients
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-xl">✔</span>
              Fast & reliable delivery with safe packaging
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-xl">✔</span>
              Simple online ordering with real-time order tracking
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-xl">✔</span>
              Trusted by hundreds of happy customers
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Experience the Taste of Tradition
          </h2>
          <p className="text-gray-600 mb-6">
            Order your favorite sweets and snacks today and enjoy the authentic
            flavors you love.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 rounded-full text-white font-semibold
                       bg-gradient-to-r from-orange-500 to-yellow-400
                       hover:opacity-90 transition"
          >
            Browse Products
          </a>
        </div>
      </section>
    </div>
  );
}
