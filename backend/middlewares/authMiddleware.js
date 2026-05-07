const jwt = require('jsonwebtoken');
const userDAO = require('../daos/userDAO');

exports.protect = async (req, res, next) => {
    let token;

    // Lấy token từ header Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Không có quyền truy cập, vui lòng đăng nhập' });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thông tin user từ DAO và gán vào req.user để các controller khác sử dụng
        req.user = await userDAO.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};