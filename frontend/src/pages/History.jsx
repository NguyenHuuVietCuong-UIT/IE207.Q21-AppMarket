import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './History.module.css';

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await axios.get('/api/v1/transactions/my-history', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    setHistory(res.data.data);
                }
            } catch (err) {
                console.error("Lỗi lấy lịch sử:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    // Format ngày tháng hiển thị đẹp hơn
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) return <div className={styles.container}>Đang tải lịch sử...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Lịch sử tải & Mua ứng dụng</h1>

            {history.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>Bạn chưa tải ứng dụng nào.</h3>
                    <p>Khám phá kho ứng dụng ngay hôm nay!</p>
                    <button
                        style={{ marginTop: '16px', padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Về Trang chủ
                    </button>
                </div>
            ) : (
                <div className={styles.historyList}>
                    {history.map((item) => (
                        <div
                            key={item._id}
                            className={styles.historyCard}
                            // Nhấp vào thẻ thì nhảy qua trang Chi tiết App
                            onClick={() => navigate(`/app/${encodeURIComponent(item.app?.title)}`)}
                        >
                            {/* Lỗi ở Backend nếu xoá mất app trong DB thì app sẽ bị null, ta check an toàn (item.app?) */}
                            <img src={item.app?.icon || '/default-icon.png'} alt="App Icon" className={styles.appIcon} />

                            <div className={styles.appInfo}>
                                <div className={styles.appTitle}>{item.app?.title || 'Ứng dụng đã bị xóa'}</div>
                                <div className={styles.appDeveloper}>{item.app?.developer || 'Không rõ nhà phát triển'}</div>

                                <div className={styles.transactionMeta}>
                                    <span>🕒 {formatDate(item.createdAt)}</span>
                                    <span className={styles.priceBadge}>
                                        {item.price > 0 ? `-${item.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.statusBadge}>Đã cài đặt</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;