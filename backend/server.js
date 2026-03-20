const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// 1. Nạp các biến môi trường từ file .env
dotenv.config();

// 2. Gọi hàm kết nối Database MongoDB Atlas
connectDB();

// 3. Khởi tạo ứng dụng Express
const app = express();

// 4. Cấu hình Middlewares cơ bản
app.use(cors()); // Cho phép frontend (React.js) ở port khác gọi API mà không bị chặn
app.use(express.json()); // Giúp server đọc được dữ liệu định dạng JSON gửi từ client

// 5. Khai báo (Import) các file Routes
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const orderRoutes = require('./routes/orderRoutes');

// 6. Gắn Routes vào các điểm cuối (Endpoints) tương ứng
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/orders', orderRoutes);

// 7. Route kiểm tra server cơ bản
app.get('/', (req, res) => {
    res.send('API App Store đang chạy cực kỳ mượt mà...');
});

// 8. Gọi Middleware xử lý lỗi ở ĐÂY (Ngay trước app.listen)
app.use(errorHandler);

// 9. Lắng nghe và khởi chạy Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});