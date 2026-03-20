const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị này
        default: 'user'
    },
    purchasedApps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App' // Khóa ngoại liên kết tới bảng App
    }]
}, {
    timestamps: true // Tự động sinh ra 2 trường: createdAt và updatedAt
});

module.exports = mongoose.model('User', userSchema);