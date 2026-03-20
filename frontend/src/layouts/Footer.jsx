import React from 'react';
import { PlayCircle, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8 mt-auto">
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Cột 1: Logo & Giới thiệu */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                            <PlayCircle size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">App Market</span>
                    </div>
                    <p className="text-gray-500 text-sm md:w-3/4 leading-relaxed">
                        Nền tảng phân phối ứng dụng và trò chơi hiện đại, an toàn và dễ sử dụng nhất dành cho mọi lứa tuổi.
                    </p>
                </div>

                {/* Cột 2: Đường dẫn nổi bật */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Khám phá</h4>
                    <ul className="space-y-3 text-gray-500 text-sm">
                        <li><a href="#" className="hover:text-primary transition">Về chúng tôi</a></li>
                        <li><a href="#" className="hover:text-primary transition">Chính sách bảo mật</a></li>
                        <li><a href="#" className="hover:text-primary transition">Điều khoản dịch vụ</a></li>
                    </ul>
                </div>

                {/* Cột 3: Liên hệ & Mạng xã hội */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
                    <p className="text-gray-500 text-sm mb-4">hotro@appmarket.vn</p>
                    <div className="flex gap-4 text-gray-400">
                        <a href="#" className="hover:text-primary transition"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-primary transition"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-primary transition"><Instagram size={20} /></a>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="container-custom mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} App Market. Đồ án ReactJS & Node.js.
            </div>
        </footer>
    );
};

export default Footer;