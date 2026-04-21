import mongoose from 'mongoose'

const RoadmapSchema = new mongoose.Schema({
  pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'Path' },
  steps: [{
    stepNumber:    { type: Number, required: true },
    title:         { type: String, required: true },
    description:   { type: String, required: true },
    estimatedDays: { type: Number, default: 1 },
    isCompleted:   { type: Boolean, default: false },
    completedAt:   { type: Date },
    resources: [{
      title: { type: String },
      url:   { type: String },
    }],
  }],
  totalDays: { type: Number, default: 30 },
}, {
  timestamps: true,
})

export default mongoose.model('Roadmap', RoadmapSchema)
