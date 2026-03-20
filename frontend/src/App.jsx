import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import Login from './pages/Login';
import Search from './pages/Search';
import Profile from './pages/Profile'; // <-- 1. Import trang Profile

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>

        {/* Nhóm 1: Có Header & Footer */}
        <Route path="/" element={<><Header /><main className="flex-grow"><Home /></main><Footer /></>} />
        <Route path="/app/:id" element={<><Header /><main className="flex-grow"><AppDetail /></main><Footer /></>} />
        <Route path="/search" element={<><Header /><main className="flex-grow"><Search /></main><Footer /></>} />

        {/* --- 2. THÊM ROUTE THÔNG TIN TÀI KHOẢN --- */}
        <Route path="/profile" element={<><Header /><main className="flex-grow"><Profile /></main><Footer /></>} />

        {/* Nhóm 2: Không có Header/Footer */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </div>
  );
}

export default App;