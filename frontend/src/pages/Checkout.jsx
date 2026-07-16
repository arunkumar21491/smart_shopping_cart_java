import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import { cartApi, orderApi } from '../api'
import { useAuth } from '../context/AuthContext'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    shippingAddress: '', shippingCity: '', shippingState: '', shippingZip: '',
    shippingPhone: user?.phone || '', notes: '', paymentMethod: 'COD', cardNumber: '', upiId: ''
  })

  useEffect(() => { cartApi.get().then(setCart).finally(() => setLoading(false)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const order = await orderApi.checkout(form)
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!cart?.items?.length) { navigate('/cart'); return null }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h3 className="font-bold mb-4">Shipping Details</h3>
            <div className="space-y-4">
              <textarea required className="input-field" rows={2} placeholder="Full Address"
                value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input className="input-field" placeholder="City" value={form.shippingCity} onChange={(e) => setForm({ ...form, shippingCity: e.target.value })} />
                <input className="input-field" placeholder="State" value={form.shippingState} onChange={(e) => setForm({ ...form, shippingState: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className="input-field" placeholder="ZIP Code" value={form.shippingZip} onChange={(e) => setForm({ ...form, shippingZip: e.target.value })} />
                <input required className="input-field" placeholder="Phone" value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} />
              </div>
              <textarea className="input-field" rows={2} placeholder="Order notes (optional)"
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="font-bold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {['COD', 'UPI', 'CARD'].map((method) => (
                <label key={method} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-colors
                  ${form.paymentMethod === method ? 'border-primary-500 bg-primary-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="payment" value={method} checked={form.paymentMethod === method}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
                  <span className="font-medium">{method === 'COD' ? 'Cash on Delivery' : method === 'UPI' ? 'UPI Payment' : 'Credit/Debit Card'}</span>
                </label>
              ))}
              {form.paymentMethod === 'UPI' && (
                <input required className="input-field" placeholder="yourname@upi" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} />
              )}
              {form.paymentMethod === 'CARD' && (
                <input required className="input-field" placeholder="Card Number (16 digits)" maxLength={16}
                  value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '') })} />
              )}
            </div>
          </motion.div>
        </div>

        <div className="glass-card p-6 h-fit">
          <h3 className="font-bold mb-4">Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800">
              <span>{item.productName} x{item.quantity}</span>
              <span>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
            <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatPrice(cart.discountAmount)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-6 py-3">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Checkout
