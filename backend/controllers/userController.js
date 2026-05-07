const userDAO = require('../daos/userDAO');

// @desc    Lấy thông tin cá nhân của user đang đăng nhập
// @route   GET /api/v1/users/profile
exports.getProfile = async (req, res) => {
    try {
        // req.user đã được gán từ middleware protect
        const user = await userDAO.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin cá nhân', error: error.message });
    }
};

// @desc    Cập nhật thông tin cá nhân (Họ tên, Số điện thoại)
// @route   PUT /api/v1/users/profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phone } = req.body;
        const userId = req.user._id;

        // 1. Nếu có cập nhật số điện thoại, phải kiểm tra xem SĐT đó có ai dùng chưa
        if (phone) {
            const existingPhoneUser = await userDAO.findByPhone(phone);
            // Nếu có người dùng SĐT này VÀ ID của người đó khác với ID của user hiện tại
            if (existingPhoneUser && existingPhoneUser._id.toString() !== userId.toString()) {
                return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác' });
            }
        }

        // 2. Tạo object chứa dữ liệu cần update
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (phone) updateFields.phone = phone;

        // 3. Thực hiện update qua DAO
        const updatedUser = await userDAO.updateUserInfo(userId, updateFields);

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin', error: error.message });
    }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/v1/users/change-password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới' });
        }

        // 1. Lấy user từ DB (phải lấy kèm password để so sánh)
        const user = await userDAO.findByIdWithPassword(userId);

        // 2. So sánh mật khẩu hiện tại người dùng nhập vào có khớp với DB không
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
        }

        // 3. Gán mật khẩu mới (Mongoose pre-save hook sẽ tự động hash nó)
        user.password = newPassword;
        await user.save();

        // 4. Tạo token mới (Tùy chọn: giúp user không bị văng ra sau khi đổi pass, hoặc bắt đăng nhập lại)
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công',
            token
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi đổi mật khẩu', error: error.message });
    }
};