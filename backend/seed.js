const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// Load các biến môi trường từ file .env (Đảm bảo bạn có file .env chứa MONGO_URI)
dotenv.config();

// Load Model
const AppItem = require('./models/AppItem');

// Đọc file JSON vừa cào được
const appsData = JSON.parse(
    fs.readFileSync('./apps-mock-data.json', 'utf-8')
);

const importData = async () => {
    try {
        // Kết nối tới Database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB thành công!');

        // Xoá toàn bộ dữ liệu cũ trong collection apps để tránh trùng lặp khi chạy lại seed nhiều lần
        await AppItem.deleteMany();
        console.log('Đã xoá dữ liệu cũ của AppItem!');

        // Đẩy mảng JSON vào database
        await AppItem.insertMany(appsData);
        console.log('Đã import thành công toàn bộ dữ liệu ứng dụng vào DB!');

        process.exit();
    } catch (error) {
        console.error('Lỗi khi import dữ liệu:', error);
        process.exit(1);
    }
};

importData();