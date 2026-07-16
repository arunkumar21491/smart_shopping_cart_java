import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { cartApi, wishlistApi } from '../api'
import { useAuth } from '../context/AuthContext'

const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.info('Please login first'); return }
    try {
      await cartApi.add({ productId: product.id, quantity: 1 })
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.info('Please login first'); return }
    try {
      await wishlistApi.add(product.id)
      toast.success('Added to wishlist!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/products/${product.id}`} className="glass-card overflow-hidden block h-full">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{product.discount}%
            </span>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleWishlist} className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow hover:scale-110 transition-transform">
              <FiHeart />
            </button>
            <button onClick={handleAddToCart} className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow hover:scale-110 transition-transform">
              <FiShoppingCart />
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-primary-500 font-medium mb-1">{product.categoryName}</p>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="text-yellow-400 fill-yellow-400 text-sm" />
            <span className="text-sm">{product.rating || '0.0'}</span>
            <span className="text-xs text-slate-400">({product.reviewCount || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{formatPrice(product.discountedPrice || product.price)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
