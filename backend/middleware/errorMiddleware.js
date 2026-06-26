// middleware/errorMiddleware.js
// Centralized error handler. Controllers can just `throw` or call next(err)
// and this will format a consistent JSON error response.

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${err.message}`);

  res.status(statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { notFound, errorHandler };
