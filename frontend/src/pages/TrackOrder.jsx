import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPackage } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { orderApi } from '../api'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await orderApi.track(orderNumber)
      setOrder(data)
    } catch { toast.error('Order not found'); setOrder(null) }
    finally { setLoading(false) }
  }

  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
      <form onSubmit={handleTrack} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input required className="input-field pl-10" placeholder="Enter order number (e.g. ORD-20260101-ABCD)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-8">{loading ? '...' : 'Track'}</button>
      </form>

      {order && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiPackage className="text-2xl text-primary-500" />
            <div>
              <p className="font-bold">{order.orderNumber}</p>
              <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold">{order.status}</span>
          </div>

          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700" />
            {steps.map((step, i) => {
              const active = steps.indexOf(order.status) >= i || order.status === 'DELIVERED'
              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{i + 1}</div>
                  <span className="text-xs mt-2 text-center">{step}</span>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
            <p className="text-sm text-slate-500">{order.items?.length} item(s)</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TrackOrder
