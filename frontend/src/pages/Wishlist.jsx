import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import { wishlistApi } from '../api'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const Wishlist = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => { wishlistApi.get().then(setItems).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const remove = async (productId) => {
    await wishlistApi.remove(productId)
    toast.success('Removed from wishlist')
    load()
  }

  const moveToCart = async (productId) => {
    try {
      await wishlistApi.moveToCart(productId)
      toast.success('Moved to cart!')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><FiHeart className="text-red-500" /> My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart className="text-6xl mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden">
              <Link to={`/products/${item.productId}`}>
                <img src={item.productImage} alt={item.productName} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/products/${item.productId}`} className="font-semibold hover:text-primary-500">{item.productName}</Link>
                <p className="font-bold text-primary-500 mt-2">{formatPrice(item.discountedPrice)}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => moveToCart(item.productId)} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2 text-sm">
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button onClick={() => remove(item.productId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
