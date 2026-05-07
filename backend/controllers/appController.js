// backend/controllers/appController.js
const App = require('../models/AppItem');

// 1. Get các app cho Slider (Tối ưu dữ liệu hiển thị)
exports.getSliderApps = async (req, res) => {
    try {
        const limit = 50;
        // Đề xuất: Đánh giá cao nhất
        const topRated = await App.find({}).sort({ score: -1 }).limit(limit).select('title icon developer score minInstalls');

        // Tải nhiều nhất hôm nay
        const topToday = await App.find({}).sort({ todayDownloads: -1 }).limit(limit).select('title icon developer score todayDownloads');

        // Tải nhiều nhất (Tổng)
        const topTotal = await App.find({}).sort({ minInstalls: -1 }).limit(limit).select('title icon developer score minInstalls');

        res.status(200).json({
            success: true,
            data: { topRated, topToday, topTotal }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get app bằng tên để gợi ý (Header)
exports.getAppSuggestions = async (req, res) => {
    try {
        const keyword = req.query.q;
        const apps = await App.find({ title: { $regex: keyword, $options: 'i' } })
            .select('title icon')
            .limit(10);
        res.status(200).json({ success: true, data: apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get app hiển thị trên trang Kết quả tìm kiếm
exports.getSearchResults = async (req, res) => {
    try {
        const keyword = req.query.q;
        // Bỏ $or, chỉ tìm theo title
        const apps = await App.find({
            title: { $regex: keyword, $options: 'i' }
        }).select('title icon developer score minInstalls price');

        res.status(200).json({ success: true, count: apps.length, data: apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get app đúng tên để lấy TOÀN BỘ thông tin (App Detail)
exports.getAppDetailByName = async (req, res) => {
    try {
        const app = await App.findOne({ title: req.params.title });
        if (!app) return res.status(404).json({ message: 'Không tìm thấy ứng dụng' });
        res.status(200).json({ success: true, data: app });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// LOGIC CỘNG LƯỢT TẢI VÀ RESET NGÀY
exports.incrementDownload = async (req, res) => {
    try {
        const app = await App.findById(req.params.id);
        const todayStr = new Date().toLocaleDateString();

        if (app.lastDownloadDate !== todayStr) {
            // Nếu qua ngày mới, reset todayDownloads về 1
            app.todayDownloads = 1;
            app.lastDownloadDate = todayStr;
        } else {
            // Trong cùng ngày, cộng 1
            app.todayDownloads += 1;
        }

        app.totalDownloads += 1; // Tổng lượt tải hệ thống mình
        await app.save();

        res.status(200).json({ success: true, message: 'Đã cập nhật lượt tải' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};