import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, History, Settings, LogOut, Globe, Download, ShieldCheck } from 'lucide-react';

// Dữ liệu giả lập của người dùng
const MOCK_USER = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901 234 567',
    joinDate: '15/03/2026',
    avatar: 'https://i.pravatar.cc/150?img=11'
};

// Dữ liệu giả lập lịch sử mua hàng
const PURCHASE_HISTORY = [
    { id: 1, title: 'Tử Thần Đại Chiến - Bleach Mobile', date: '18/03/2026', price: 2.99, image: 'https://loremflickr.com/100/100/anime?lock=1' },
    { id: 6, title: 'Chỉnh Ảnh Pro', date: '10/03/2026', price: 9.99, image: 'https://loremflickr.com/100/100/camera?lock=6' },
];

const Profile = () => {
    const navigate = useNavigate();
    // State quản lý tab đang mở (info, history, settings)
    const [activeTab, setActiveTab] = useState('info');
    const [language, setLanguage] = useState('vi');

    const handleLogout = () => {
        alert('Đã đăng xuất thành công!');
        navigate('/login');
    };

    return (
        <div className="container-custom py-10">

            <div className="flex flex-col md:flex-row gap-8">

                {/* CỘT TRÁI: Menu Điều Hướng (Sidebar) */}
                <div className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
                        <img src={MOCK_USER.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4 shadow-md border-4 border-gray-50" />
                        <h2 className="text-2xl font-bold text-gray-900">{MOCK_USER.name}</h2>
                        <p className="text-gray-500 mb-2">{MOCK_USER.email}</p>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                            <ShieldCheck size={14} /> Đã xác thực
                        </span>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-lg font-medium transition ${activeTab === 'info' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <User size={24} /> Thông tin cá nhân
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-lg font-medium transition ${activeTab === 'history' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <History size={24} /> Lịch sử mua hàng
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-lg font-medium transition ${activeTab === 'settings' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Settings size={24} /> Cài đặt
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-4 text-lg font-medium text-red-500 hover:bg-red-50 transition border-t border-gray-100"
                        >
                            <LogOut size={24} /> Đăng xuất
                        </button>
                    </div>
                </div>

                {/* CỘT PHẢI: Nội dung chi tiết */}
                <div className="flex-1">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[500px]">

                        {/* Nội dung Tab: Thông tin cá nhân */}
                        {activeTab === 'info' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Thông tin cá nhân</h2>
                                <div className="space-y-6 max-w-xl">
                                    <div>
                                        <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider">Họ và tên</label>
                                        <div className="text-xl font-medium text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100">{MOCK_USER.name}</div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider">Địa chỉ Email</label>
                                        <div className="text-xl font-medium text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100">{MOCK_USER.email}</div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider">Số điện thoại</label>
                                        <div className="text-xl font-medium text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100">{MOCK_USER.phone}</div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider">Ngày tham gia</label>
                                        <div className="text-lg text-gray-600 p-2">{MOCK_USER.joinDate}</div>
                                    </div>
                                    <button className="px-8 py-3 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover transition shadow-md mt-4">
                                        Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Nội dung Tab: Lịch sử mua hàng */}
                        {activeTab === 'history' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Ứng dụng đã mua</h2>

                                {PURCHASE_HISTORY.length > 0 ? (
                                    <div className="space-y-4">
                                        {PURCHASE_HISTORY.map((item) => (
                                            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition gap-4">
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                                        <p className="text-gray-500 text-sm">Đã mua ngày: {item.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between w-full md:w-auto gap-6">
                                                    <span className="text-xl font-bold text-primary">${item.price}</span>
                                                    <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-100 transition shadow-sm">
                                                        <Download size={18} /> Tải lại
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500 text-lg">Bạn chưa mua ứng dụng nào.</div>
                                )}
                            </div>
                        )}

                        {/* Nội dung Tab: Cài đặt */}
                        {activeTab === 'settings' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Cài đặt hệ thống</h2>

                                <div className="max-w-xl">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Globe className="text-primary" /> Ngôn ngữ hiển thị
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setLanguage('vi')}
                                            className={`py-4 rounded-2xl font-bold text-lg transition border-2 ${language === 'vi' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                        >
                                            Tiếng Việt
                                        </button>
                                        <button
                                            onClick={() => setLanguage('en')}
                                            className={`py-4 rounded-2xl font-bold text-lg transition border-2 ${language === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                        >
                                            English
                                        </button>
                                    </div>

                                    <p className="text-gray-500 mt-4 text-sm">
                                        {language === 'vi' ? 'Giao diện sẽ được hiển thị bằng Tiếng Việt.' : 'The interface will be displayed in English.'}
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;