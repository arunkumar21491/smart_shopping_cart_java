import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiSearch } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`)
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    ...(isAuthenticated ? [
      { to: '/wishlist', label: 'Wishlist' },
      { to: '/orders', label: 'Orders' },
      { to: isAdmin ? '/admin/dashboard' : '/dashboard', label: 'Dashboard' }
    ] : [])
  ]

  return (
    <motion.nav
      initial={{ y: -80 }} animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              SmartCart
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" placeholder="Search products..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 py-2"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium hover:text-primary-500 transition-colors">
                {l.label}
              </Link>
            ))}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="p-2 rounded-lg hover:bg-white/10 relative">
                  <FiShoppingCart className="text-xl" />
                </Link>
                <Link to="/wishlist" className="p-2 rounded-lg hover:bg-white/10">
                  <FiHeart className="text-xl" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10">
                    <FiUser /> <span className="text-sm">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass-card py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-white/10 text-sm">Profile</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm text-red-500">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch}>
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" />
              </form>
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-2 font-medium">{l.label}</Link>
              ))}
              {isAuthenticated ? (
                <button onClick={() => { logout(); setMenuOpen(false) }} className="text-red-500 py-2">Logout</button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
