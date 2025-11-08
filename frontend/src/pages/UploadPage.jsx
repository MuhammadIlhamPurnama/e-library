import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import http from '../libraries/http'
import Swal from 'sweetalert2'
import GlobalButton from '../components/GlobalButton'

const UploadPage = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  // decode token payload to check role
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

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    if (!isAdmin) {
      Swal.fire({
        title: 'Forbidden',
        text: 'Only admins can access this page',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/')
      })
    }
  }, [token, isAdmin])

  const [form, setForm] = useState({
    bookName: '',
    description: ''
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value})
  }

  function handleFile(e) {
    const f = e.target.files[0]
    setFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.bookName.trim()) {
      return Swal.fire('Error', 'Book name is required', 'error')
    }
    if (!file) {
      return Swal.fire('Error', 'Image is required', 'error')
    }
    try {
      setLoading(true)
      const fd = new FormData()
      fd.append('bookName', form.bookName)
      fd.append('description', form.description)
      fd.append('imageUrl', file)

      const res = await http.post('/books', fd, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        onUploadProgress(progressEvent) {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        }
      })

      Swal.fire({
        title: 'Success!',
        text: res.data.message || 'Book uploaded',
        icon: 'success',
        confirmButtonText: 'Close'
      })
      navigate('/')
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || err.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Book</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
            <input
              name="bookName"
              value={form.bookName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <p className='text-sm text-gray-400'>Max: 2MB</p>
            <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm text-gray-600" />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="preview" className="w-40 h-56 object-cover rounded-md border" />
              </div>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          <div className="pt-2">
            <GlobalButton type="submit" disabled={loading}>
              {loading ? `Uploading… ${uploadProgress}%` : 'Add Book'}
            </GlobalButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPage