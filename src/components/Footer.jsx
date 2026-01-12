import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-full mx-auto px-6 py-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="font-serif text-xl font-bold">
                MithaiGhar
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Fresh, authentic Indian sweets delivered to your doorstep.
              Crafted with tradition and love.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-500">Products</Link></li>
              <li><Link to="/about" className="hover:text-orange-500">About</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500">Contact</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📞 +91 78029 13513</li>
              <li>✉️ vishalmotwani04@gmail.com</li>
              <li>🕒 8 AM – 8 PM</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-orange-500 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-orange-500 cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col items-center text-sm text-gray-500 text-center space-y-1">
          <p>
            © {new Date().getFullYear()} MithaiGhar. All rights reserved.
          </p>
          
          <p>
            Made with ❤️ in India
          </p>
        </div>
          
      </div>
    </footer>
  );
}
