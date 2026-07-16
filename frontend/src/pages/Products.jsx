import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { productApi, categoryApi } from '../api'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '', sortBy: 'createdAt', sortDir: 'desc', page: 0
  })

  useEffect(() => { categoryApi.getAll().then(setCategories) }, [])

  useEffect(() => {
    setLoading(true)
    const params = {
      page: filters.page, size: 12, sortBy: filters.sortBy, sortDir: filters.sortDir,
      ...(filters.category && { categoryId: filters.category }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.search && { keyword: filters.search })
    }
    const apiCall = filters.search || filters.category || filters.minPrice || filters.maxPrice
      ? productApi.filter(params) : productApi.getAll(params)

    apiCall.then((data) => {
      setProducts(data.content)
      setTotalPages(data.totalPages)
    }).finally(() => setLoading(false))
  }, [filters])

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 0 }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-8">All Products</motion.h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-6">
          <div className="glass-card p-4 space-y-4">
            <h3 className="font-semibold">Filters</h3>
            <input placeholder="Search..." className="input-field" value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)} />
            <select className="input-field" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="input-field" value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="input-field" value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)} />
            </div>
            <select className="input-field" value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={(e) => { const [sortBy, sortDir] = e.target.value.split('-'); setFilters((p) => ({ ...p, sortBy, sortDir, page: 0 })) }}>
              <option value="createdAt-desc">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? <LoadingSpinner /> : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
              {products.length === 0 && <p className="text-center py-12 text-slate-500">No products found</p>}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button disabled={filters.page === 0} onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                    className="btn-secondary px-4 py-2 disabled:opacity-50">Prev</button>
                  <span className="px-4 py-2">Page {filters.page + 1} of {totalPages}</span>
                  <button disabled={filters.page >= totalPages - 1} onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                    className="btn-secondary px-4 py-2 disabled:opacity-50">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
