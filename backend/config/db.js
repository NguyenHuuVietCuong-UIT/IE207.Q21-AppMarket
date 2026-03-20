const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Kết nối với database
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // In ra terminal để biết đã kết nối thành công tới Cluster nào
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // In ra lỗi nếu sai mật khẩu, sai IP hoặc rớt mạng
        console.error(`Lỗi kết nối MongoDB: ${error.message}`);

        // Dừng server ngay lập tức nếu không có database (1 nghĩa là thoát với lỗi)
        process.exit(1);
    }
};

module.exports = connectDB;