import React, { useMemo, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router' 
 
const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState(() => {
    const p = new URLSearchParams(location.search)
    return p.get('search') || ''
  })
  const token = localStorage.getItem('access_token')

  const isAdmin = useMemo(() => {
    if (!token) return false
    try {
      const parts = token.split('.')
      if (parts.length < 2) return false
      const payload = JSON.parse(atob(parts[1]))
      return payload.role === 'Admin'
    } catch {
      return false
    }
  }, [token])

  function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    const params = new URLSearchParams()
    if (q) params.set('search', q)
    params.set('page', 1)
    navigate(`/?${params.toString()}`)
  }

  function handleLogout() {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  return (
    <header className="w-full bg-white shadow sticky top-0 z-30">
      <div className="w-full mx-auto flex items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-gray-800">E-library</h1>

          <nav className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Catalogue
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Favorite
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4 w-full max-w-lg">
          <form onSubmit={handleSearch} className="flex items-center flex-1">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            {token && isAdmin && (
              <button
                onClick={() => navigate('/upload')}
                className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-md transition cursor-pointer"
                aria-label="Upload"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0l-3.5 3.5M12 3l3.5 3.5" />
                </svg>
                Upload
              </button>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-md cursor-pointer"
                aria-label="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="text-sm text-blue-600 hover:underline">Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar