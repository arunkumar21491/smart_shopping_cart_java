import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { categoryApi, recommendationApi } from '../api'

const Home = () => {
  const [categories, setCategories] = useState([])
  const [trending, setTrending] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      categoryApi.getAll(),
      recommendationApi.trending(),
      recommendationApi.mostPurchased()
    ]).then(([cats, trend, featured]) => {
      setCategories(cats)
      setTrending(trend)
      setFeatured(featured)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div>
      <section className="relative overflow-hidden bg-hero-pattern min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-white">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Shop Smarter,<br />Live Better
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-xl">
              Discover premium products with AI-powered recommendations and seamless checkout.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center gap-2 text-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-secondary text-white border-white/30 text-lg">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute right-10 top-1/2 -translate-y-1/2 text-9xl hidden lg:block animate-float"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🛒
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-10">
        {[
          { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
          { icon: FiShield, title: 'Secure Payment', desc: '100% protected checkout' },
          { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' }
        ].map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-500/20 text-primary-500 text-2xl"><f.icon /></div>
            <div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} whileHover={{ scale: 1.05 }}>
              <Link to={`/products?category=${cat.id}`} className="glass-card overflow-hidden block text-center group">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-24 object-cover group-hover:scale-110 transition-transform" />
                <p className="p-3 font-medium text-sm">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <Link to="/products" className="text-primary-500 hover:underline flex items-center gap-1">View All <FiArrowRight /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trending.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah M.', text: 'Amazing shopping experience! Fast delivery and great products.', rating: 5 },
            { name: 'James K.', text: 'The recommendation engine helped me find exactly what I needed.', rating: 5 },
            { name: 'Priya R.', text: 'Best e-commerce platform. Love the UI and smooth checkout.', rating: 5 }
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-card p-6">
              <div className="text-yellow-400 mb-3">{'★'.repeat(t.rating)}</div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">"{t.text}"</p>
              <p className="font-semibold">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
