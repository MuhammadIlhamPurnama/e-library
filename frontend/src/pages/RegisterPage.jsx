import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router';
import http from '../libraries/http';
import Swal from 'sweetalert2'

const RegisterPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword:''
  })

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value})
  }

  async function handleRegister(e) {
    e.preventDefault()

    try {
      const response = await http.post('/register', form)

      Swal.fire({
        title: 'Success!',
        text: "Success register",
        icon: 'success',
        confirmButtonText: 'Close'
      })

      navigate('/login')
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white shadow-md rounded-lg p-8">
        <div>
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Create your account</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
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
                placeholder="Enter a secure password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
              Register
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account? <NavLink to="/login" className="text-blue-600 hover:underline">Login Now</NavLink>
          </p>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="https://cdn-icons-gif.flaticon.com/17644/17644506.gif"
            alt="register-image"
            className="max-h-64 object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage