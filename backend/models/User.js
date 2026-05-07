const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Vui lòng nhập họ và tên'] // Yêu cầu lúc đăng nhập/đăng ký
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Cho phép null nếu đăng ký bằng SĐT
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Cho phép cập nhật/đăng ký bằng SĐT
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        select: false // Không trả về password khi query mặc định
    },
    // Quản lý ví/ngân hàng thanh toán (Chức năng phụ)
    paymentMethods: [{
        provider: { type: String, enum: ['MoMo', 'ZaloPay', 'VNPay', 'Bank'], required: true },
        accountNumber: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    }],
    // Các mã giảm giá người dùng đang sở hữu
    ownedPromotions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion'
    }]
}, { timestamps: true });

// Hash password trước khi lưu vào DB
// Hash password trước khi lưu vào DB (Đã bỏ tham số next)
userSchema.pre('save', async function () {
    // Nếu password không bị thay đổi (VD: chỉ cập nhật tên, sđt) thì bỏ qua
    if (!this.isModified('password')) return;

    // Tạo chuỗi salt và băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Tạo JWT Token cho User
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE // VD: '30d'
    });
};

// So sánh mật khẩu nhập vào với mật khẩu trong DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);