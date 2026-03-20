const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    title: { type: String, required: true },
    developer: { type: String },
    price: { type: Number, default: 0 },
    imageUrls: [{ type: String }],
    description: { type: String },

    // 1. Thêm trường Phân loại chính (Chỉ nhận 1 trong 2 giá trị)
    type: {
        type: String,
        required: true,
        enum: ['Ứng dụng', 'Trò chơi'],
        default: 'Ứng dụng'
    },

    // 2. Thêm trường Tags (Là một mảng chứa nhiều từ khóa)
    tags: [{
        type: String
    }]

}, { timestamps: true });

module.exports = mongoose.model('App', appSchema);