import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { authApi } from '../api'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await authApi.resetPassword({ token, password })
      toast.success('Password reset successful!')
      navigate('/login')
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed') }
    finally { setLoading(false) }
  }

  if (!token) return <div className="text-center py-20"><p>Invalid reset link</p><Link to="/forgot-password" className="text-primary-500">Request new link</Link></div>

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" required className="input-field pl-10" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <input type="password" required className="input-field" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </motion.div>
    </div>
  )
}

export default ResetPassword
