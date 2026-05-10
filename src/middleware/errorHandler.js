/**
 * Global Express error handler.
 * Catches any errors passed via next(err) and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // MySQL duplicate entry or constraint errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A school with this data already exists',
    });
  }

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error. Please try again later.',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
