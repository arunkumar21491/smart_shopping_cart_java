import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { productApi, cartApi, wishlistApi, reviewApi, recommendationApi } from '../api'
import { useAuth } from '../context/AuthContext'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const ProductDetail = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similar, setSimilar] = useState([])
  const [qty, setQty] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      productApi.getById(id),
      reviewApi.getByProduct(id),
      recommendationApi.similar(id)
    ]).then(([prod, revs, sim]) => {
      setProduct(prod)
      setReviews(revs)
      setSimilar(sim)
      recommendationApi.recordView(id)
    }).finally(() => setLoading(false))

    if (isAuthenticated) {
      reviewApi.getMine(id).then(setMyReview).catch(() => {})
    }
  }, [id, isAuthenticated])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.info('Please login first'); return }
    try {
      await cartApi.add({ productId: product.id, quantity: qty })
      toast.success('Added to cart!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.info('Please login first'); return }
    try {
      await wishlistApi.add(product.id)
      toast.success('Added to wishlist!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    try {
      if (myReview) {
        await reviewApi.update(myReview.id, { productId: product.id, ...reviewForm })
        toast.success('Review updated!')
      } else {
        await reviewApi.create({ productId: product.id, ...reviewForm })
        toast.success('Review submitted!')
      }
      const revs = await reviewApi.getByProduct(id)
      setReviews(revs)
      const prod = await productApi.getById(id)
      setProduct(prod)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!product) return <p className="text-center py-20">Product not found</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-primary-500 font-medium mb-2">{product.categoryName}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
            ))}
            <span className="text-sm text-slate-500">({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(product.discountedPrice)}</span>
            {product.discount > 0 && <span className="text-xl text-slate-400 line-through">{formatPrice(product.price)}</span>}
            {product.discount > 0 && <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-lg">-{product.discount}%</span>}
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{product.description}</p>
          <p className="text-sm mb-4">{product.stock > 0 ? <span className="text-green-500">In Stock ({product.stock})</span> : <span className="text-red-500">Out of Stock</span>}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center glass rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><FiMinus /></button>
              <span className="px-4 font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3"><FiPlus /></button>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex items-center gap-2 flex-1 justify-center py-3">
              <FiShoppingCart /> Add to Cart
            </button>
            <button onClick={handleWishlist} className="btn-secondary p-3"><FiHeart className="text-xl" /></button>
          </div>
        </motion.div>
      </div>

      {isAuthenticated && (
        <div className="glass-card p-6 mb-12">
          <h3 className="font-bold text-lg mb-4">{myReview ? 'Update Your Review' : 'Write a Review'}</h3>
          <form onSubmit={handleReview} className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: r })}>
                  <FiStar className={`text-2xl ${r <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <textarea className="input-field" rows={3} placeholder="Share your experience..."
              value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <button type="submit" className="btn-primary">{myReview ? 'Update Review' : 'Submit Review'}</button>
          </form>
        </div>
      )}

      <div className="mb-12">
        <h3 className="font-bold text-xl mb-6">Customer Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? <p className="text-slate-500">No reviews yet. Be the first!</p> : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="glass-card p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{r.userName}</span>
                  <div className="flex">{[...Array(r.rating)].map((_, i) => <FiStar key={i} className="text-yellow-400 fill-yellow-400 text-sm" />)}</div>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <div>
          <h3 className="font-bold text-xl mb-6">Similar Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
