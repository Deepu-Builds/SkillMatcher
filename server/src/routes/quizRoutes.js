import { Router } from 'express'
import { getQuestions, submitAnswers, getHistory } from '../controllers/quizController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

// Public — anyone can fetch the quiz questions
router.get('/questions', getQuestions)

// Protected
router.post('/submit',  protect, submitAnswers)
router.get('/history',  protect, getHistory)

export default router
