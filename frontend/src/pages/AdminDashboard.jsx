import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { FiDollarSign, FiPackage, FiUsers, FiShoppingBag } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import { dashboardApi } from '../api'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  const cards = [
    { icon: FiDollarSign, label: 'Total Sales', value: formatPrice(stats.totalSales), color: 'from-green-500 to-emerald-600' },
    { icon: FiPackage, label: 'Total Orders', value: stats.totalOrders, color: 'from-blue-500 to-indigo-600' },
    { icon: FiUsers, label: 'Total Users', value: stats.totalUsers, color: 'from-purple-500 to-violet-600' },
    { icon: FiShoppingBag, label: 'Total Products', value: stats.totalProducts, color: 'from-orange-500 to-amber-600' }
  ]

  const revenueData = {
    labels: stats.revenueChart?.map((d) => d.label) || [],
    datasets: [{ label: 'Revenue', data: stats.revenueChart?.map((d) => d.value) || [], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 }]
  }

  const monthlyData = {
    labels: stats.monthlySalesChart?.map((d) => d.label) || [],
    datasets: [{ label: 'Monthly Sales', data: stats.monthlySalesChart?.map((d) => d.value) || [], backgroundColor: 'rgba(99,102,241,0.8)', borderRadius: 8 }]
  }

  const categoryData = {
    labels: stats.categoryChart?.map((d) => d.label) || [],
    datasets: [{ data: stats.categoryChart?.map((d) => d.count) || [], backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'] }]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-secondary text-sm">Products</Link>
          <Link to="/admin/orders" className="btn-secondary text-sm">Orders</Link>
          <Link to="/admin/users" className="btn-secondary text-sm">Users</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 bg-gradient-to-br ${c.color} text-white`}>
            <c.icon className="text-2xl mb-2 opacity-80" />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-white/80 text-sm">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6"><h3 className="font-bold mb-4">Revenue Trend</h3><Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
        <div className="glass-card p-6"><h3 className="font-bold mb-4">Monthly Sales</h3><Bar data={monthlyData} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
        <div className="glass-card p-6"><h3 className="font-bold mb-4">Products by Category</h3><Doughnut data={categoryData} options={{ responsive: true }} /></div>
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Recent Orders</h3>
          {stats.recentOrders?.map((o) => (
            <div key={o.id} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-sm font-medium">{o.orderNumber}</span>
              <span className="text-sm text-slate-500">{o.status}</span>
              <span className="text-sm font-semibold">{formatPrice(o.totalAmount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
