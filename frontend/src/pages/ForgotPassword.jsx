import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { authApi } from '../api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent if account exists')
    } catch { toast.error('Failed to send reset email') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        {sent ? (
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">If an account exists for {email}, a reset link has been sent.</p>
            <Link to="/login" className="text-primary-500 hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required className="input-field pl-10" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <p className="text-center text-sm"><Link to="/login" className="text-primary-500">Back to Login</Link></p>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default ForgotPassword
