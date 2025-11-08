import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import http from '../libraries/http'
import Swal from 'sweetalert2'
import GlobalButton from '../components/GlobalButton'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await http.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProfile(res.data.data)
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || err.message,
          icon: 'error',
          confirmButtonText: 'Close'
        })
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLogout() {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading profile...</div>
  }

  if (!profile) {
    return null
  }

  const { user, favoriteCount } = profile
  const created = user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
            {user.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{user.email}</h2>
            <p className="text-sm text-gray-500">Role: <span className="font-medium text-gray-700">{user.role}</span></p>
            <p className="text-sm text-gray-400 mt-1">Joined: {created}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-md bg-gray-50">
            <p className="text-sm text-gray-500 mb-2">Favorited books</p>
            <p className="text-2xl font-semibold text-gray-800 mb-2">{favoriteCount}</p>
            <NavLink to="/favorites" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
              <GlobalButton className="text-red-400">
                favorite
              </GlobalButton>
            </NavLink>
          </div>

          <div className="p-4 rounded-md bg-gray-50">
            <p className="text-sm text-gray-500">Account ID</p>
            <p className="text-2xl font-semibold text-gray-800">{user.id}</p>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage