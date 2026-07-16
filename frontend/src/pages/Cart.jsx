import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import { cartApi } from '../api'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadCart = () => {
    setLoading(true)
    cartApi.get().then(setCart).finally(() => setLoading(false))
  }

  useEffect(() => { loadCart() }, [])

  const updateQty = async (id, quantity) => {
    try {
      await cartApi.update(id, quantity)
      loadCart()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const removeItem = async (id) => {
    try {
      await cartApi.remove(id)
      toast.success('Item removed')
      loadCart()
    } catch (err) { toast.error('Failed to remove') }
  }

  if (loading) return <LoadingSpinner fullScreen />

  if (!cart?.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="text-6xl mx-auto mb-4 text-slate-300" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.itemCount} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }}
                className="glass-card p-4 flex gap-4">
                <img src={item.productImage} alt={item.productName} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-primary-500 font-bold mt-1">{formatPrice(item.discountedPrice)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center glass rounded-lg">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2"><FiMinus /></button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="p-2"><FiPlus /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 /></button>
                  </div>
                </div>
                <div className="text-right font-bold">{formatPrice(item.subtotal)}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="glass-card p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
            <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatPrice(cart.discountAmount)}</span></div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span>{formatPrice(cart.total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full block text-center mt-6 py-3">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
