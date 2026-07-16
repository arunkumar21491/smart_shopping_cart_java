import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiHeart, FiShoppingCart, FiClock } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import { orderApi, wishlistApi, cartApi, recommendationApi } from '../api'
import ProductCard from '../components/ProductCard'

const UserDashboard = () => {
  const [orders, setOrders] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderApi.getMyOrders({ page: 0, size: 5 }),
      wishlistApi.get(),
      cartApi.get(),
      recommendationApi.recentlyViewed()
    ]).then(([ords, wish, cart, viewed]) => {
      setOrders(ords.content)
      setWishlistCount(wish.length)
      setCartCount(cart.itemCount)
      setRecent(viewed)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  const stats = [
    { icon: FiPackage, label: 'Orders', value: orders.length, link: '/orders', color: 'from-blue-500 to-cyan-500' },
    { icon: FiHeart, label: 'Wishlist', value: wishlistCount, link: '/wishlist', color: 'from-pink-500 to-rose-500' },
    { icon: FiShoppingCart, label: 'Cart Items', value: cartCount, link: '/cart', color: 'from-green-500 to-emerald-500' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={s.link} className={`glass-card p-6 block bg-gradient-to-br ${s.color} text-white hover:scale-[1.02] transition-transform`}>
              <s.icon className="text-3xl mb-3" />
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-white/80">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FiClock /> Recent Orders</h3>
          {orders.length === 0 ? <p className="text-slate-500">No orders yet</p> : (
            <div className="space-y-3">
              {orders.map((o) => (
                <Link key={o.id} to={`/orders/${o.id}`} className="flex justify-between p-3 rounded-xl hover:bg-white/10 transition-colors">
                  <span className="font-medium">{o.orderNumber}</span>
                  <span className="text-sm text-slate-500">{o.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {recent.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4">Recently Viewed</h3>
            <div className="grid grid-cols-2 gap-4">
              {recent.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
