import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = () => {
    const [user, setUser] = useState({ fullName: '', email: '', phone: '' });
    const [editingField, setEditingField] = useState(null); // 'name', 'phone', 'password'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State lưu dữ liệu form nhập vào
    const [newData, setNewData] = useState({ fullName: '', phone: '' });

    // State riêng cho đổi mật khẩu
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                // Đã sửa thành route chuẩn của Backend: /profile
                const res = await axios.get('/api/v1/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    const data = res.data.data;
                    setUser(data);
                    setNewData({ fullName: data.fullName, phone: data.phone || '' });
                }
            } catch (err) {
                console.error("Lỗi lấy thông tin:", err);
            }
        };
        fetchProfile();
    }, []);

    const resetStates = () => {
        setEditingField(null);
        setMessage({ type: '', text: '' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    // Hàm xử lý cập nhật Họ tên hoặc SĐT
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Đã sửa thành route chuẩn: /profile
            const res = await axios.put('/api/v1/users/profile',
                {
                    fullName: newData.fullName,
                    phone: newData.phone
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setUser(res.data.data);
                setMessage({ type: 'success', text: 'Cập nhật thành công!' });

                // Cập nhật lại localStorage để Header nhận diện
                const storedUser = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({ ...storedUser, fullName: res.data.data.fullName }));

                setTimeout(resetStates, 1500);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi cập nhật thông tin' });
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý riêng cho Đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Đã sửa thành route chuẩn: /change-password
            const res = await axios.put('/api/v1/users/change-password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                setTimeout(resetStates, 1500);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Mật khẩu hiện tại không chính xác' });
        } finally {
            setLoading(false);
        }
    };

    // Component hiển thị từng dòng thông tin
    const InfoRow = ({ label, value, field, isPassword = false }) => (
        <div className={styles.infoRow}>
            <div className={styles.infoLabel}>{label}</div>
            <div className={styles.infoValue}>
                {isPassword ? '●●●●●●●●' : (value || 'Chưa thiết lập')}
            </div>
            <div className={styles.infoAction}>
                {field !== 'email' && (
                    <button className={styles.editBtn} onClick={() => setEditingField(field)}>
                        Sửa
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.profileWrapper}>
            <h1 className={styles.pageTitle}>Thông tin tài khoản</h1>

            <div className={styles.profileContainer}>
                <InfoRow label="Địa chỉ Email" value={user.email} field="email" />
                <InfoRow label="Họ và Tên" value={user.fullName} field="name" />
                <InfoRow label="Số điện thoại" value={user.phone} field="phone" />
                <InfoRow label="Mật khẩu" value="" field="password" isPassword={true} />
            </div>

            {/* Modal Sửa thông tin / Đổi mật khẩu */}
            {editingField && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>{editingField === 'password' ? 'Đổi mật khẩu' : 'Chỉnh sửa thông tin'}</h3>

                        {message.text && (
                            <div className={`${styles.alert} ${styles[message.type]}`}>{message.text}</div>
                        )}

                        <form onSubmit={editingField === 'password' ? handleChangePassword : handleUpdateInfo}>

                            {/* Form đổi Họ Tên */}
                            {editingField === 'name' && (
                                <div className={styles.formGroup}>
                                    <label>Họ tên mới</label>
                                    <input type="text" value={newData.fullName} onChange={e => setNewData({ ...newData, fullName: e.target.value })} required />
                                </div>
                            )}

                            {/* Form đổi SĐT */}
                            {editingField === 'phone' && (
                                <div className={styles.formGroup}>
                                    <label>Số điện thoại mới</label>
                                    <input type="text" value={newData.phone} onChange={e => setNewData({ ...newData, phone: e.target.value })} required />
                                </div>
                            )}

                            {/* Form đổi Mật khẩu */}
                            {editingField === 'password' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>Mật khẩu hiện tại</label>
                                        <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Mật khẩu mới</label>
                                        <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Xác nhận mật khẩu mới</label>
                                        <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                                    </div>
                                </>
                            )}

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={resetStates}>Hủy</button>
                                <button type="submit" className={styles.confirmBtn} disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;