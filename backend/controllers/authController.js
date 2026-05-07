const userDAO = require('../daos/userDAO');
const User = require('../models/User'); // Import model User để dùng cho Login an toàn

// Hàm phụ trợ tạo và gửi JWT Token
const sendTokenResponse = (user, statusCode, res) => {
    // KHIẾM KHUYẾT 1: Nếu thiếu JWT_SECRET trong file .env, server sẽ crash ở dòng này
    if (!process.env.JWT_SECRET) {
        console.error("🚨 LỖI NGHIÊM TRỌNG: Bạn chưa cấu hình JWT_SECRET trong file .env của backend!");
        return res.status(500).json({ success: false, message: 'Lỗi cấu hình Server (Thiếu JWT_SECRET)' });
    }

    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone
        }
    });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Email hoặc Số điện thoại' });
        }

        if (email) {
            const existingEmail = await userDAO.findByEmail(email);
            if (existingEmail) return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        if (phone) {
            const existingPhone = await userDAO.findByPhone(phone);
            if (existingPhone) return res.status(400).json({ success: false, message: 'Số điện thoại đã được sử dụng' });
        }

        // KHIẾM KHUYẾT 2: Nếu email hoặc phone là undefined, đưa thẳng vào Mongoose sẽ dễ gây lỗi 11000 Duplicate Key.
        // Cách fix: Lọc data sạch sẽ trước khi lưu
        const userData = { fullName, password };
        if (email) userData.email = email;
        if (phone) userData.phone = phone;

        // Tạo user
        const user = await userDAO.createUser(userData);

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("❌ LỖI API ĐĂNG KÝ:", error); // In lỗi đỏ chót ra Terminal để dễ fix
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký', error: error.message });
    }
};

// @desc    Đăng nhập
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu' });
        }

        const isEmail = identifier.includes('@');

        // KHIẾM KHUYẾT 3: Vì ở Schema bạn đặt `select: false` cho trường password.
        // Nên nếu dùng DAO mặc định, Mongoose sẽ che giấu password. 
        // Khi gọi user.matchPassword(), nó sẽ báo lỗi undefined sập server.
        // Cách fix: Sử dụng .select('+password') để ép Mongoose nhả password ra check.

        const query = isEmail ? { email: identifier } : { phone: identifier };
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("❌ LỖI API ĐĂNG NHẬP:", error);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập', error: error.message });
    }
};