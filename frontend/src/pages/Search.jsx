import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Search.module.css'; // Sẽ tạo file CSS ngay bên dưới

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // States quản lý dữ liệu
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy từ khóa 'q' từ URL (ví dụ: /search?q=facebook)
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('q') || '';

    useEffect(() => {
        // Hàm gọi API lấy kết quả tìm kiếm
        const fetchSearchResults = async () => {
            if (!keyword) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Gọi API backend đã định nghĩa trong appRoutes.js và appController.js
                // Sử dụng keyword lấy từ URL
                const response = await axios.get(`/api/v1/apps/search-results?q=${keyword}`);

                if (response.data.success) {
                    setApps(response.data.data);
                } else {
                    setError('Không thể lấy dữ liệu tìm kiếm.');
                }
            } catch (err) {
                console.error('Lỗi khi tìm kiếm:', err);
                setError('Có lỗi xảy ra khi kết nối đến máy chủ.');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [keyword]); // Chạy lại effect mỗi khi keyword (trên URL) thay đổi

    // Hàm format số lượng lượt tải (vd: 1000000 -> 1M)
    const formatInstalls = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K+';
        return num + '+';
    };

    // Chuyển hướng sang trang chi tiết ứng dụng khi click vào card
    const handleAppClick = (title) => {
        navigate(`/app/${encodeURIComponent(title)}`);
    };

    return (
        <div className={styles.searchContainer}>
            <h2 className={styles.pageTitle}>
                Kết quả tìm kiếm cho: <span className={styles.keyword}>"{keyword}"</span>
            </h2>

            {/* Xử lý các trạng thái hiển thị */}
            {loading && <div className={styles.loading}>Đang tìm kiếm...</div>}

            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && apps.length === 0 && (
                <div className={styles.emptyState}>
                    <img src="/empty-search.svg" alt="No results" className={styles.emptyImage} onError={(e) => e.target.style.display = 'none'} />
                    <p>Rất tiếc, chúng tôi không tìm thấy ứng dụng nào khớp với từ khóa của bạn.</p>
                </div>
            )}

            {!loading && !error && apps.length > 0 && (
                <div className={styles.appGrid}>
                    {apps.map((app) => (
                        <div
                            key={app._id}
                            className={styles.appCard}
                            onClick={() => handleAppClick(app.title)}
                        >
                            <img src={app.icon} alt={app.title} className={styles.appIcon} />

                            <div className={styles.appInfo}>
                                <h3 className={styles.appTitle} title={app.title}>{app.title}</h3>
                                <p className={styles.appDeveloper}>{app.developer}</p>

                                <div className={styles.appStats}>
                                    <span className={styles.appScore}>
                                        {app.score ? app.score.toFixed(1) : 'N/A'} ⭐
                                    </span>
                                    <span className={styles.dot}>•</span>
                                    <span className={styles.appInstalls}>
                                        {formatInstalls(app.minInstalls)} tải
                                    </span>
                                </div>

                                {/* Hiển thị giá hoặc Miễn phí */}
                                <div className={styles.appPriceBadge}>
                                    {app.price > 0
                                        ? `${app.price.toLocaleString('vi-VN')} đ`
                                        : 'Miễn phí'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;