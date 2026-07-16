import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import { orderApi } from '../api'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderApi.getById(id).then(setOrder).finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return
    try {
      const updated = await orderApi.cancel(id)
      setOrder(updated)
      toast.success('Order cancelled')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const downloadInvoice = async () => {
    try {
      const res = await orderApi.downloadInvoice(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${order.orderNumber}.pdf`
      link.click()
    } catch { toast.error('Failed to download invoice') }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!order) return <p className="text-center py-20">Order not found</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="px-4 py-2 rounded-full bg-primary-100 text-primary-800 font-semibold">{order.status}</span>
      </div>

      <div className="glass-card p-6 mb-6">
        <h3 className="font-bold mb-4">Items</h3>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-slate-500">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
            </div>
            <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatPrice(order.discountAmount)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="font-bold mb-3">Shipping</h3>
          <p>{order.shippingAddress}</p>
          <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
          <p className="mt-2">{order.shippingPhone}</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-bold mb-3">Payment</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>Status: {order.paymentStatus}</p>
          {order.transactionId && <p className="text-sm text-slate-500">Txn: {order.transactionId}</p>}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={downloadInvoice} className="btn-primary">Download Invoice</button>
        {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
          <button onClick={handleCancel} className="btn-secondary text-red-500">Cancel Order</button>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
