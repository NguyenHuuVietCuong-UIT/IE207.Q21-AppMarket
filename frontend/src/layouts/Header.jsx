import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { Search, User, PlayCircle } from 'lucide-react';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate(); // Khởi tạo navigate
    const [keyword, setKeyword] = useState(''); // State lưu từ khóa gõ trên Header

    // Hàm xử lý khi bấm phím Enter
    const handleSearch = (e) => {
        if (e.key === 'Enter' && keyword.trim() !== '') {
            navigate(`/search?q=${keyword}`);
        }
    };

    return (
        <header className="py-4 px-6 md:px-10 border-b border-gray-100 bg-white flex items-center justify-between">
            {/* ... Phần Logo & Menu giữ nguyên ... */}

            {/* CỤM TRÁI: Logo + Menu */}
            <div className="flex items-center gap-10">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:bg-primary-hover transition">
                        <PlayCircle size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">App Market</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-lg font-medium text-gray-600">
                    <Link to="/search" className="hover:text-primary transition">Khám phá</Link>
                </nav>
            </div>

            {/* CỤM PHẢI: Tìm kiếm + Xác thực */}
            <div className="flex items-center gap-6">

                {/* THANH TÌM KIẾM ĐÃ ĐƯỢC KẾT NỐI */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-72 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white border border-transparent transition">
                    <Search size={18} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleSearch} // Bắt sự kiện Enter
                        placeholder="Tìm ứng dụng, trò chơi..."
                        className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800"
                    />
                </div>

                {/* ... Phần Đăng nhập giữ nguyên ... */}
                {isLoggedIn ? (
                    <Link to="/profile" className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition cursor-pointer">
                        <User size={20} />
                    </Link>
                ) : (
                    <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition shadow-sm hover:shadow-md">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;