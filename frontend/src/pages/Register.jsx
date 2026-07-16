import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordStrength = () => {
    const p = form.password
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[a-z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[@$!%*?&]/.test(p)) score++
    return score
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (passwordStrength() < 5) { toast.error('Password does not meet requirements'); return }
    setLoading(true)
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password })
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.data
      toast.error(typeof msg === 'string' ? msg : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength = passwordStrength()
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required className="input-field pl-10" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input required className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required className="input-field pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pl-10" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+919876543210" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type={showPass ? 'text' : 'password'} required className="input-field pl-10 pr-10"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded ${i < strength ? strengthColors[strength - 1] : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 mt-1">Min 8 chars, uppercase, lowercase, number & special char</p>
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input type="password" required className="input-field" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="text-center mt-6 text-sm">Already have an account? <Link to="/login" className="text-primary-500 font-semibold">Sign In</Link></p>
      </motion.div>
    </div>
  )
}

export default Register
