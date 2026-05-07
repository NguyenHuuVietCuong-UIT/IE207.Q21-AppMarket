import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Payment.module.css';

const Payment = () => {
    // Các state quản lý dữ liệu hiển thị
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [myPromotions, setMyPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Các state quản lý form thêm mới và trạng thái xử lý
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMethod, setNewMethod] = useState({ provider: 'MoMo', accountNumber: '' });
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Hàm gộp: Gọi API lấy cả Ví thanh toán và Mã giảm giá cùng lúc
    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Chạy song song 2 request để tăng tốc độ load trang
            const [userRes, promoRes] = await Promise.all([
                axios.get('/api/v1/users/profile', config),
                axios.get('/api/v1/wallet/my-promotions', config)
            ]);

            if (userRes.data.success) {
                setPaymentMethods(userRes.data.data.paymentMethods || []);
            }
            if (promoRes.data.success) {
                setMyPromotions(promoRes.data.data);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu thanh toán:", err);
            setMessage({ type: 'error', text: 'Lỗi khi tải dữ liệu. Vui lòng thử lại.' });
        } finally {
            setLoading(false);
        }
    };

    // Tự động lấy dữ liệu khi mới vào trang
    useEffect(() => {
        fetchData();
    }, []);

    // 2. Hàm Thêm phương thức thanh toán mới
    const handleAddMethod = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/v1/wallet/payment-methods', newMethod, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Đã thêm phương thức thanh toán thành công!' });
                setShowAddForm(false);
                setNewMethod({ provider: 'MoMo', accountNumber: '' });
                fetchData(); // Tải lại dữ liệu để hiển thị thẻ mới
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi khi thêm phương thức thanh toán' });
        } finally {
            setActionLoading(false);
        }
    };

    // 3. Hàm Xóa (gỡ liên kết) phương thức thanh toán
    const handleDeleteMethod = async (methodId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này không?')) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`/api/v1/wallet/payment-methods/${methodId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Đã gỡ liên kết phương thức thanh toán.' });
                fetchData();
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi khi xóa phương thức thanh toán' });
        } finally {
            setActionLoading(false);
        }
    };

    // 4. Hàm Thiết lập thẻ/ví mặc định
    const handleSetDefault = async (methodId) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/v1/wallet/payment-methods/${methodId}/default`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Đã thay đổi phương thức thanh toán mặc định.' });
                fetchData();
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi khi thiết lập mặc định' });
        } finally {
            setActionLoading(false);
        }
    };

    // Hàm hỗ trợ UI: Lấy màu nền và text hiển thị tương ứng với từng nhà cung cấp
    const getProviderStyle = (provider) => {
        switch (provider) {
            case 'MoMo': return { bg: '#A50064', logo: 'MoMo' };
            case 'ZaloPay': return { bg: '#008FE5', logo: 'ZaloPay' };
            case 'VNPay': return { bg: '#ED1C24', logo: 'VNPay' };
            case 'Bank': return { bg: '#005030', logo: 'Napas / Bank' };
            default: return { bg: '#555', logo: 'Ví điện tử' };
        }
    };

    return (
        <div className={styles.paymentContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý Thanh toán & Khuyến mãi</h1>
                <p className={styles.subtitle}>Quản lý các ví điện tử, thẻ ngân hàng và mã giảm giá của bạn.</p>
            </div>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className={styles.loading}>Đang tải dữ liệu...</div>
            ) : (
                <>
                    {/* SECTION 1: QUẢN LÝ VÍ & THẺ */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ví và Thẻ liên kết</h2>

                        <div className={styles.methodsList}>
                            {paymentMethods.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <p>Bạn chưa liên kết phương thức thanh toán nào.</p>
                                </div>
                            ) : (
                                paymentMethods.map(method => {
                                    const style = getProviderStyle(method.provider);
                                    return (
                                        <div
                                            key={method._id}
                                            className={`${styles.methodCard} ${method.isDefault ? styles.defaultCard : ''}`}
                                            style={{ backgroundColor: style.bg }}
                                        >
                                            <div className={styles.cardHeader}>
                                                <span className={styles.providerLogo}>{style.logo}</span>
                                                {method.isDefault && <span className={styles.defaultBadge}>Mặc định</span>}
                                            </div>
                                            <div className={styles.cardNumber}>
                                                **** **** **** {method.accountNumber.slice(-4) || 'XXXX'}
                                            </div>
                                            <div className={styles.cardActions}>
                                                {!method.isDefault && (
                                                    <button
                                                        className={styles.actionBtn}
                                                        onClick={() => handleSetDefault(method._id)}
                                                        disabled={actionLoading}
                                                    >
                                                        Đặt mặc định
                                                    </button>
                                                )}
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteMethod(method._id)}
                                                    disabled={actionLoading}
                                                >
                                                    Gỡ liên kết
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Nút bật/tắt form thêm phương thức */}
                        <button
                            className={styles.toggleFormBtn}
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? 'Hủy thêm mới' : '+ Thêm phương thức thanh toán'}
                        </button>

                        {/* Form thêm mới */}
                        {showAddForm && (
                            <div className={styles.addFormContainer}>
                                <h3>Liên kết tài khoản mới</h3>
                                <form onSubmit={handleAddMethod}>
                                    <div className={styles.formGroup}>
                                        <label>Loại ví / Ngân hàng</label>
                                        <select
                                            value={newMethod.provider}
                                            onChange={(e) => setNewMethod({ ...newMethod, provider: e.target.value })}
                                            className={styles.selectInput}
                                        >
                                            <option value="MoMo">Ví MoMo</option>
                                            <option value="ZaloPay">ZaloPay</option>
                                            <option value="VNPay">VNPay</option>
                                            <option value="Bank">Thẻ Ngân hàng nội địa</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>{newMethod.provider === 'Bank' ? 'Số thẻ ngân hàng' : 'Số điện thoại đăng ký ví'}</label>
                                        <input
                                            type="text"
                                            value={newMethod.accountNumber}
                                            onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                                            placeholder={newMethod.provider === 'Bank' ? 'VD: 9704... (Tên chủ thẻ: NGUYEN HUU VIET CUONG)' : 'VD: 0901234567'}
                                            required
                                            className={styles.textInput}
                                        />
                                    </div>

                                    <button type="submit" className={styles.submitBtn} disabled={actionLoading}>
                                        {actionLoading ? 'Đang xử lý...' : 'Xác nhận liên kết'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </section>

                    {/* SECTION 2: QUẢN LÝ MÃ GIẢM GIÁ */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Mã giảm giá của tôi</h2>

                        <div className={styles.promoList}>
                            {myPromotions.length === 0 ? (
                                <div className={styles.emptyPromoState}>
                                    <p>Bạn chưa có mã giảm giá nào.</p>
                                </div>
                            ) : (
                                myPromotions.map(promo => (
                                    <div key={promo._id} className={styles.promoCard}>
                                        <div className={styles.promoIcon}>%</div>
                                        <div className={styles.promoInfo}>
                                            <div className={styles.promoCode}>{promo.code}</div>
                                            <div className={styles.promoDesc}>{promo.description}</div>
                                            <div className={styles.promoExpiry}>
                                                Hết hạn: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Payment;