const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    appId: { type: String, required: true, unique: true }, // ID gốc của CH Play (ví dụ: com.mojang.minecraftpe)
    title: { type: String, required: true },
    summary: { type: String }, // Mô tả ngắn
    description: { type: String }, // Mô tả dài chi tiết

    // Thông tin nhà phát triển
    developer: { type: String, required: true },
    developerId: { type: String },
    developerEmail: { type: String },
    developerWebsite: { type: String },

    // Hình ảnh và Video
    icon: { type: String, required: true },
    headerImage: { type: String },
    screenshots: [{ type: String }], // Mảng các link ảnh chụp màn hình
    video: { type: String }, // Link video trailer (nếu có)
    videoImage: { type: String },

    // Giá cả và Phân loại
    price: { type: Number, default: 0 }, // Giá VNĐ (0 là miễn phí)
    free: { type: Boolean, default: true },
    genre: { type: String }, // Thể loại (Action, Tools,...)
    genreId: { type: String },

    // Dung lượng (Rất quan trọng cho yêu cầu mô phỏng thời gian tải app)
    sizeText: { type: String }, // Text gốc của CH Play (VD: "1.5G", "Varies with device")
    sizeMB: { type: Number, required: true }, // Số MB đã được quy đổi để tính toán ở code logic

    // Đánh giá và Lượt tải
    score: { type: Number, default: 0 }, // Điểm đánh giá trung bình
    ratings: { type: Number, default: 0 }, // Tổng số lượt đánh giá
    reviews: { type: Number, default: 0 }, // Tổng số lượt bình luận
    installs: { type: String }, // Text hiển thị (VD: "10,000,000+")
    minInstalls: { type: Number, default: 0 }, // Số liệu thực để filter/sort

    // Thông tin phiên bản
    version: { type: String },
    androidVersionText: { type: String },
    released: { type: String }, // Ngày phát hành
    updated: { type: Number }, // Timestamp ngày cập nhật cuối
    recentChanges: { type: String }, // Chi tiết bản cập nhật mới

    totalDownloads: { type: Number, default: 0 }, // Tổng lượt tải trên AppMarket của mình
    todayDownloads: { type: Number, default: 0 }, // Lượt tải hôm nay
    lastDownloadDate: { type: String, default: new Date().toLocaleDateString() } // Lưu ngày tải cuối (để reset)
}, { timestamps: true });

module.exports = mongoose.model('App', appSchema);