export const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || err.status || 500
  let message = err.message || 'Internal server error'

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    const messages = Object.values(err.errors).map(e => e.message)
    message = messages.join(', ')
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode} ${message}`, err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
