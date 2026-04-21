import Path from "../models/Path.js";
import User from "../models/User.js";
import { success, error } from "../utils/apiResponse.js";

// ─── GET /api/paths/saved ─────────────────────────────────────────────────────
// Get all saved paths for the current user
export const getSavedPaths = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedPaths");
    if (!user) {
      return error(res, "User not found", 404);
    }

    return success(res, { paths: user.savedPaths || [] });
  } catch (err) {
    console.error("[getSavedPaths]", err);
    return error(res, "Failed to fetch saved paths", 500);
  }
};

// ─── GET /api/paths/explore/all ────────────────────────────────────────────────
// Get all built-in paths (for Explore page)
export const getBuiltInPaths = async (req, res) => {
  try {
    const paths = await Path.find({ userId: null })
      .sort({ createdAt: -1 })
      .lean();

    return success(res, { paths });
  } catch (err) {
    console.error("[getBuiltInPaths]", err);
    return error(res, "Failed to fetch paths", 500);
  }
};

// ─── GET /api/paths ───────────────────────────────────────────────────────────
export const getPaths = async (req, res) => {
  try {
    const paths = await Path.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return success(res, { paths });
  } catch (err) {
    console.error("[getPaths]", err);
    return error(res, "Failed to fetch paths", 500);
  }
};

// ─── GET /api/paths/:id ───────────────────────────────────────────────────────
export const getPath = async (req, res) => {
  try {
    const path = await Path.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user._id }, { userId: null }],
    }).lean();

    if (!path) {
      return error(res, "Path not found", 404);
    }

    return success(res, { path });
  } catch (err) {
    console.error("[getPath]", err);
    if (err.name === "CastError") {
      return error(res, "Invalid path ID", 400);
    }
    return error(res, "Failed to fetch path", 500);
  }
};

// ─── POST /api/paths/save/:id ─────────────────────────────────────────────────
// Toggle save/unsave a path
export const savePath = async (req, res) => {
  try {
    const path = await Path.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!path) {
      return error(res, "Path not found", 404);
    }

    path.isSaved = !path.isSaved;
    await path.save();

    // Sync with user's savedPaths array
    if (path.isSaved) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { savedPaths: path._id },
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedPaths: path._id },
      });
    }

    return success(
      res,
      { path, isSaved: path.isSaved },
      path.isSaved ? "Path saved successfully" : "Path removed from saved",
    );
  } catch (err) {
    console.error("[savePath]", err);
    return error(res, "Failed to save path", 500);
  }
};

// ─── DELETE /api/paths/:id ────────────────────────────────────────────────────
export const deletePath = async (req, res) => {
  try {
    const path = await Path.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!path) {
      return error(res, "Path not found", 404);
    }

    // Remove from user's savedPaths
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedPaths: path._id },
    });

    return success(res, {}, "Path deleted successfully");
  } catch (err) {
    console.error("[deletePath]", err);
    return error(res, "Failed to delete path", 500);
  }
};

// ─── POST /api/paths/star/:id ──────────────────────────────────────────────────
// Toggle star on a path
export const toggleStar = async (req, res) => {
  try {
    const path = await Path.findById(req.params.id);
    if (!path) {
      return error(res, "Path not found", 404);
    }

    const userId = req.user._id.toString();
    const isStarred = path.stars.some((id) => id.toString() === userId);

    if (isStarred) {
      path.stars = path.stars.filter((id) => id.toString() !== userId);
    } else {
      path.stars.push(req.user._id);
    }

    await path.save();

    return success(
      res,
      {
        isStarred: !isStarred,
        starsCount: path.stars.length,
      },
      isStarred ? "Star removed" : "Path starred",
    );
  } catch (err) {
    console.error("[toggleStar]", err);
    return error(res, "Failed to toggle star", 500);
  }
};

// ─── POST /api/paths/save/:id ──────────────────────────────────────────────────
// Toggle save on a path (new version for Explore page)
export const toggleSaveAction = async (req, res) => {
  try {
    const path = await Path.findById(req.params.id);
    if (!path) {
      return error(res, "Path not found", 404);
    }

    const userId = req.user._id.toString();
    const isSaved = path.saves.some((id) => id.toString() === userId);

    if (isSaved) {
      path.saves = path.saves.filter((id) => id.toString() !== userId);
      // Also remove from user's savedPaths
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedPaths: path._id },
      });
    } else {
      path.saves.push(req.user._id);
      // Also add to user's savedPaths
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { savedPaths: path._id },
      });
    }

    await path.save();

    return success(
      res,
      {
        isSaved: !isSaved,
        savesCount: path.saves.length,
      },
      isSaved ? "Removed from saves" : "Path saved",
    );
  } catch (err) {
    console.error("[toggleSaveAction]", err);
    return error(res, "Failed to toggle save", 500);
  }
};

// ─── PATCH /api/paths/:id/step/:stepId ───────────────────────────────────────
// Toggle a roadmap step as complete/incomplete
export const completeStep = async (req, res) => {
  try {
    const { id: pathId, stepId } = req.params;

    const path = await Path.findOne({ _id: pathId, userId: req.user._id });
    if (!path) {
      return error(res, "Path not found", 404);
    }

    // Find the step by _id or stepNumber
    const step = path.roadmap?.steps?.find(
      (s) =>
        s._id?.toString() === stepId || s.stepNumber?.toString() === stepId,
    );

    if (!step) {
      return error(res, "Step not found", 404);
    }

    step.isCompleted = !step.isCompleted;
    step.completedAt = step.isCompleted ? new Date() : null;

    await path.save();

    // Calculate overall progress
    const total = path.roadmap.steps.length;
    const completed = path.roadmap.steps.filter((s) => s.isCompleted).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return success(
      res,
      {
        step,
        progress,
        completedSteps: completed,
        totalSteps: total,
      },
      step.isCompleted ? "Step marked complete" : "Step marked incomplete",
    );
  } catch (err) {
    console.error("[completeStep]", err);
    return error(res, "Failed to update step", 500);
  }
};
