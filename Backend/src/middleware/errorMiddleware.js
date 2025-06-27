// middleware/errorMiddleware.js
exports.errorHandler = (err, req, res, next) => {
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status).json({ message: err.message });
};