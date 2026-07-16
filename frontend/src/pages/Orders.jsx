import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingSpinner from '../components/LoadingSpinner'
import { orderApi } from '../api'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)
const statusColors = { PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800', PROCESSING: 'bg-purple-100 text-purple-800', SHIPPED: 'bg-indigo-100 text-indigo-800', DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800' }

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setLoading(true)
    orderApi.getMyOrders({ page, size: 10 }).then((data) => {
      setOrders(data.content)
      setTotalPages(data.totalPages)
    }).finally(() => setLoading(false))
  }, [page])

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="font-bold">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm mt-1">{order.items?.length} item(s)</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                  <Link to={`/orders/${order.id}`} className="text-primary-500 text-sm hover:underline">View Details</Link>
                </div>
              </div>
            </motion.div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn-secondary px-4 py-2 disabled:opacity-50">Prev</button>
              <span className="px-4 py-2">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="btn-secondary px-4 py-2 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Orders
