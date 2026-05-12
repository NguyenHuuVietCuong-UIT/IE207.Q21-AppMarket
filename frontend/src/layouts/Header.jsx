import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Header.module.css';
import logoUrl from '../assets/logo.svg';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);

    // 1. Đồng bộ trạng thái User từ localStorage
    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkUser();
        // Lắng nghe sự kiện thay đổi route để cập nhật lại user (phòng trường hợp vừa đăng nhập xong)
    }, [location]);

    // 2. Logic Avatar: Lấy chữ cái đầu của họ và tên
    const getInitials = (name) => {
        if (!name || typeof name !== 'string') return 'U'; // Trả về 'U' (User) nếu không có tên
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    // 3. Logic Avatar: Random màu nền cố định dựa trên tên user
    const avatarColor = useMemo(() => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#ff9800', '#4CAF50'];

        // KIỂM TRA THÊM user.fullName
        if (!user || !user.fullName || typeof user.fullName !== 'string') return colors[0];

        // Dùng mã ASCII của tên để chọn màu cố định cho mỗi user
        const charCodeSum = user.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return colors[charCodeSum % colors.length];
    }, [user]);

    // 4. Logic Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 5. Logic Tìm kiếm & Gợi ý (Nối với API suggestions đã viết ở backend)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const res = await axios.get(`/api/v1/apps/suggestions?q=${searchQuery}`);
                    if (res.data.success) {
                        setSuggestions(res.data.data);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error("Lỗi lấy gợi ý:", err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce để tránh gọi API liên tục
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setShowSuggestions(false);
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };

    const handleAppClick = (appTitle) => {
        setShowSuggestions(false);
        setSearchQuery('');
        navigate(`/app/${encodeURIComponent(appTitle)}`);
    };

    // 6. Logic Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <header className={styles.header}>
            {/* TRÁI: Logo */}
            <div className={styles.logoContainer} onClick={() => navigate('/')}>
                <img
                    src={logoUrl}
                    alt="AppMarket"
                    className={styles.logo}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.insertAdjacentHTML('afterend', '<h2 style="color: #4CAF50; font-weight: 800;">AppMarket</h2>');
                    }}
                />
            </div>

            {/* GIỮA: Thanh tìm kiếm */}
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Tìm kiếm ứng dụng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <ul className={styles.suggestions}>
                        {suggestions.map(app => (
                            <li
                                key={app._id}
                                className={styles.suggestionItem}
                                onClick={() => handleAppClick(app.title)}
                            >
                                <img src={app.icon} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', marginRight: '10px' }} />
                                {app.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* PHẢI: Auth / Avatar */}
            <div className={styles.authContainer} ref={dropdownRef}>
                {!user ? (
                    <button className={styles.loginBtn} onClick={() => navigate('/login')}>
                        Đăng nhập
                    </button>
                ) : (
                    <div className={styles.userSection}>
                        <div
                            className={styles.avatar}
                            style={{ backgroundColor: avatarColor }}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {getInitials(user?.fullName)} {/* Sửa ở đây */}
                        </div>

                        {showDropdown && (
                            <div className={styles.dropdown}>
                                {/* Dòng 1: Profile Summary */}
                                <div className={styles.dropdownHeader}>
                                    <div className={styles.avatarSmall} style={{ backgroundColor: avatarColor }}>
                                        {getInitials(user?.fullName)} {/* Sửa ở đây */}
                                    </div>
                                    <div className={styles.userInfo}>
                                        <p className={styles.userName}>{user?.fullName || 'Người dùng'}</p> {/* Sửa ở đây */}
                                        <p className={styles.userEmail}>{user?.email || user?.phone}</p>
                                    </div>
                                </div>

                                {/* Dòng 2 & 3 & 4: Navigation */}
                                <Link to="/profile" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                    Thông tin cá nhân
                                </Link>
                                <Link to="/payment" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                    Thanh toán
                                </Link>
                                <Link to="/history" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                    Lịch sử giao dịch
                                </Link>

                                {/* Dòng 5: Đăng xuất */}
                                <div className={`${styles.dropdownItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                                    Đăng xuất
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;