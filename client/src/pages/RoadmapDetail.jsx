import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiDollarSign,
  FiClock,
  FiZap,
  FiRefreshCw,
  FiPlay,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { pathsApi } from "../api/pathsApi";
import RoadmapStep from "../components/RoadmapStep";
import ProgressBar from "../components/ProgressBar";
import {
  getDifficultyBadgeClass,
  calculateProgress,
} from "../utils/formatters";
import Navbar from "../components/Navbar";

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [startingPath, setStartingPath] = useState(false);
  const [leavingPath, setLeavingPath] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPath();
  }, [id]);

  const loadPath = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pathsApi.getPath(id);
      const fetchedPath = data.path;

      // If path has no roadmap steps yet, auto-generate them
      if (!fetchedPath.roadmap?.steps?.length) {
        setPath(fetchedPath);
        setLoading(false);
        await generateRoadmap(fetchedPath);
      } else {
        setPath(fetchedPath);
        setLoading(false);
      }
    } catch (err) {
      setError("Could not load this path. It may not exist.");
      setLoading(false);
    }
  };

  const generateRoadmap = async (currentPath) => {
    setGeneratingRoadmap(true);
    try {
      const { data } = await pathsApi.generateRoadmap(id);
      setPath(data.path);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleToggleStep = async (stepId) => {
    // Optimistic update
    setPath((prev) => ({
      ...prev,
      roadmap: {
        ...prev.roadmap,
        steps: prev.roadmap.steps.map((s) =>
          s._id === stepId || s.stepNumber?.toString() === stepId?.toString()
            ? { ...s, isCompleted: !s.isCompleted }
            : s,
        ),
      },
    }));
    try {
      await pathsApi.completeStep(id, stepId);
    } catch {
      // keep optimistic update — non critical
    }
  };

  const handleBeginJourney = async () => {
    setStartingPath(true);
    try {
      // Generate roadmap first if it doesn't exist
      if (!path.roadmap?.steps?.length) {
        const { data } = await pathsApi.generateRoadmap(id);
        setPath(data.path);

        // Then mark the first step as started
        if (data.path.roadmap?.steps?.length > 0) {
          const firstStepId = data.path.roadmap.steps[0]._id;
          await pathsApi.completeStep(id, firstStepId);
        }
      } else {
        // If roadmap already exists, just mark the first step
        const firstStep = path.roadmap.steps[0];
        if (firstStep && !firstStep.isCompleted) {
          await pathsApi.completeStep(id, firstStep._id);
        }
      }

      // Reload the path to reflect changes
      const { data } = await pathsApi.getPath(id);
      setPath(data.path);
    } catch (err) {
      console.error("Failed to     Unlock Earning Plan :", err);
    } finally {
      setStartingPath(false);
    }
  };

  const handleLeaveJourney = async () => {
    setLeavingPath(true);
    try {
      // Reset all steps to incomplete
      if (path.roadmap?.steps?.length) {
        for (const step of path.roadmap.steps) {
          if (step.isCompleted) {
            await pathsApi.completeStep(id, step._id);
          }
        }
      }

      // Reload the path
      const { data } = await pathsApi.getPath(id);
      setPath(data.path);
      setShowLeaveModal(false);
    } catch (err) {
      console.error("Failed to leave path:", err);
    } finally {
      setLeavingPath(false);
    }
  };

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-600">
            Loading your roadmap...
          </span>
        </div>
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────────────────────────
  if (error || !path) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-slate-600 text-base">
            {error || "Path not found."}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary flex items-center gap-2"
          >
            <FiArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(path.roadmap?.steps);
  const completed =
    path.roadmap?.steps?.filter((s) => s.isCompleted).length || 0;
  const total = path.roadmap?.steps?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="section-container">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 font-medium group"
          >
            <FiArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </button>

          {/* Premium Path Header Card */}
          <div className="card-elevated mb-12 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`badge ${path.difficulty === "Beginner" ? "badge-success" : path.difficulty === "Intermediate" ? "badge-primary" : "badge-danger"}`}
                  >
                    {path.difficulty}
                  </span>
                  <span className="badge">{path.category}</span>
                </div>
                <h1 className="text-hero mb-3">{path.title}</h1>
                <p className="text-body max-w-2xl mb-6">{path.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <FiDollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Income Range
                      </p>
                      <p className="font-bold text-slate-900">
                        {path.incomeRange}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FiClock size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Time to Start
                      </p>
                      <p className="font-bold text-slate-900">
                        {path.timeToStart}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <FiZap size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Duration
                      </p>
                      <p className="font-bold text-slate-900">
                        {path.roadmap?.totalDays || 30} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="card-elevated bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 min-w-[240px] flex flex-col justify-center text-center">
                <p className="text-5xl font-extrabold text-orange-600 mb-2">
                  {progress}%
                </p>
                <p className="text-sm text-slate-700 font-semibold mb-4">
                  Completion Progress
                </p>
                <p className="text-xs text-slate-600 mb-4">
                  {completed} of {total} steps completed
                </p>
                <ProgressBar
                  percent={progress}
                  size="md"
                  color={progress === 100 ? "green" : "orange"}
                />
              </div>
            </div>
          </div>

          {/* Skills Needed */}
          {path.skillsNeeded?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {path.skillsNeeded.map((skill) => (
                  <span key={skill} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Premium Roadmap Steps Section */}
          <div
            className="card-elevated animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="mb-8">
              <h2 className="text-section-title mb-3">
                📋 Your Step-by-Step Roadmap
              </h2>
              <p className="text-body mb-6">
                Follow these steps to get started on your earning journey. Mark
                each step complete as you progress.
              </p>
              {!generatingRoadmap && total > 0 && (
                <button
                  onClick={() => generateRoadmap(path)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiRefreshCw size={16} /> Regenerate Roadmap
                </button>
              )}
            </div>

            {/* Generating state */}
            {generatingRoadmap && (
              <div className="flex flex-col items-center py-20 gap-4 bg-orange-50 rounded-xl border border-orange-200">
                <span className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="font-bold text-slate-900 text-lg">
                    ✨ Generating your roadmap...
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    AI is creating a personalized step-by-step plan
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!generatingRoadmap && total === 0 && (
              <div className="empty-state-premium">
                <div className="empty-state-icon-premium text-orange-500">
                  <FiZap size={32} />
                </div>
                <h3 className="empty-state-title-premium">No roadmap yet</h3>
                <p className="empty-state-desc-premium">
                  Generate a personalized step-by-step plan with AI to get
                  started on your earning journey
                </p>
                <button
                  onClick={() => generateRoadmap(path)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiZap size={16} /> Generate Roadmap with AI
                </button>
              </div>
            )}

            {/* Steps Timeline */}
            {!generatingRoadmap && total > 0 && (
              <div className="space-y-3">
                {path.roadmap.steps.map((step, i) => (
                  <RoadmapStep
                    key={step._id || step.stepNumber}
                    step={step}
                    onToggle={handleToggleStep}
                    isLast={i === path.roadmap.steps.length - 1}
                  />
                ))}

                {progress === 100 && (
                  <div className="mt-8 px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center animate-fade-in-up">
                    <p className="text-lg font-bold text-green-700 mb-2">
                      🎉 Congratulations!
                    </p>
                    <p className="text-green-600 text-sm mb-4">
                      You've completed all steps for this path. Ready to explore
                      your next earning opportunity?
                    </p>
                    <Link
                      to="/explore"
                      className="btn-primary inline-block px-6 py-2 text-sm"
                    >
                      Explore More Paths
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Leave Journey Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl transform scale-95 opacity-0 animate-[slideUpEnter_0.3s_ease-out_forwards] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b border-orange-200 flex items-start justify-between animate-[slideDownEnter_0.4s_ease-out_0.1s_forwards] opacity-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Leave Journey?
                </h3>
                <p className="text-sm text-gray-600">
                  Your progress will be reset.
                </p>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-gray-400 transition-all duration-200 shrink-0"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Path Details */}
            <div className="px-6 py-5 bg-white animate-[slideDownEnter_0.4s_ease-out_0.2s_forwards] opacity-0">
              <p className="text-xs text-gray-500 font-medium mb-1 tracking-wide">
                CURRENT PATH
              </p>
              <p className="text-base font-bold text-gray-900 mb-2">
                {path?.title}
              </p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {path?.description}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Progress</p>
                  <p className="text-base font-bold text-orange-600">
                    {progress}%
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {completed} of {total} steps
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 flex gap-3 bg-gray-50 border-t border-gray-100 animate-[slideDownEnter_0.4s_ease-out_0.3s_forwards] opacity-0">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveJourney}
                disabled={leavingPath}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {leavingPath ? "Leaving..." : "Yes, Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapDetail;
