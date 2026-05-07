// frontend/src/pages/AppDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './AppDetail.module.css';

const AppDetail = () => {
    const { title } = useParams();
    const screenshotRef = useRef(null);

    // States Dữ liệu
    const [app, setApp] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullDesc, setShowFullDesc] = useState(false);

    // States Cài đặt & Đánh giá
    const [status, setStatus] = useState('IDLE');
    const [progress, setProgress] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Fetch dữ liệu khi load trang
    useEffect(() => {
        const fetchAppAndReviews = async () => {
            try {
                const appRes = await axios.get(`/api/v1/apps/detail/${encodeURIComponent(title)}`);

                if (appRes.data.success) {
                    const fetchedApp = appRes.data.data;
                    setApp(fetchedApp);

                    const reviewRes = await axios.get(`/api/v1/apps/${fetchedApp._id}/reviews`);
                    if (reviewRes.data.success) {
                        setReviews(reviewRes.data.data);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu app:", err);
                setLoading(false);
            }
        };
        fetchAppAndReviews();
    }, [title]);

    const scrollScreenshots = (direction) => {
        if (screenshotRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            screenshotRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleInstall = () => {
        setStatus('DOWNLOADING');
        setProgress(0);
        const totalTime = (app.sizeMB || 50) * 50;
        const intervalTime = 100;
        const step = (intervalTime / totalTime) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    completeInstallation();
                    return 100;
                }
                return prev + step;
            });
        }, intervalTime);
    };

    const completeInstallation = async () => {
        try {
            await axios.post(`/api/v1/apps/${app._id}/download-count`);
            setStatus('INSTALLED');
            alert('Đã tải xong! Trình duyệt sẽ lưu file .txt chứa tên app.');
        } catch (err) {
            console.error("Lỗi khi hoàn tất cài đặt", err);
        }
    };

    const handleUninstall = () => {
        if (window.confirm("Bạn có chắc chắn muốn gỡ cài đặt ứng dụng này?")) {
            setStatus('IDLE');
            setProgress(0);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            alert(`Đã gửi đánh giá ${rating} sao với nội dung: ${comment}`);
            setComment('');
        } catch (err) {
            alert("Lỗi khi gửi đánh giá (Vui lòng đăng nhập và cài đặt app trước)");
        }
    };

    // --- HÀM XỬ LÝ LINK YOUTUBE ---
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    if (loading) return <div className={styles.container}>Đang tải...</div>;
    if (!app) return <div className={styles.container}>Không tìm thấy ứng dụng.</div>;

    return (
        <div className={styles.container}>

            {/* 1. Phần Header: Logic ẩn video bằng class css */}
            <div className={app.video ? styles.headerContent : styles.headerContentNoVideo}>
                <div className={styles.mainInfo}>
                    <img src={app.icon} alt={app.title} className={styles.icon} />
                    <div className={styles.details}>
                        <h1 className={styles.title}>{app.title}</h1>
                        <p className={styles.developer}>{app.developer}</p>

                        <div className={styles.stats}>
                            <span>⭐ {app.score?.toFixed(1) || '0.0'} ({app.reviews || 0} đánh giá)</span>
                            <span>📥 {app.minInstalls || 0} lượt tải</span>
                            <span>📦 {app.sizeMB || '50'} MB</span>
                        </div>

                        <div className={styles.actionArea}>
                            {status === 'IDLE' && (
                                <button className={styles.installBtn} onClick={handleInstall}>
                                    {app.price === 0 ? 'Cài đặt' : `Mua - ${app.price.toLocaleString('vi-VN')}đ`}
                                </button>
                            )}
                            {status === 'DOWNLOADING' && (
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                                </div>
                            )}
                            {status === 'INSTALLED' && (
                                <>
                                    <button className={styles.installBtn} style={{ backgroundColor: '#eee', color: '#333' }}>Mở</button>
                                    <button className={styles.uninstallBtn} onClick={handleUninstall}>Gỡ cài đặt</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CHỈ HIỂN THỊ VIDEO KHI CÓ DỮ LIỆU --- */}
                {app.video && (
                    <div className={styles.videoContainer}>
                        {app.video.includes('youtube') || app.video.includes('youtu.be') ? (
                            <iframe
                                className={styles.video}
                                src={getEmbedUrl(app.video)}
                                title="Trailer Ứng dụng"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video controls className={styles.video} poster={app.videoImage}>
                                <source src={app.video} type="video/mp4" />
                            </video>
                        )}
                    </div>
                )}
            </div>

            {/* 2. Slider Hình ảnh ứng dụng */}
            {app.screenshots && app.screenshots.length > 0 && (
                <>
                    <div className={styles.sectionTitle}>Hình ảnh ứng dụng</div>
                    <div className={styles.screenshotSection}>
                        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => scrollScreenshots('left')}>❮</button>
                        <div className={styles.screenshotWrapper} ref={screenshotRef}>
                            {app.screenshots.map((src, index) => (
                                <img key={index} src={src} alt={`Screenshot ${index}`} className={styles.screenshot} />
                            ))}
                        </div>
                        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => scrollScreenshots('right')}>❯</button>
                    </div>
                </>
            )}

            {/* 3. Giới thiệu ứng dụng */}
            <div className={styles.sectionTitle}>Giới thiệu ứng dụng</div>
            <div className={`${styles.introContent} ${!showFullDesc ? styles.collapsed : styles.expanded}`}>
                <p className={styles.description}>{app.description || 'Chưa có thông tin giới thiệu.'}</p>
            </div>
            <button className={styles.toggleBtn} onClick={() => setShowFullDesc(!showFullDesc)}>
                {showFullDesc ? 'Thu gọn' : 'Xem thêm'}
            </button>

            {/* 4. Đánh giá và Bình luận */}
            <div className={styles.sectionTitle}>Đánh giá từ người dùng</div>
            <div className={styles.ratingSummary}>
                <div className={styles.bigScore}>{app.score?.toFixed(1) || '0.0'}</div>
                <div className={styles.totalReviews}>Tổng cộng {app.reviews || 0} lượt đánh giá</div>
            </div>

            {status === 'INSTALLED' && (
                <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                    <h4 style={{ marginBottom: '10px' }}>Viết đánh giá của bạn</h4>
                    <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                style={{ color: star <= rating ? '#4CAF50' : '#ddd', cursor: 'pointer', fontSize: '28px' }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về ứng dụng này..."
                        className={styles.reviewInput}
                        required
                    />
                    <button type="submit" className={styles.installBtn}>Gửi đánh giá</button>
                </form>
            )}

            {/* Danh sách bình luận */}
            <div className={styles.reviewList}>

                {/* Chỉ lấy Review từ người dùng web (DB của bạn) */}
                {reviews.map(rev => (
                    <div key={rev._id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <span className={styles.reviewUser}>{rev.user?.fullName || 'Người dùng AppMarket'}</span>
                            <span className={styles.reviewStars}>{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className={styles.reviewComment}>{rev.comment}</p>
                    </div>
                ))}

                {/* Cập nhật lại logic báo trống review */}
                {reviews.length === 0 && (
                    <p style={{ color: '#666' }}>Chưa có đánh giá nào cho ứng dụng này. Hãy là người đầu tiên!</p>
                )}
            </div>

        </div>
    );
};

export default AppDetail;