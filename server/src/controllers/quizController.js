import QuizResponse from '../models/QuizResponse.js'
import User from '../models/User.js'
import { success, error, created } from '../utils/apiResponse.js'

// ─── Static quiz questions (same as frontend QUIZ_QUESTIONS) ──────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What are you naturally good at?',
    subtitle: 'Think about skills others have complimented you on.',
    placeholder: 'e.g. Writing, teaching, organizing, coding, design...',
    type: 'textarea',
  },
  {
    id: 'q2',
    question: 'How many hours per week can you commit?',
    subtitle: 'Be realistic — consistency beats intensity.',
    type: 'select',
    options: ['1-5 hours', '5-10 hours', '10-20 hours', '20+ hours (full-time)'],
  },
  {
    id: 'q3',
    question: "What's your income goal in the next 6 months?",
    subtitle: 'This helps us match you with realistic paths.',
    type: 'select',
    options: ['$0–$500/month', '$500–$1,500/month', '$1,500–$5,000/month', '$5,000+/month'],
  },
  {
    id: 'q4',
    question: 'What kind of work environment do you prefer?',
    subtitle: 'Understanding your style helps us suggest paths that fit your life.',
    type: 'multiselect',
    options: ['Working solo', 'Collaborating with clients', 'Building products', 'Teaching or coaching', 'Creative work', 'Analytical work'],
  },
  {
    id: 'q5',
    question: 'Any specific skills or tools you already know?',
    subtitle: "Mention software, platforms, or expertise — even if you're a beginner.",
    placeholder: 'e.g. Figma, Excel, video editing, cooking, public speaking...',
    type: 'textarea',
  },
]

// ─── GET /api/quiz/questions ──────────────────────────────────────────────────
export const getQuestions = async (_req, res) => {
  return success(res, { questions: QUIZ_QUESTIONS })
}

// ─── POST /api/quiz/submit ────────────────────────────────────────────────────
export const submitAnswers = async (req, res) => {
  try {
    const { answers } = req.body

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return error(res, 'Answers are required', 400)
    }

    // Save quiz response to DB
    const quizResponse = await QuizResponse.create({
      userId: req.user._id,
      answers,
    })

    // Link to user's history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { quizHistory: quizResponse._id },
    })

    return created(res, { quizResponseId: quizResponse._id }, 'Quiz submitted successfully')
  } catch (err) {
    console.error('[submitAnswers]', err)
    return error(res, 'Failed to submit quiz', 500)
  }
}

// ─── GET /api/quiz/history ────────────────────────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const history = await QuizResponse.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'generatedPaths',
        select: 'title difficulty incomeRange category',
      })
      .lean()

    return success(res, { history })
  } catch (err) {
    console.error('[getHistory]', err)
    return error(res, 'Failed to fetch quiz history', 500)
  }
}
