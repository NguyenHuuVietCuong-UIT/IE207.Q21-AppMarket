import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from '../components/Slider';

const Home = () => {
    // Tạo state để chứa dữ liệu thật và trạng thái chờ
    const [apps, setApps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Gọi API ngay khi trang vừa load xong
    useEffect(() => {
        const fetchApps = async () => {
            try {
                // LƯU Ý: Đổi số 5000 thành port Backend của bạn nếu nó khác nhé!
                const response = await axios.get('http://localhost:5000/api/apps');
                console.log("Dữ liệu từ Backend:", response.data.data);

                // Vì dữ liệu MongoDB dùng _id và imageUrls (mảng), 
                // ta cần map lại cho khớp với format mà component Slider đang cần
                const formattedData = response.data.map(app => ({
                    id: app._id,
                    title: app.title,
                    developer: app.developer,
                    rating: 4.5, // Backend chưa có rating nên tạm để 4.5
                    price: app.price,
                    image: app.imageUrls[0], // Lấy ảnh đầu tiên làm avatar vuông
                    type: app.type,
                    tags: app.tags
                }));

                setApps(formattedData);
                setIsLoading(false);
            } catch (error) {
                console.error("Lỗi khi kéo dữ liệu từ Backend:", error);
                setIsLoading(false);
            }
        };

        fetchApps();
    }, []);

    // Nếu đang gọi API thì hiện chữ Loading (Bạn có thể thay bằng icon xoay sau)
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Lọc dữ liệu cho từng Slider
    const games = apps.filter(app => app.type === 'Trò chơi').slice(0, 15);
    const paidApps = apps.filter(app => app.price > 0).slice(0, 15);
    const recommended = apps.slice(0, 15);

    return (
        <div className="container-custom py-8">

            {/* Hero Banner */}
            <div className="w-full h-[300px] md:h-[400px] rounded-[2rem] bg-gradient-to-r from-primary to-blue-400 mb-12 flex items-center p-10 text-white shadow-lg cursor-pointer hover:shadow-xl transition relative overflow-hidden">
                <div className="z-10 w-full md:w-1/2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">Ứng dụng nổi bật</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Khám phá thế giới giải trí bất tận</h1>
                    <p className="text-blue-100 text-lg mb-8">Hàng ngàn trò chơi và tiện ích đang chờ đón bạn.</p>
                    <button className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-50 transition">
                        Khám phá ngay
                    </button>
                </div>
                <img src="https://loremflickr.com/800/400/technology?lock=100" alt="Banner" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-50 mask-image-gradient" />
            </div>

            {/* Truyền dữ liệu THẬT vào các Sliders */}
            <Slider title="Đề xuất cho bạn" apps={recommended} />
            <Slider title="Trò chơi thịnh hành" apps={games} />
            <Slider title="Ứng dụng trả phí nổi bật" apps={paidApps} />

        </div>
    );
};

export default Home;