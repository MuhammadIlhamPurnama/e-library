const errorHandler = (error, req, res, next) => {
  console.error(error);

  // Multer errors (file upload)
  if (error && (error.name === 'MulterError' || error.code && error.code.startsWith('LIMIT_'))) {
    let message = error.message || 'File upload error';

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected field: ${error.field || 'file'}`;
    } else if (error.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (error.code === 'LIMIT_PART_COUNT' || error.code === 'LIMIT_FILE_COUNT' || error.code === 'LIMIT_FIELD_COUNT') {
      message = 'Too many files/fields';
    }

    return res.status(400).json({
      success: false,
      message,
      data: null
    });
  }

  // Unauthorized (401)
  if (error.name === 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message: error.message,
      data: null
    });
  }

  // Bad Request (400)
  if (error.name === 'BadRequest') {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }

  // Sequelize Validation & Unique Constraint
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    const errors = error.errors.map(err => err.message);

    return res.status(400).json({
      success: false,
      message: errors[0],
      data: null
    });
  }

  // JWT Error
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
      data: null
    });
  }

  // Forbidden (403)
  if (error.name === 'Forbidden') {
    return res.status(403).json({
      success: false,
      message: error.message,
      data: null
    });
  }

  // Not Found (404)
  if (error.name === 'NotFound') {
    return res.status(404).json({
      success: false,
      message: error.message,
      data: null
    });
  }

  // Fallback Error (500)
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    data: null
  });
};

module.exports = errorHandler;
