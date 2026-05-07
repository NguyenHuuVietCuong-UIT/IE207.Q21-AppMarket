import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout
import MainLayout from './layouts/MainLayout';

// Import các trang
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import AppDetail from './pages/AppDetail';
import Profile from './pages/Profile';
import History from './pages/History';
import Payment from './pages/Payment';

function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================
            NHÓM 1: CÁC TRANG ĐỘC LẬP (KHÔNG HEADER/FOOTER) 
            ========================================= */}
        <Route path="/login" element={<Login />} />

        {/* =========================================
            NHÓM 2: CÁC TRANG DÙNG CHUNG LAYOUT 
            (Nằm bên trong thẻ MainLayout)
            ========================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/app/:title" element={<AppDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;