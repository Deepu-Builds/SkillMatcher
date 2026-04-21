import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { error } from '../utils/apiResponse.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Not authorized — no token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return error(res, 'Not authorized — user not found', 401)
    }
    if (!user.isActive) {
      return error(res, 'Account has been deactivated', 401)
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Not authorized — invalid token', 401)
    }
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Not authorized — token expired', 401)
    }
    return error(res, 'Authentication failed', 401)
  }
}
