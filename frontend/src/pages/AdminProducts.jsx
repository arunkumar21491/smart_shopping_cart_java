import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import { productApi, categoryApi } from '../api'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', discount: 0, stock: 0, categoryId: '', imageUrl: '' })

  const load = () => {
    setLoading(true)
    Promise.all([productApi.getAll({ page: 0, size: 50 }), categoryApi.getAll()])
      .then(([prods, cats]) => { setProducts(prods.content); setCategories(cats) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock), categoryId: Number(form.categoryId) }
    try {
      if (editId) { await productApi.update(editId, data); toast.success('Product updated') }
      else { await productApi.create(data); toast.success('Product created') }
      setShowForm(false); setEditId(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, discount: p.discount, stock: p.stock, categoryId: p.categoryId, imageUrl: p.imageUrl })
    setEditId(p.id); setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await productApi.delete(id); toast.success('Deleted'); load()
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex gap-3">
          <Link to="/admin/dashboard" className="btn-secondary text-sm">Dashboard</Link>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', price: '', discount: 0, stock: 0, categoryId: '', imageUrl: '' }) }}
            className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add Product</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 space-y-4">
          <h3 className="font-bold">{editId ? 'Edit' : 'Add'} Product</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input required className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select required className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input required type="number" className="input-field" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="input-field" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            <input required type="number" className="input-field" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input className="input-field" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <textarea className="input-field" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr><th className="p-4 text-left">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-center">{formatPrice(p.price)}</td>
                <td className="p-4 text-center">{p.stock}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleEdit(p)} className="p-2 text-blue-500"><FiEdit /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProducts
