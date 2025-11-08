import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PageLayout from './layouts/PageLayout';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<PageLayout />}>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/books/:id' element={<DetailPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App