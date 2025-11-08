import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import http from '../libraries/http'

const HomePage = () => {
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  })
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const fetchData = async (pageNumber = 1, searchQuery = '') => {
    try {
      setLoading(true)
      let url = `/books?page=${pageNumber}`
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      const response = await http.get(url)
      const data = response.data.data
      setBooks(data.books || [])
      setPagination({
        totalItems: data.pagination?.totalItems || 0,
        totalPages: data.pagination?.totalPages || 0,
        currentPage: data.pagination?.currentPage || pageNumber,
        limit: data.pagination?.limit || 10
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search') || ''
    const p = parseInt(params.get('page')) || 1
    fetchData(p, q)
  }, [location.search])

  function goToPage(p) {
    if (p < 1 || p > pagination.totalPages || p === pagination.currentPage) return
    const params = new URLSearchParams(location.search)
    params.set('page', p)
    navigate(`?${params.toString()}`)
  }

  return (
    <section className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Books Catalogue</h2>
       
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : (
        <>
          {books && books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
              {books.map((book) => (
                <NavLink to={`/books/${book.id}`}>
                  <div key={book.id} className="bg-white rounded-md p-4 flex flex-col items-center hover:scale-110 duration-300">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.bookName}
                        className="w-3/4 aspect-2/3 object-cover rounded-md mb-3"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">No Image</div>
                    )}

                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 pb-2">{book.bookName || book.name}</h3>

                  
                  </div>
                </NavLink>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No books found.</p>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center space-x-2" aria-label="Pagination">
              <button
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-1 cursor-pointer rounded-md border ${pagination.currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Prev
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const p = i + 1
                const isActive = p === pagination.currentPage
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`px-3 py-1 cursor-pointer rounded-md border ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-1 cursor-pointer rounded-md border ${pagination.currentPage === pagination.totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage