import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

const PurchaseModal = ({ isOpen, onClose, app }) => {
    if (!isOpen || !app) return null;

    return (
        // Lớp phủ nền đen mờ (Overlay)
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">

            {/* Khung Modal */}
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">Xác nhận thanh toán</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition bg-white rounded-full p-1 shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Nội dung Modal */}
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <img src={app.image} alt={app.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">{app.title}</h4>
                            <p className="text-sm text-gray-500">{app.developer}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6">
                        <div className="flex justify-between">
                            <span>Giá ứng dụng:</span>
                            <span className="font-semibold text-gray-900">${app.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Thuế (VAT):</span>
                            <span className="font-semibold text-gray-900">$0.00</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-primary mt-2 pt-2 border-t border-gray-100">
                            <span>Tổng cộng:</span>
                            <span>${app.price}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-green-600 mb-6 bg-green-50 p-3 rounded-lg">
                        <ShieldCheck size={16} />
                        <span>Thanh toán an toàn & được bảo mật bởi App Market.</span>
                    </div>

                    {/* Nút thao tác */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-full font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={() => {
                                alert(`Cảm ơn bạn đã mua ${app.title}! (Tính năng đang phát triển)`);
                                onClose();
                            }}
                            className="flex-1 py-3 px-4 rounded-full font-bold text-white bg-primary hover:bg-primary-hover transition shadow-md hover:shadow-lg"
                        >
                            Thanh toán ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;