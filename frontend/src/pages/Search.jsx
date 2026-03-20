import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Star } from 'lucide-react';

// Dữ liệu giả định để test tính năng Lọc
const MOCK_DATA = [
    { id: 1, title: 'Tử Thần Đại Chiến', type: 'game', tags: ['Hành động', 'Anime'], price: 2.99, rating: 4.8, image: 'https://loremflickr.com/400/400/anime?lock=1' },
    { id: 2, title: 'Sổ Tay Nhẫn Giả', type: 'app', tags: ['Giáo dục'], price: 0, rating: 4.5, image: 'https://loremflickr.com/400/400/ninja?lock=2' },
    { id: 3, title: 'Đua Xe Tốc Độ', type: 'game', tags: ['Thể thao'], price: 4.99, rating: 4.2, image: 'https://loremflickr.com/400/400/car?lock=4' },
    { id: 4, title: 'Bắn Súng Sinh Tồn', type: 'game', tags: ['Hành động', 'Bắn súng'], price: 0, rating: 4.3, image: 'https://loremflickr.com/400/400/gun?lock=7' },
    { id: 5, title: 'Học Tiếng Anh', type: 'app', tags: ['Giáo dục'], price: 0, rating: 4.9, image: 'https://loremflickr.com/400/400/education?lock=5' },
    { id: 6, title: 'Chỉnh Ảnh Pro', type: 'app', tags: ['Tiện ích'], price: 9.99, rating: 4.6, image: 'https://loremflickr.com/400/400/camera?lock=6' },
    { id: 7, title: 'Nghe Nhạc Chill', type: 'app', tags: ['Âm nhạc'], price: 0, rating: 4.7, image: 'https://loremflickr.com/400/400/music?lock=8' },
    { id: 8, title: 'Đế Chế Chiến Thuật', type: 'game', tags: ['Chiến thuật'], price: 1.99, rating: 4.1, image: 'https://loremflickr.com/400/400/strategy?lock=9' },
];

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy từ khóa từ thanh địa chỉ (ví dụ: ?q=bắn súng)
    const initialQuery = searchParams.get('q') || '';

    // Các state để lưu trữ bộ lọc
    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [activeType, setActiveType] = useState('all'); // all, game, app
    const [activePrice, setActivePrice] = useState('all'); // all, free, paid

    // Cập nhật lại search term nếu URL thay đổi
    useEffect(() => {
        setSearchTerm(searchParams.get('q') || '');
    }, [searchParams]);

    // Logic lọc dữ liệu giả định
    const filteredApps = MOCK_DATA.filter(app => {
        const matchSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchType = activeType === 'all' || app.type === activeType;
        const matchPrice = activePrice === 'all' ||
            (activePrice === 'free' && app.price === 0) ||
            (activePrice === 'paid' && app.price > 0);
        return matchSearch && matchType && matchPrice;
    });

    return (
        <div className="container-custom py-8 md:py-12">

            {/* Khung tìm kiếm to nằm trên cùng */}
            <div className="max-w-3xl mx-auto mb-12">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Khám phá Ứng dụng & Trò chơi</h1>
                <div className="flex items-center bg-white rounded-full px-6 py-4 shadow-md border border-gray-100 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition">
                    <SearchIcon size={24} className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Bạn đang tìm kiếm gì hôm nay? (Ví dụ: Hành động, Tiện ích...)"
                        className="bg-transparent border-none outline-none flex-1 text-lg text-gray-900"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10">

                {/* CỘT TRÁI: Bộ lọc (Sidebar) */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Filter className="text-primary" /> Bộ lọc
                        </h2>

                        {/* Lọc theo Loại */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wider">Phân loại</h3>
                            <div className="space-y-3">
                                {['all', 'game', 'app'].map(type => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={activeType === type}
                                            onChange={() => setActiveType(type)}
                                            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <span className="text-lg text-gray-700 group-hover:text-primary transition">
                                            {type === 'all' ? 'Tất cả' : type === 'game' ? 'Trò chơi' : 'Ứng dụng'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Lọc theo Giá */}
                        <div>
                            <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wider">Giá tiền</h3>
                            <div className="space-y-3">
                                {['all', 'free', 'paid'].map(price => (
                                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={activePrice === price}
                                            onChange={() => setActivePrice(price)}
                                            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <span className="text-lg text-gray-700 group-hover:text-primary transition">
                                            {price === 'all' ? 'Mọi mức giá' : price === 'free' ? 'Miễn phí' : 'Trả phí'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* CỘT PHẢI: Kết quả tìm kiếm (Grid) */}
                <div className="flex-1">
                    <div className="mb-6 flex justify-between items-end">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchTerm ? `Kết quả cho "${searchTerm}"` : 'Tất cả kết quả'}
                        </h2>
                        <span className="text-gray-500 font-medium">{filteredApps.length} ứng dụng</span>
                    </div>

                    {filteredApps.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {filteredApps.map((app) => (
                                <div
                                    key={app.id}
                                    onClick={() => navigate(`/app/${app.id}`)}
                                    className="app-card"
                                >
                                    <img src={app.image} alt={app.title} className="app-icon mb-4" />
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{app.title}</h3>
                                    <p className="text-sm text-gray-500 truncate mt-1">{app.tags.join(', ')}</p>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center text-sm font-medium text-gray-600">
                                            <span className="mr-1">{app.rating}</span>
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <span className="text-base font-bold text-primary">
                                            {app.price === 0 ? 'Miễn phí' : `$${app.price}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <div className="text-gray-400 mb-4 flex justify-center"><SearchIcon size={48} /></div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy kết quả nào</h3>
                            <p className="text-gray-500">Thử điều chỉnh lại từ khóa hoặc bộ lọc xem sao.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Search;