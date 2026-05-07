const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(express.json()); // Xử lý body dạng JSON
app.use(cors()); // Cho phép Frontend gọi API không bị lỗi Cross-Origin

// Kết nối cơ sở dữ liệu MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Lỗi kết nối MongoDB: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

// --- IMPORT CÁC ROUTES ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appRoutes = require('./routes/appRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const walletRoutes = require('./routes/walletRoutes');

// --- MOUNT CÁC ROUTES VÀO URL ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/apps', appRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wallet', walletRoutes);

// Route mặc định kiểm tra health check
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API AppMarket (IE207.Q21)');
});

// Middleware xử lý lỗi (Bắt các lỗi 404 hoặc lỗi không xác định)
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Đường dẫn không tồn tại' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT} ở chế độ ${process.env.NODE_ENV || 'development'}`);
});