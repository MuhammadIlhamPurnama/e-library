import React, { useState } from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router';
import http from '../libraries/http';
import Swal from 'sweetalert2'

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value})
  }

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const response = await http.post('/login', form)

      Swal.fire({
        title: 'Success!',
        text: "Success Login",
        icon: 'success',
        confirmButtonText: 'Close'
      })
      localStorage.setItem('access_token', response.data.data)

      navigate('/')
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  if (localStorage.getItem('access_token')) {
    return <Navigate to='/' />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full min-h-[440px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white shadow-md rounded-lg p-8">
        <div>
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Login to your account</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Don't have an account? <NavLink to="/register" className="text-blue-600 hover:underline">Create an account</NavLink>
          </p>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="https://cdn-icons-gif.flaticon.com/17644/17644506.gif"
            alt="login-illustration"
            className="max-h-64 object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage