import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../api'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await userApi.updateProfile(form)
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      toast.success('Profile updated!')
    } catch (err) { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">First Name</label>
              <input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Last Name</label>
              <input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          </div>
          <div><label className="text-sm font-medium">Email</label>
            <input className="input-field bg-slate-100 dark:bg-slate-800" value={form.email} disabled /></div>
          <div><label className="text-sm font-medium">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="text-sm text-slate-500">Role: <span className="font-semibold">{user?.role}</span></div>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </motion.div>
    </div>
  )
}

export default Profile
