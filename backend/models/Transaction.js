const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppItem',
        required: true
    },
    type: {
        type: String,
        enum: ['DOWNLOAD', 'PURCHASE'], // DOWNLOAD cho app free, PURCHASE cho app tốn phí
        required: true
    },
    priceAtPurchase: {
        type: Number,
        required: true,
        default: 0
    },
    // Lưu lại mã giảm giá đã dùng (nếu có)
    appliedPromotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion'
    },
    finalAmount: {
        type: Number,
        required: true // Số tiền thực tế phải trả sau khi áp mã
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'UNINSTALLED'],
        default: 'SUCCESS'
        // UNINSTALLED: Đánh dấu khi người dùng nhấn nút gỡ cài đặt (quay về trạng thái Cài đặt)
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);