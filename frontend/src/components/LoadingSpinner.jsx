import { motion } from 'framer-motion'

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }
  const spinner = (
    <motion.div
      className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        {spinner}
      </div>
    )
  }
  return <div className="flex justify-center py-12">{spinner}</div>
}

export default LoadingSpinner
