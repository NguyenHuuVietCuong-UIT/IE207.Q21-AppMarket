const App = require('../models/App');

// @desc    Lấy danh sách tất cả ứng dụng
// @route   GET /api/apps
const getApps = async (req, res) => {
    try {
        const apps = await App.find({});
        res.status(200).json({ success: true, count: apps.length, data: apps });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy chi tiết 1 ứng dụng
// @route   GET /api/apps/:id
const getAppById = async (req, res) => {
    try {
        const app = await App.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Không tìm thấy ứng dụng' });

        res.status(200).json({ success: true, data: app });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Tạo ứng dụng mới 
// @route   POST /api/apps
const createApp = async (req, res) => {
    try {
        const newApp = await App.create(req.body);
        res.status(201).json({ success: true, data: newApp });
    } catch (error) {
        res.status(400).json({ message: 'Không thể tạo ứng dụng', error: error.message });
    }
};

// @desc    Tìm kiếm ứng dụng bằng MongoDB Atlas Search
// @route   GET /api/apps/search?q=từ-khóa
const searchApps = async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword) {
            return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
        }

        // Sử dụng Aggregation Pipeline cho Atlas Search
        const apps = await App.aggregate([
            {
                $search: {
                    index: 'default', // Tên index bạn sẽ tạo trên giao diện MongoDB Atlas
                    text: {
                        query: keyword,
                        path: ['title', 'description'], // Tìm kiếm trên cả tên và mô tả
                        fuzzy: { maxEdits: 1 } // Chấp nhận gõ sai tối đa 1 ký tự (VD: "gamee" -> "game")
                    }
                }
            },
            { $limit: 10 } // Giới hạn trả về 10 kết quả
        ]);

        res.status(200).json({ success: true, count: apps.length, data: apps });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tìm kiếm', error: error.message });
    }
};

// @desc    Đề xuất ứng dụng tương tự (Content-Based)
// @route   GET /api/apps/:id/recommendations
const getRelatedApps = async (req, res) => {
    try {
        // 1. Tìm ứng dụng hiện tại để lấy danh sách tags
        const currentApp = await App.findById(req.params.id);
        if (!currentApp) return res.status(404).json({ message: 'Không tìm thấy ứng dụng' });

        // 2. Tìm các ứng dụng khác có chứa ít nhất 1 tag giống với ứng dụng hiện tại
        const relatedApps = await App.find({
            _id: { $ne: currentApp._id }, // Loại trừ chính nó ra khỏi danh sách gợi ý
            tags: { $in: currentApp.tags } // Toán tử $in: Tìm các app có tag trùng khớp
        }).limit(5); // Chỉ lấy top 5

        res.status(200).json({ success: true, count: relatedApps.length, data: relatedApps });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Tải xuống file text demo (Yêu cầu đăng nhập và đã mua)
// @route   GET /api/apps/:id/download
// @access  Private
const downloadAppDemo = async (req, res) => {
    try {
        const appId = req.params.id;
        const user = req.user; // Đã được lấy từ authMiddleware

        // 1. Kiểm tra quyền sở hữu: AppId có nằm trong mảng purchasedApps không?
        if (!user.purchasedApps.includes(appId)) {
            return res.status(403).json({ message: 'Bạn chưa mua ứng dụng này, không thể tải xuống!' });
        }

        const app = await App.findById(appId);

        // 2. Tạo nội dung file Text động
        const fileContent = `--- XÁC NHẬN TẢI XUỐNG ---\n`
            + `Tên ứng dụng: ${app.title}\n`
            + `Người tải: ${user.name} (${user.email})\n`
            + `Ngày tải: ${new Date().toLocaleString('vi-VN')}\n`
            + `\nĐây là file text giả lập dùng cho đồ án môn học.`;

        // 3. Thiết lập Header để trình duyệt tự động tải file .txt về máy
        res.setHeader('Content-disposition', `attachment; filename=Demo_${app.title.replace(/\s+/g, '_')}.txt`);
        res.setHeader('Content-type', 'text/plain; charset=utf-8');

        // 4. Trả file về cho client
        res.send(fileContent);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải xuống', error: error.message });
    }
};

module.exports = { getApps, getAppById, createApp, searchApps, getRelatedApps, downloadAppDemo };