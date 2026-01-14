export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    err.message = `Resource not found. Invalid: ${err.path}`;
    err.statusCode = 400;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err.message = message;
    err.statusCode = 400;
  }

  // JWT Token error
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Json Web Token is invalid, try again';
    err.statusCode = 400;
  }

  // JWT expire error
  if (err.name === 'TokenExpiredError') {
    err.message = 'Json Web Token is expired, try again';
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
