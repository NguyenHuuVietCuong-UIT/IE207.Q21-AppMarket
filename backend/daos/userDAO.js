const User = require('../models/User');

class UserDAO {
    // Tìm người dùng theo Email
    async findByEmail(email) {
        // Sử dụng .select('+password') vì trong schema ta đã set select: false cho password
        return await User.findOne({ email }).select('+password');
    }

    // Tìm người dùng theo Số điện thoại
    async findByPhone(phone) {
        return await User.findOne({ phone }).select('+password');
    }

    // Tạo người dùng mới
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    // Tìm người dùng theo ID (Dùng cho middleware xác thực JWT)
    async findById(userId) {
        return await User.findById(userId);
    }

    //Cập nhật thông tin cơ bản (Không dùng cho password)
    async updateUserInfo(userId, updateData) {
        // new: true để trả về document sau khi đã update
        // runValidators: true để chạy lại các ràng buộc (ví dụ: fullName không được rỗng)
        return await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        });
    }

    //Tìm user kèm password để xử lý đổi mật khẩu
    async findByIdWithPassword(userId) {
        return await User.findById(userId).select('+password');
    }
}

module.exports = new UserDAO();