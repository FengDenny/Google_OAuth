class AppError extends Error {
  constructor(messages, statusCode) {
    super(messages, statusCode);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // display and capture every "this" , including constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
