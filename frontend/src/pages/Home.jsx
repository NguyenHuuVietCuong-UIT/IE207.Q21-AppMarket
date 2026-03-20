import React from 'react';
import Slider from '../components/Slider';

// Dữ liệu giả (Mock Data) để test UI trước khi gọi Backend
const MOCK_APPS = [
    { id: 1, title: 'Tử Thần Đại Chiến', developer: 'Seireitei Games', rating: 4.8, price: 2.99, image: 'https://loremflickr.com/400/400/game?lock=1' },
    { id: 2, title: 'Sổ Tay Nhẫn Giả', developer: 'Konoha Studio', rating: 4.5, price: 0, image: 'https://loremflickr.com/400/400/ninja?lock=2' },
    { id: 3, title: 'Nông Sản Trace', developer: 'AgriTech VN', rating: 4.9, price: 0, image: 'https://loremflickr.com/400/400/farm?lock=3' },
    { id: 4, title: 'Đua Xe Tốc Độ', developer: 'VNG', rating: 4.2, price: 4.99, image: 'https://loremflickr.com/400/400/car?lock=4' },
    { id: 5, title: 'Học Tiếng Anh', developer: 'Edu Tech', rating: 4.7, price: 0, image: 'https://loremflickr.com/400/400/education?lock=5' },
    { id: 6, title: 'Chỉnh Ảnh Pro', developer: 'KMS', rating: 4.6, price: 9.99, image: 'https://loremflickr.com/400/400/camera?lock=6' },
    { id: 7, title: 'Bắn Súng Sinh Tồn', developer: 'Garena', rating: 4.3, price: 0, image: 'https://loremflickr.com/400/400/gun?lock=7' },
];

const Home = () => {
    return (
        <div className="container-custom py-8">

            {/* Hero Banner (Nổi bật) */}
            <div className="w-full h-[300px] md:h-[400px] rounded-[2rem] bg-gradient-to-r from-primary to-blue-400 mb-12 flex items-center p-10 text-white shadow-lg cursor-pointer hover:shadow-xl transition relative overflow-hidden">
                <div className="z-10 w-full md:w-1/2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">Ứng dụng nổi bật</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Khám phá thế giới giải trí bất tận</h1>
                    <p className="text-blue-100 text-lg mb-8">Hàng ngàn trò chơi và tiện ích đang chờ đón bạn.</p>
                    <button className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-50 transition">
                        Khám phá ngay
                    </button>
                </div>
                {/* Hình minh họa cho Banner */}
                <img src="https://loremflickr.com/800/400/technology?lock=100" alt="Banner" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-50 mask-image-gradient" />
            </div>

            {/* Các Sliders */}
            <Slider title="Đề xuất cho bạn" apps={MOCK_APPS} />
            <Slider title="Trò chơi thịnh hành" apps={MOCK_APPS.slice().reverse()} />
            <Slider title="Ứng dụng trả phí nổi bật" apps={MOCK_APPS.filter(a => a.price > 0)} />

        </div>
    );
};

export default Home;