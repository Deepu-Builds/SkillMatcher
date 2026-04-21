import mongoose from 'mongoose'

const QuizResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    questionId: { type: String, required: true },
    question:   { type: String, required: true },
    answer:     { type: String, required: true },
  }],
  aiPrompt: { type: String },
  generatedPaths: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Path' }],
}, {
  timestamps: true,
})

export default mongoose.model('QuizResponse', QuizResponseSchema)
