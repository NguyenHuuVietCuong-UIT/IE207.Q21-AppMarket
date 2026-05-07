// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from '../components/Slider';
import styles from './Home.module.css';

const Home = () => {
    const [sliderData, setSliderData] = useState({ topRated: [], topToday: [], topTotal: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await axios.get('/api/v1/apps/sliders');
                if (response.data.success) {
                    setSliderData(response.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    if (loading) return <div className={styles.loading}>Đang tải dữ liệu ứng dụng...</div>;

    return (
        <div className={styles.homeContainer}>
            <Slider
                title="Đề xuất cho bạn (Đánh giá cao nhất)"
                apps={sliderData.topRated}
            />

            <Slider
                title="Ứng dụng được tải nhiều nhất hôm nay"
                apps={sliderData.topToday}
            />

            <Slider
                title="Ứng dụng được tải nhiều nhất"
                apps={sliderData.topTotal}
            />
        </div>
    );
};

export default Home;