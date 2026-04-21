import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiBookmark,
} from "react-icons/fi";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  getDifficultyBadgeClass,
  calculateProgress,
} from "../utils/formatters";
import { pathsApi } from "../api/pathsApi";

const PathCard = ({ path, showProgress = false, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(path?.isSaved || false);
  const [isStarting, setIsStarting] = useState(false);
  const progress = showProgress ? calculateProgress(path.roadmap?.steps) : null;
  const hasStarted = path.roadmap?.steps?.length > 0;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSaving(true);
    try {
      const response = await pathsApi.savePath(path._id);
      console.log("Save response:", response);

      // Update local state based on the response
      if (response.data?.isSaved !== undefined) {
        setIsSaved(response.data.isSaved);
        onSave?.(response.data.isSaved);
      } else {
        // Fallback: toggle if response doesn't have isSaved
        setIsSaved(!isSaved);
        onSave?.(!isSaved);
      }
    } catch (err) {
      console.error("Failed to save path:", err.response?.data || err.message);
      console.error("Full error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsStarting(true);
    try {
      await pathsApi.generateRoadmap(path._id);
      window.location.reload();
    } catch (err) {
      console.error("Failed to start path:", err);
      setIsStarting(false);
    }
  };

  return (
    <div className="card flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={getDifficultyBadgeClass(path.difficulty)}>
            {path.difficulty}
          </span>
          <h3 className="mt-2 text-lg font-bold text-gray-900 font-display leading-snug">
            {path.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isSaved
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-400"
            } ${isSaving ? "opacity-50" : ""}`}
            title={isSaved ? "Remove from saved" : "Save path"}
          >
            <FiBookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <span className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <FiTrendingUp size={18} />
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
        {path.description}
      </p>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 transition-all duration-200 cursor-default">
          <FiDollarSign size={14} className="text-orange-500" />
          <span>{path.incomeRange}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 transition-all duration-200 cursor-default">
          <FiClock size={14} className="text-orange-500" />
          <span>{path.timeToStart}</span>
        </div>
      </div>

      {path.skillsNeeded?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {path.skillsNeeded.slice(0, 3).map((skill, idx) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium transition-all duration-200"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {skill}
            </span>
          ))}
          {path.skillsNeeded.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 transition-all duration-200">
              +{path.skillsNeeded.length - 3} more
            </span>
          )}
        </div>
      )}

      {showProgress && progress !== null && (
        <div>
          <ProgressBar
            percent={progress}
            showLabel
            size="md"
            color={progress === 100 ? "green" : "orange"}
          />
        </div>
      )}

      <div className="flex items-center gap-3 mt-auto pt-2">
        {!hasStarted ? (
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isStarting ? "Starting..." : " Start Journey"}
          </button>
        ) : (
          <Link
            to={`/dashboard/path/${path._id}`}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-orange-500 px-4 py-2.5 rounded-lg transition-all duration-200"
          >
            Unlock Earning Plan
            <FiArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default PathCard;
