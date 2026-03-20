import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, PlayCircle, User } from 'lucide-react';

const Login = () => {
    // State để chuyển đổi giữa form Đăng nhập và form Đăng ký
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Giả lập quá trình gọi API và đăng nhập thành công
        alert(isRegister ? "Đăng ký thành công! Đang chuyển hướng..." : "Đăng nhập thành công! Đang chuyển hướng...");
        navigate('/'); // Đưa người dùng về lại trang chủ
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 relative">

            {/* Nút Quay lại Trang chủ nằm ở góc trên cùng bên trái */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
                <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition font-semibold">
                    <ArrowLeft size={24} /> Quay lại
                </Link>
            </div>

            {/* Khung Form trung tâm */}
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Tiêu đề & Logo */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-5 shadow-md">
                        <PlayCircle size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {isRegister ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-base">
                        {isRegister ? 'Đăng ký để tải xuống hàng ngàn ứng dụng' : 'Đăng nhập để tiếp tục khám phá App Market'}
                    </p>
                </div>

                {/* Form nhập liệu */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Ô Họ tên (Chỉ hiện khi Đăng ký) */}
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Nhập họ và tên..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-gray-900 text-lg"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Ô Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-gray-900 text-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Ô Mật khẩu */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-gray-900 text-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Quên mật khẩu (Chỉ hiện khi Đăng nhập) */}
                    {!isRegister && (
                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-sm font-bold text-primary hover:text-primary-hover transition">Quên mật khẩu?</a>
                        </div>
                    )}

                    {/* Nút Submit */}
                    <button
                        type="submit"
                        className="w-full py-4 mt-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition shadow-md hover:shadow-lg text-lg flex justify-center items-center gap-2"
                    >
                        {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập ngay'}
                    </button>
                </form>

                {/* Chuyển đổi trạng thái Đăng nhập / Đăng ký */}
                <div className="mt-8 text-center text-gray-600 text-base">
                    {isRegister ? 'Bạn đã có tài khoản? ' : 'Bạn chưa có tài khoản? '}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="font-bold text-primary hover:text-primary-hover transition underline-offset-4 hover:underline"
                    >
                        {isRegister ? 'Đăng nhập' : 'Đăng ký tại đây'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;