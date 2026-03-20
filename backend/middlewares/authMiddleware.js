const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem header có chứa token với định dạng "Bearer <token>" không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ chuỗi
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token để lấy ID người dùng
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user trong database và gắn vào req (loại bỏ field password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp vào Controller
        } catch (error) {
            res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Không có quyền truy cập, vui lòng đăng nhập' });
    }
};

module.exports = { protect };