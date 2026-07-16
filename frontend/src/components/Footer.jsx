import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi'

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-white font-bold text-lg mb-4">🛒 SmartCart</h3>
        <p className="text-sm">Your premium destination for smart shopping. Quality products, seamless experience.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <div className="space-y-2 text-sm">
          <Link to="/products" className="block hover:text-white">Products</Link>
          <Link to="/cart" className="block hover:text-white">Cart</Link>
          <Link to="/orders" className="block hover:text-white">Orders</Link>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Support</h4>
        <div className="space-y-2 text-sm">
          <p>Help Center</p>
          <p>Shipping Info</p>
          <p>Returns Policy</p>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Connect</h4>
        <div className="flex gap-4 text-xl">
          <FiFacebook className="hover:text-white cursor-pointer" />
          <FiTwitter className="hover:text-white cursor-pointer" />
          <FiInstagram className="hover:text-white cursor-pointer" />
          <FiMail className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800 text-center py-4 text-sm">
      © 2026 Smart Shopping Cart. All rights reserved.
    </div>
  </footer>
)

export default Footer
