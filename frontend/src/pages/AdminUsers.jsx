import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiTrash2 } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import { userApi } from '../api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    userApi.getAll({ page: 0, size: 50 }).then((d) => setUsers(d.content)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const toggleStatus = async (id) => {
    try { await userApi.toggleStatus(id); toast.success('Status updated'); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try { await userApi.delete(id); toast.success('User deleted'); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Link to="/admin/dashboard" className="btn-secondary text-sm">Dashboard</Link>
      </div>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr><th className="p-4 text-left">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 font-medium">{u.firstName} {u.lastName}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4"><span className="px-2 py-1 rounded bg-primary-100 text-primary-800 text-xs">{u.role}</span></td>
                <td className="p-4">
                  <button onClick={() => toggleStatus(u.id)} className={`px-3 py-1 rounded-full text-xs font-semibold ${u.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.enabled ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => deleteUser(u.id)} className="p-2 text-red-500"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
