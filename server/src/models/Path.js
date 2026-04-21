import mongoose from "mongoose";

const PathSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: {
      type: String,
      required: [true, "Path title is required"],
      trim: true,
    },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    timeToStart: { type: String, default: "1-2 weeks" },
    incomeRange: { type: String, default: "" },
    skillsNeeded: [{ type: String, trim: true }],
    roadmap: {
      totalDays: { type: Number, default: 30 },
      steps: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
          },
          stepNumber: { type: Number, required: true },
          title: { type: String, required: true },
          description: { type: String, default: "" },
          estimatedDays: { type: Number, default: 1 },
          isCompleted: { type: Boolean, default: false },
          completedAt: { type: Date },
          resources: [
            {
              title: { type: String },
              url: { type: String },
            },
          ],
        },
      ],
    },
    isSaved: { type: Boolean, default: false },
    stars: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    quizResponseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizResponse",
    },
  },
  {
    timestamps: true,
  },
);

// Index for fast user queries
PathSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Path", PathSchema);
