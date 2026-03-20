const mongoose = require('mongoose');
require('dotenv').config(); // Để lấy biến môi trường MONGO_URI

// ĐIỀU CHỈNH ĐƯỜNG DẪN NÀY ĐẾN FILE MODEL CỦA BẠN CHO ĐÚNG NHÉ
const App = require('./models/App');

// 1. Kho dữ liệu thô để xào nấu
const gameNames = ['Chiến Binh', 'Tử Thần', 'Đua Xe', 'Vua Hải Tặc', 'Thợ Săn', 'Bóng Đá', 'Đế Chế', 'Sinh Tồn', 'Ninja', 'Cờ Vua', 'Xếp Hình', 'Bắn Súng', 'Đột Kích', 'Nông Trại'];
const appNames = ['Sổ Tay', 'Dịch Thuật', 'Quản Lý', 'Chụp Ảnh', 'Báo Thức', 'Tài Chính', 'Lịch', 'Tập Thể Dục', 'Chỉnh Ảnh', 'Học Từ Vựng', 'Bản Đồ', 'Nghe Nhạc', 'Xem Phim', 'Quét Mã'];
const developers = ['VNG', 'Garena', 'FPT', 'Viettel', 'KMS', 'Tencent', 'Gameloft', 'VTC', 'Konoha Studio', 'AgriTech VN', 'CodeWizards'];
const gameTags = ['hành động', 'nhập vai', 'thể thao', 'giải đố', 'đua xe', 'chiến thuật', 'bắn súng', 'sinh tồn', 'anime', 'trí tuệ'];
const appTags = ['tiện ích', 'giáo dục', 'năng suất', 'sức khỏe', 'tài chính', 'nhiếp ảnh', 'giải trí', 'mạng xã hội', 'đời sống'];

// Hàm random số nguyên
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Hàm lấy random 1 phần tử trong mảng
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];

// 2. Hàm tạo ra 100 dữ liệu giả
const generateFakeData = (amount) => {
    const fakeData = [];

    for (let i = 1; i <= amount; i++) {
        const isGame = Math.random() > 0.4; // 60% là Game, 40% là App
        const type = isGame ? 'Trò chơi' : 'Ứng dụng';

        // Tạo tên ngẫu nhiên
        const prefix = isGame ? randomItem(gameNames) : randomItem(appNames);
        const suffix = ['Pro', 'Max', '2026', 'Ultra', '3D', 'Plus', 'Online', 'Vô Cực', 'Huyền Thoại'][randomInt(0, 8)];
        const title = `${prefix} ${suffix}`;

        // Random Tags (Lấy 2-3 tags)
        const sourceTags = isGame ? gameTags : appTags;
        const tags = [randomItem(sourceTags), randomItem(sourceTags)];

        // Tạo giá tiền (40% miễn phí, còn lại có phí)
        const prices = [0, 0, 0, 0.99, 1.99, 2.99, 4.99, 9.99];
        const price = prices[randomInt(0, prices.length - 1)];

        // Hình ảnh random đẹp mắt từ Picsum (thêm seed vào URL để ảnh không bị trùng)
        // Tạo bộ từ khóa để lấy ảnh cho chuẩn chủ đề (như ninja, anime, game hành động...)
        const imageKeyword = isGame ? 'anime,game' : 'technology,app';

        // Cấp cho mỗi ứng dụng 1 Mảng gồm 4 hình ảnh (Dùng LoremFlickr để lấy ảnh theo từ khóa)
        const imageUrls = [
            `https://loremflickr.com/400/400/${imageKeyword}?lock=${i}`,        // Hình 1: Ảnh đại diện (Vuông)
            `https://loremflickr.com/800/400/${imageKeyword}?lock=${i + 100}`,  // Hình 2: Ảnh mô tả (Chữ nhật)
            `https://loremflickr.com/800/400/${imageKeyword}?lock=${i + 200}`,  // Hình 3: Ảnh mô tả (Chữ nhật)
            `https://loremflickr.com/800/400/${imageKeyword}?lock=${i + 300}`   // Hình 4: Ảnh mô tả (Chữ nhật)
        ];

        fakeData.push({
            title,
            developer: randomItem(developers),
            price,
            imageUrls,
            description: `Đây là mô tả chi tiết cho ${type.toLowerCase()} ${title}. Ứng dụng mang lại trải nghiệm tuyệt vời với giao diện hiện đại và tính năng đa dạng, phù hợp cho mọi lứa tuổi.`,
            type,
            tags: [...new Set(tags)] // Xóa tag trùng lặp
        });
    }
    return fakeData;
};

// 3. Kết nối DB và nhồi dữ liệu
const seedDatabase = async () => {
    try {
        // Đảm bảo bạn đã có biến MONGO_URI trong file .env của backend
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/app_market');
        console.log('✅ Đã kết nối MongoDB!');

        // Tùy chọn: Xóa hết dữ liệu cũ đi cho sạch (Bỏ comment nếu muốn)
        // await App.deleteMany();
        // console.log('🗑️ Đã xóa dữ liệu cũ');

        const data = generateFakeData(100); // Đổi số này nếu muốn tạo 500 hay 1000 app
        await App.insertMany(data);

        console.log(`🎉 Đã gieo thành công ${data.length} ứng dụng/trò chơi vào Database!`);
        process.exit(); // Tự động thoát Script
    } catch (error) {
        console.error('❌ Lỗi Seeding:', error);
        process.exit(1);
    }
};

seedDatabase();