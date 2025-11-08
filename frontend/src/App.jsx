import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />

        
      </Routes>
    </BrowserRouter>
  )
}

export default App