import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router'

const PageLayout = () => {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  )
}

export default PageLayout