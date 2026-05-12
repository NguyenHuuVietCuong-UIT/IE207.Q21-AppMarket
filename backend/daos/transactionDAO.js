const Transaction = require('../models/Transaction');

class TransactionDAO {
    // Tạo một giao dịch mới (Lưu lịch sử tải/mua)
    async createTransaction(transactionData) {
        const transaction = new Transaction(transactionData);
        return await transaction.save();
    }

    // Kiểm tra xem user đã từng tải/mua app này chưa
    async findTransactionByUserAndApp(userId, appId) {
        return await Transaction.findOne({ user: userId, app: appId });
    }

    // Cập nhật trạng thái giao dịch (dùng cho chức năng gỡ cài đặt sau này)
    async updateTransactionStatus(transactionId, status) {
        return await Transaction.findByIdAndUpdate(transactionId, { status }, { new: true });
    }

    // Thêm đoạn này vào bên trong class TransactionDAO trong file transactionDAO.js
    async getHistoryByUser(userId) {
        return await Transaction.find({ user: userId })
            .populate('app', 'title icon developer price') // Lấy kèm thông tin app
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất
    }
}

module.exports = new TransactionDAO();