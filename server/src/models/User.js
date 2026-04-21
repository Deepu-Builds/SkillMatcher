import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [80, 'Name cannot exceed 80 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // never returned in queries by default
  },
  avatar: {
    type: String,
    default: '',
  },
  skillTags: [{ type: String, trim: true }],
  savedPaths: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Path' }],
  quizHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizResponse' }],
  notifications: {
    email: { type: Boolean, default: true },
    weekly: { type: Boolean, default: true },
    milestones: { type: Boolean, default: false },
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

// ─── Hash password before save ────────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// ─── Instance method: compare password ────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ─── Instance method: public profile ──────────────────────────────────────────
UserSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    skillTags: this.skillTags,
    notifications: this.notifications,
    createdAt: this.createdAt,
  }
}

export default mongoose.model('User', UserSchema)
