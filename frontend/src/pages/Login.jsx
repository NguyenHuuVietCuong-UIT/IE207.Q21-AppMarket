// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();

    // State chuyển đổi giữa Login và Register
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // States chứa dữ liệu Form
    const [formData, setFormData] = useState({
        identifier: '', // Dùng cho Đăng nhập (Email hoặc SĐT)
        email: '',      // Dùng cho Đăng ký
        phone: '',      // Dùng cho Đăng ký
        fullName: '',   // Dùng cho Đăng ký
        password: '',
        confirmPassword: '' // Dùng cho Đăng ký
    });

    // Cập nhật state khi gõ phím
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu gõ lại
    };

    // Reset form khi chuyển chế độ
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setFormData({
            identifier: '', email: '', phone: '', fullName: '', password: '', confirmPassword: ''
        });
    };

    // Hàm xử lý Submit (Cả đăng nhập và đăng ký)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                // --- LOGIC ĐĂNG NHẬP ---
                const res = await axios.post('/api/v1/auth/login', {
                    identifier: formData.identifier,
                    password: formData.password
                });

                if (res.data.success) {
                    // Lưu token và thông tin user vào localStorage
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    // Chuyển hướng về trang chủ
                    navigate('/');
                }
            } else {
                // --- LOGIC ĐĂNG KÝ ---
                if (formData.password !== formData.confirmPassword) {
                    setError('Mật khẩu xác nhận không khớp!');
                    setLoading(false);
                    return;
                }

                if (!formData.email && !formData.phone) {
                    setError('Vui lòng nhập Email hoặc Số điện thoại!');
                    setLoading(false);
                    return;
                }

                const res = await axios.post('/api/v1/auth/register', {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                });

                if (res.data.success) {
                    // Đăng ký thành công thì tự động đăng nhập luôn
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    navigate('/');
                }
            }
        } catch (err) {
            // Hiển thị lỗi từ backend trả về (nếu có)
            setError(err.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.authCard}>
                <div className={styles.logoArea}>
                    <Link to="/" className={styles.logoText}>AppMarket</Link>
                    <p className={styles.subtitle}>
                        {isLoginMode ? 'Đăng nhập để trải nghiệm không giới hạn' : 'Đăng ký tài khoản mới ngay hôm nay'}
                    </p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>

                    {/* ================= FORM ĐĂNG KÝ ================= */}
                    {!isLoginMode && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Họ và Tên (*)</label>
                                <input
                                    type="text" name="fullName" className={styles.input} required={!isLoginMode}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={formData.fullName} onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email (Tùy chọn)</label>
                                <input
                                    type="email" name="email" className={styles.input}
                                    placeholder="nguyenvana@gmail.com"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Số điện thoại (Tùy chọn)</label>
                                <input
                                    type="text" name="phone" className={styles.input}
                                    placeholder="0912345678"
                                    value={formData.phone} onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {/* ================= FORM ĐĂNG NHẬP ================= */}
                    {isLoginMode && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email hoặc Số điện thoại</label>
                            <input
                                type="text" name="identifier" className={styles.input} required={isLoginMode}
                                placeholder="Nhập email hoặc số điện thoại"
                                value={formData.identifier} onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* ================= TRƯỜNG DÙNG CHUNG ================= */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mật khẩu</label>
                        <input
                            type="password" name="password" className={styles.input} required
                            placeholder="Nhập mật khẩu"
                            value={formData.password} onChange={handleChange}
                        />
                    </div>

                    {!isLoginMode && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Xác nhận mật khẩu (*)</label>
                            <input
                                type="password" name="confirmPassword" className={styles.input} required={!isLoginMode}
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword} onChange={handleChange}
                            />
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng nhập' : 'Đăng ký')}
                    </button>
                </form>

                <div className={styles.toggleArea}>
                    {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                    <button type="button" className={styles.toggleLink} onClick={toggleMode}>
                        {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
                    </button>
                </div>

                <Link to="/" className={styles.backHome}>← Quay về Trang chủ</Link>
            </div>
        </div>
    );
};

export default Login;