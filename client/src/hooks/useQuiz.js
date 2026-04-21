import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { pathsApi } from '../api/pathsApi'
import { quizApi } from '../api/quizApi'

export const QUIZ_QUESTIONS = [
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

export const useQuiz = () => {
  const navigate = useNavigate()
  const {
    currentStep,
    answers,
    isSubmitting,
    results,
    error,
    setAnswer,
    nextStep,
    prevStep,
    setSubmitting,
    setResults,
    setError,
    reset,
  } = useQuizStore()

  const totalSteps = QUIZ_QUESTIONS.length

  const handleAnswer = (questionId, question, answer) => {
    setAnswer(questionId, question, answer)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) nextStep()
  }

  const handlePrev = () => {
    prevStep()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      // Step 1: Save quiz answers to DB and get a quizResponseId
      let quizResponseId = null
      try {
        const { data: quizData } = await quizApi.submitAnswers(answers)
        quizResponseId = quizData.quizResponseId
      } catch {
        // Non-critical — continue even if saving fails
      }

      // Step 2: Send answers to Gemini AI for analysis
      const { data } = await pathsApi.analyzePaths(answers, quizResponseId)
      setResults(data.paths)
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)?.answer || ''
  const progress = ((currentStep + 1) / totalSteps) * 100

  return {
    currentStep,
    currentQuestion,
    currentAnswer,
    totalSteps,
    answers,
    isSubmitting,
    results,
    error,
    progress,
    handleAnswer,
    handleNext,
    handlePrev,
    handleSubmit,
    reset,
  }
}
