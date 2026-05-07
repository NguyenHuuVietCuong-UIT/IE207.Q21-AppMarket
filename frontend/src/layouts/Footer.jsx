import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.brand}>
                    <h3>AppMarket</h3>
                    <p>Nền tảng tải và trải nghiệm hàng ngàn ứng dụng, trò chơi hấp dẫn nhất.</p>
                </div>

                <div className={styles.links}>
                    <div className={styles.linkGroup}>
                        <h4>Khám phá</h4>
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/search">Tìm kiếm ứng dụng</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Hỗ trợ</h4>
                        <ul>
                            <li><Link to="/history">Lịch sử tải xuống</Link></li>
                            <li><Link to="/payment">Thanh toán & Khuyến mãi</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                &copy; 2026 AppMarket - Đồ án MERN Stack.
            </div>
        </footer>
    );
};

export default Footer;