import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Download, Share2, MessageCircle } from 'lucide-react';
import PurchaseModal from '../components/PurchaseModal';
import Slider from '../components/Slider';

// Dữ liệu giả định cho trang chi tiết
const MOCK_DETAIL = {
    id: 1,
    title: 'Tử Thần Đại Chiến - Bleach Mobile',
    developer: 'Seireitei Games',
    rating: 4.8,
    reviewsCount: '12.5K',
    price: 2.99,
    image: 'https://loremflickr.com/400/400/anime?lock=1',
    screenshots: [
        'https://loremflickr.com/800/400/game?lock=10',
        'https://loremflickr.com/800/400/game?lock=11',
        'https://loremflickr.com/800/400/game?lock=12',
    ],
    description: 'Trải nghiệm thế giới anime nhập vai cực đỉnh với Tử Thần Đại Chiến. Thu thập các thẻ bài nhân vật mạnh mẽ, nâng cấp kỹ năng và tham gia vào các trận chiến PvP thời gian thực nảy lửa. Đồ họa 3D sống động cùng hiệu ứng kỹ năng mãn nhãn chắc chắn sẽ làm hài lòng các fan hâm mộ.',
    comments: [
        { user: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', text: 'Game đồ họa cực đẹp, đánh rất sướng tay!', star: 5 },
        { user: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Nạp hơi chát nhưng bù lại sự kiện nhiều.', star: 4 },
    ]
};

// Dữ liệu giả cho slider "Ứng dụng liên quan"
const RELATED_APPS = [
    { id: 10, title: 'Hải Tặc Đại Chiến', developer: 'Anime Studio', rating: 4.5, price: 0, image: 'https://loremflickr.com/400/400/ninja?lock=20' },
    { id: 11, title: 'Đấu Trường Chân Lý', developer: 'Riot Games', rating: 4.9, price: 0, image: 'https://loremflickr.com/400/400/fight?lock=21' },
    { id: 12, title: 'Sát Thủ Bóng Đêm', developer: 'KMS', rating: 4.2, price: 1.99, image: 'https://loremflickr.com/400/400/sword?lock=22' },
    { id: 13, title: 'Anh Hùng AFK', developer: 'VNG', rating: 4.6, price: 0, image: 'https://loremflickr.com/400/400/hero?lock=23' },
];

const AppDetail = () => {
    const { id } = useParams(); // Lấy ID từ thanh địa chỉ (ví dụ: /app/1)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Kéo trang lên đầu mỗi khi chuyển sang app khác
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleAction = () => {
        if (MOCK_DETAIL.price === 0) {
            alert(`Đang tải xuống ${MOCK_DETAIL.title}...`);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="container-custom py-10">

            {/* 1. Phần Đầu: Thông tin chung & Nút Mua */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <img src={MOCK_DETAIL.image} alt={MOCK_DETAIL.title} className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] object-cover shadow-md" />

                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{MOCK_DETAIL.title}</h1>
                    <p className="text-lg text-primary font-medium mb-4">{MOCK_DETAIL.developer}</p>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center flex-col">
                            <span className="text-xl font-bold text-gray-900 flex items-center gap-1">{MOCK_DETAIL.rating} <Star size={20} className="fill-yellow-400 text-yellow-400" /></span>
                            <span className="text-sm text-gray-500">{MOCK_DETAIL.reviewsCount} Đánh giá</span>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div> {/* Đường gạch dọc */}
                        <div className="flex items-center flex-col">
                            <span className="text-xl font-bold text-gray-900">100K+</span>
                            <span className="text-sm text-gray-500">Lượt tải</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAction}
                            className="flex-1 md:flex-none px-10 py-3 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {MOCK_DETAIL.price === 0 ? (
                                <><Download size={20} /> Tải miễn phí</>
                            ) : (
                                `Mua ngay $${MOCK_DETAIL.price}`
                            )}
                        </button>
                        <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Phần Hình ảnh Mô tả (Gallery) */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hình ảnh</h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                    {MOCK_DETAIL.screenshots.map((img, idx) => (
                        <img key={idx} src={img} alt="Screenshot" className="w-[280px] md:w-[400px] h-[160px] md:h-[225px] object-cover rounded-2xl shadow-sm border border-gray-100 flex-shrink-0" />
                    ))}
                </div>
            </div>

            {/* 3. Phần Mô tả chi tiết */}
            <div className="mb-12 bg-gray-50 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Về ứng dụng này</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{MOCK_DETAIL.description}</p>
            </div>

            {/* 4. Phần Đánh giá & Bình luận */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageCircle className="text-primary" /> Đánh giá từ người dùng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_DETAIL.comments.map((comment, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                            <img src={comment.avatar} alt={comment.user} className="w-12 h-12 rounded-full" />
                            <div>
                                <h4 className="font-bold text-gray-900">{comment.user}</h4>
                                <div className="flex text-yellow-400 mb-2">
                                    {[...Array(comment.star)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                                </div>
                                <p className="text-gray-600 text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Ứng dụng liên quan (Tái sử dụng Slider) */}
            <div className="border-t border-gray-200 pt-12">
                <Slider title="Có thể bạn cũng thích" apps={RELATED_APPS} />
            </div>

            {/* Modal Thanh Toán */}
            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                app={MOCK_DETAIL}
            />

        </div>
    );
};

export default AppDetail;