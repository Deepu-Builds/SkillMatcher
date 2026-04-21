import Path from "../models/Path.js";
import QuizResponse from "../models/QuizResponse.js";
import User from "../models/User.js";
import { analyzeSkills, generateRoadmap } from "../services/groqService.js";
import { success, error, created } from "../utils/apiResponse.js";

// ─── POST /api/ai/analyze ─────────────────────────────────────────────────────
// Sends quiz answers to Groq, gets 3 career paths, saves to DB
export const analyze = async (req, res) => {
  try {
    const { answers, quizResponseId } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return error(res, "Answers are required to analyze skills", 400);
    }

    // Call Groq AI
    let aiPaths;
    try {
      aiPaths = await analyzeSkills(answers);
    } catch (aiErr) {
      console.error("[analyze] Groq error:", aiErr.message);
      return error(res, "AI analysis failed. Please try again.", 503);
    }

    if (!Array.isArray(aiPaths) || aiPaths.length === 0) {
      return error(res, "AI returned invalid response. Please try again.", 503);
    }

    // Persist paths to MongoDB
    const savedPaths = await Promise.all(
      aiPaths.slice(0, 3).map(async (p) => {
        const path = await Path.create({
          userId: req.user._id,
          title: p.title,
          description: p.description,
          category: p.category,
          difficulty: p.difficulty,
          timeToStart: p.timeToStart,
          incomeRange: p.incomeRange,
          skillsNeeded: p.skillsNeeded || [],
          quizResponseId: quizResponseId || null,
          roadmap: { totalDays: 30, steps: [] },
        });
        return path;
      }),
    );

    // Link paths to the quiz response if we have one
    if (quizResponseId) {
      await QuizResponse.findByIdAndUpdate(quizResponseId, {
        generatedPaths: savedPaths.map((p) => p._id),
        aiPrompt: answers
          .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
          .join("\n\n"),
      });
    }

    // Update user's skill tags from answers
    const skillAnswer = answers.find(
      (a) => a.questionId === "q1" || a.questionId === "q5",
    );
    if (skillAnswer) {
      const tags = skillAnswer.answer
        .split(/[,;]/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 8);
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { skillTags: { $each: tags } },
      });
    }

    return success(res, { paths: savedPaths }, "Skills analyzed successfully");
  } catch (err) {
    console.error("[analyze]", err);
    return error(res, "Analysis failed. Please try again.", 500);
  }
};

// ─── POST /api/ai/roadmap/:pathId ─────────────────────────────────────────────
// Generates a full 30-day roadmap for a given path using Groq
export const generatePathRoadmap = async (req, res) => {
  try {
    const { pathId } = req.params;

    // Allow both user's own paths and built-in paths (userId: null)
    const path = await Path.findOne({
      _id: pathId,
      $or: [{ userId: req.user._id }, { userId: null }],
    });
    if (!path) {
      return error(res, "Path not found", 404);
    }

    // Generate with Groq (allow regeneration)
    let roadmapData;
    try {
      roadmapData = await generateRoadmap(
        path.title,
        path.description,
        path.difficulty,
      );
    } catch (aiErr) {
      console.error("[generatePathRoadmap] Groq error:", aiErr.message);
      return error(res, "Failed to generate roadmap. Please try again.", 503);
    }

    if (!roadmapData?.steps?.length) {
      return error(res, "AI returned invalid roadmap data", 503);
    }

    // Save roadmap steps into the path document
    path.roadmap = {
      totalDays: roadmapData.totalDays || 30,
      steps: roadmapData.steps.map((s, i) => ({
        stepNumber: s.stepNumber || i + 1,
        title: s.title,
        description: s.description,
        estimatedDays: s.estimatedDays || 3,
        isCompleted: false,
        resources: (s.resources || []).slice(0, 3),
      })),
    };

    await path.save();

    return success(res, { path }, "Roadmap generated successfully");
  } catch (err) {
    console.error("[generatePathRoadmap]", err);
    return error(res, "Failed to generate roadmap", 500);
  }
};
