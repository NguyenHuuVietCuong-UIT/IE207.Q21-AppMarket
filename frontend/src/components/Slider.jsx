import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Slider = ({ title, apps }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === 'left') current.scrollLeft -= 300;
        else current.scrollLeft += 300;
    };

    if (!apps || apps.length === 0) return null;

    return (
        <div className="mb-12 relative group">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

            {/* Nút cuộn Trái (Chỉ hiện khi hover vào group) */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 z-10 bg-white shadow-lg border border-gray-100 p-2 rounded-full text-gray-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Danh sách cuộn ngang */}
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-2 w-full">
                {apps.map((app, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(`/app/${app.id || index}`)}
                        className="app-card min-w-[160px] max-w-[160px]"
                    >
                        {/* Icon Ứng dụng */}
                        <img
                            src={app.image}
                            alt={app.title}
                            className="app-icon mb-3"
                        />
                        {/* Thông tin */}
                        <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{app.title}</h3>
                        <p className="text-sm text-gray-500 truncate mt-1">{app.developer}</p>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs font-medium text-gray-600">
                                <span className="mr-1">{app.rating}</span>
                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            </div>
                            <span className="text-sm font-bold text-primary">
                                {app.price === 0 ? 'Miễn phí' : `$${app.price}`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút cuộn Phải (Chỉ hiện khi hover vào group) */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 z-10 bg-white shadow-lg border border-gray-100 p-2 rounded-full text-gray-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default Slider;