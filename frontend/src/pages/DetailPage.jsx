import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import http from '../libraries/http'
import Swal from 'sweetalert2'
import GlobalButton from '../components/GlobalButton'

const DetailPage = () => {
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [book, setBook] = useState(null)
  const token = localStorage.getItem('access_token')

  const fecthData = async () => {
    try {
      setLoading(true)
      const response = await http.get(`/books/${id}`)
      setBook(response.data.data)
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

  const handleAddToFavo = async (e) => {
    e.preventDefault()
    try {
      const response = await http.post('/favorites', {bookId:id}, {
        headers: {
          "Authorization" : `Bearer ${token}`
        }
      })

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'Close'
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  useEffect(() => {
    fecthData()
  }, [id])

   if (loading) return <div className="p-6 text-center">Loading...</div>
   if (!book) return <div className="p-6 text-center text-gray-500">No book data</div>

  return (
    <div className="p-6 py-8 max-w-3xl m-auto flex flex-col md:flex-row gap-5">
      <div>
        {book.imageUrl && <img src={book.imageUrl} alt={book.bookName} className="max-h-[300px] mx-auto scale-2/3 object-cover rounded mb-4" />}
      </div>
      <div className='flex flex-col'>
        <div>
          <h1 className="text-2xl font-semibold mb-2">{book.bookName}</h1>
          {book.description && <p className="text-gray-700 mb-4">{book.description}</p>}
          <p className="text-sm text-gray-400 mb-4">Created: {new Date(book.createdAt).toLocaleString()}</p>
        <div>
        </div>
          <GlobalButton onClick={handleAddToFavo} className="text-red-400">
            Add favorite
          </GlobalButton>
        </div>
      </div>
    </div>
  )
}

export default DetailPage