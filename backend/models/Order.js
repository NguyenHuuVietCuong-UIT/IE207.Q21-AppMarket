const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App',
        required: true
    },
    amount: { type: Number, required: true }, // Lưu lại giá tiền tại thời điểm mua
    status: {
        type: String,
        default: 'completed' // Để đơn giản hóa đồ án, ta giả định giao dịch luôn thành công
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);