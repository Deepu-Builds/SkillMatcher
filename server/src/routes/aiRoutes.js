import { Router } from 'express'
import { analyze, generatePathRoadmap } from '../controllers/aiController.js'
import { protect } from '../middleware/authMiddleware.js'
import { aiLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// All AI routes are protected + rate limited
router.post('/analyze',          protect, aiLimiter, analyze)
router.post('/roadmap/:pathId',  protect, aiLimiter, generatePathRoadmap)

export default router
