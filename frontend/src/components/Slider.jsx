import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Slider.module.css';

const Slider = ({ title, apps }) => {
    const navigate = useNavigate();
    const trackRef = useRef(null);

    // Trạng thái hiển thị mũi tên
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Giới hạn tối đa 50 app theo yêu cầu
    const displayApps = apps.slice(0, 50);

    // Hàm kiểm tra vị trí cuộn để ẩn/hiện mũi tên
    const checkScroll = () => {
        if (trackRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Sai số 1px để tránh bug trên một số trình duyệt
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    // Cập nhật mũi tên khi load lần đầu hoặc khi apps thay đổi
    useEffect(() => {
        checkScroll();
        // Lắng nghe sự kiện resize cửa sổ để tính toán lại mũi tên
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [apps]);

    // Hàm xử lý khi nhấn nút mũi tên
    const scroll = (direction) => {
        if (trackRef.current) {
            const scrollAmount = direction === 'left' ? -600 : 600; // Mỗi lần trượt đi khoảng 4-5 app
            trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!displayApps || displayApps.length === 0) return null;

    return (
        <section className={styles.sliderSection}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.sliderContainer}>
                {/* Nút Trái */}
                {canScrollLeft && (
                    <button className={`${styles.navButton} ${styles.btnLeft}`} onClick={() => scroll('left')}>
                        &#10094; {/* Icon mũi tên trái */}
                    </button>
                )}

                {/* Thanh trượt chứa các app */}
                <div className={styles.trackWrapper} ref={trackRef} onScroll={checkScroll}>
                    <div className={styles.track}>
                        {displayApps.map((app) => (
                            // Sửa dòng onClick trong thẻ appCard
                            <div
                                key={app._id}
                                className={styles.appCard}
                                onClick={() => navigate(`/app/${encodeURIComponent(app.title)}`)} // Dùng title thay vì _id
                            >
                                <img src={app.icon} alt={app.title} className={styles.appIcon} />
                                <div className={styles.appTitle}>{app.title}</div>
                                <div className={styles.appDeveloper}>{app.developer}</div>
                                <div className={styles.appRating}>
                                    <span>★</span> {app.score ? app.score.toFixed(1) : 'Chưa có'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Phải */}
                {canScrollRight && (
                    <button className={`${styles.navButton} ${styles.btnRight}`} onClick={() => scroll('right')}>
                        &#10095; {/* Icon mũi tên phải */}
                    </button>
                )}
            </div>
        </section>
    );
};

export default Slider;