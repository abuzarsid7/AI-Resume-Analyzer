module.exports = (err, req, res, next) => {
  console.error('[Error]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File is too large. Please upload a smaller file.'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'Too many files uploaded. Please upload fewer files.'
    });
  }

  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};