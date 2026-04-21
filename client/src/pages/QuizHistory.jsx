import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiClock, FiZap, FiChevronDown, FiChevronRight,
  FiRepeat, FiTrendingUp, FiPlus, FiCalendar, FiDollarSign
} from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { quizApi } from '../api/quizApi'
import { getDifficultyBadgeClass } from '../utils/formatters'
import Navbar from '../components/Navbar'

const MOCK_HISTORY = [
  {
    _id: 'h1',
    createdAt: '2025-01-12T10:30:00Z',
    answers: [
      { question: 'What are you naturally good at?', answer: 'Writing, storytelling, and explaining complex topics clearly.' },
      { question: 'How many hours per week can you commit?', answer: '10-20 hours' },
      { question: "What's your income goal in the next 6 months?", answer: '$500–$1,500/month' },
      { question: 'What kind of work environment do you prefer?', answer: 'Working solo, Creative work' },
      { question: 'Any specific skills or tools you already know?', answer: 'Google Docs, basic SEO, WordPress' },
    ],
    generatedPaths: [
      { _id: 'p1', title: 'Freelance Content Writer', difficulty: 'Beginner', incomeRange: '$800–$2,500/mo' },
      { _id: 'p2', title: 'Newsletter Creator', difficulty: 'Beginner', incomeRange: '$500–$3,000/mo' },
      { _id: 'p3', title: 'Copywriter', difficulty: 'Intermediate', incomeRange: '$1,500–$5,000/mo' },
    ],
  },
  {
    _id: 'h2',
    createdAt: '2024-12-28T14:15:00Z',
    answers: [
      { question: 'What are you naturally good at?', answer: 'Design, visual thinking, color theory' },
      { question: 'How many hours per week can you commit?', answer: '5-10 hours' },
      { question: "What's your income goal in the next 6 months?", answer: '$1,500–$5,000/month' },
      { question: 'What kind of work environment do you prefer?', answer: 'Creative work, Collaborating with clients' },
      { question: 'Any specific skills or tools you already know?', answer: 'Figma, Adobe XD, Photoshop' },
    ],
    generatedPaths: [
      { _id: 'p4', title: 'UX/UI Consultant', difficulty: 'Intermediate', incomeRange: '$2,000–$6,000/mo' },
      { _id: 'p5', title: 'Brand Designer', difficulty: 'Intermediate', incomeRange: '$1,500–$5,000/mo' },
      { _id: 'p6', title: 'Social Media Visual Designer', difficulty: 'Beginner', incomeRange: '$600–$2,500/mo' },
    ],
  },
  {
    _id: 'h3',
    createdAt: '2024-12-05T09:45:00Z',
    answers: [
      { question: 'What are you naturally good at?', answer: 'Teaching, explaining, breaking down complex ideas' },
      { question: 'How many hours per week can you commit?', answer: '20+ hours (full-time)' },
      { question: "What's your income goal in the next 6 months?", answer: '$1,500–$5,000/month' },
      { question: 'What kind of work environment do you prefer?', answer: 'Teaching or coaching, Building products' },
      { question: 'Any specific skills or tools you already know?', answer: 'Excel, Python basics, data analysis' },
    ],
    generatedPaths: [
      { _id: 'p7', title: 'Online Course Creator', difficulty: 'Intermediate', incomeRange: '$1,500–$8,000/mo' },
      { _id: 'p8', title: 'Data Tutoring & Coaching', difficulty: 'Beginner', incomeRange: '$600–$3,000/mo' },
      { _id: 'p9', title: 'Excel Automation Consultant', difficulty: 'Intermediate', incomeRange: '$1,200–$4,000/mo' },
    ],
  },
]

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const HistoryCard = ({ entry, index }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <FiCalendar size={17} />
          </div>
          <div>
            <p className="font-bold text-gray-900 font-display">Quiz #{MOCK_HISTORY.length - index}</p>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              <FiClock size={12} />
              {formatDate(entry.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {entry.generatedPaths.slice(0, 2).map(p => (
              <span key={p._id} className={getDifficultyBadgeClass(p.difficulty)}>{p.difficulty}</span>
            ))}
            {entry.generatedPaths.length > 2 && (
              <span className="text-xs text-gray-400 font-medium">+{entry.generatedPaths.length - 2} more</span>
            )}
          </div>
          {expanded ? <FiChevronDown size={18} className="text-gray-400" /> : <FiChevronRight size={18} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Generated paths */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-4">
              Generated Paths ({entry.generatedPaths.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {entry.generatedPaths.map(path => (
                <Link
                  key={path._id}
                  to={`/dashboard/path/${path._id}`}
                  className="flex items-center justify-between gap-2 p-3.5 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group"
                >
                  <div>
                    <span className={`${getDifficultyBadgeClass(path.difficulty)} text-xs`}>{path.difficulty}</span>
                    <p className="text-sm font-bold text-gray-900 mt-1.5 font-display leading-snug">{path.title}</p>
                    <p className="text-xs text-orange-500 font-semibold mt-0.5 flex items-center gap-1">
                      <FiDollarSign size={11} />
                      {path.incomeRange}
                    </p>
                  </div>
                  <FiChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quiz answers */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Answers</p>
            <div className="space-y-3">
              {entry.answers.map((a, i) => (
                <div key={i} className="p-3.5 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-400 mb-1">{a.question}</p>
                  <p className="text-sm text-gray-800 font-medium">{a.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Retake button */}
          <div className="mt-5 flex justify-end">
            <Link
              to="/quiz"
              className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5"
            >
              <FiRepeat size={14} />
              Retake This Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const QuizHistory = () => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    loadHistory()
  }, [isAuthenticated])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const { data } = await quizApi.getHistory()
      if (data?.history?.length) setHistory(data.history)
    } catch { /* use mock */ }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="section-container">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Quiz History</h1>
              <p className="mt-1 text-gray-500">All your past AI skill analyses</p>
            </div>
            <Link to="/quiz" className="btn-primary flex items-center gap-2 shrink-0">
              <FiPlus size={15} />
              New Analysis
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: history.length, label: 'Total Quizzes', icon: FiRepeat },
              { value: history.reduce((a, h) => a + h.generatedPaths.length, 0), label: 'Paths Generated', icon: FiTrendingUp },
              { value: history.length > 0 ? new Date(history[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—', label: 'Last Quiz', icon: FiCalendar },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* History entries */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400 mx-auto mb-4">
                <FiClock size={24} />
              </div>
              <h3 className="font-bold text-gray-900 font-display mb-2">No quiz history yet</h3>
              <p className="text-sm text-gray-500 mb-6">Take your first AI quiz to discover income paths matched to your skills.</p>
              <Link to="/quiz" className="btn-primary inline-flex items-center gap-2">
                <FiZap size={14} /> Take the Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, i) => (
                <HistoryCard key={entry._id} entry={entry} index={i} />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default QuizHistory
