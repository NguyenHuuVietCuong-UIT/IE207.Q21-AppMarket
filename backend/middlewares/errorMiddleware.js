const errorHandler = (err, req, res, next) => {
    // Nếu controller đã set một status code cụ thể (VD: 400, 404), thì giữ nguyên.
    // Nếu chưa set (mặc định là 200) nhưng lại rơi vào catch, thì ép thành 500 (Lỗi Server).
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    // Trả về một format JSON chuẩn cho mọi lỗi
    res.json({
        success: false,
        message: err.message,
        // Chỉ in ra dòng code gây lỗi khi đang ở môi trường 'development' (lập trình)
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };