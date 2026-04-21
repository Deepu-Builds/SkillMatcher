import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiZap,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiBookmark,
} from "react-icons/fi";
import { useQuizStore } from "../store/quizStore";
import { pathsApi } from "../api/pathsApi";
import { getDifficultyBadgeClass } from "../utils/formatters";
import Navbar from "../components/Navbar";

const MOCK_RESULTS = [];

const ResultCard = ({ path, index, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(path?.isSaved || false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await pathsApi.savePath(path._id);
      setIsSaved(!isSaved);
      onSave?.(!isSaved);
    } catch (err) {
      console.error("Failed to save path:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="card flex flex-col gap-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={getDifficultyBadgeClass(path.difficulty)}>
            {path.difficulty}
          </span>
          <span className="ml-2 badge bg-gray-100 text-gray-500">
            {path.category}
          </span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 font-display leading-snug">
            {path.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isSaved
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-400 hover:bg-orange-50 hover:text-orange-500"
            } ${isSaving ? "opacity-50" : ""}`}
            title={isSaved ? "Remove from saved" : "Save path"}
          >
            <FiBookmark size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <FiTrendingUp size={20} />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        {path.description}
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <FiDollarSign size={14} className="text-orange-500" />
          <span className="font-semibold">{path.incomeRange}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <FiClock size={14} className="text-orange-500" />
          <span>Start in {path.timeToStart}</span>
        </div>
      </div>

      {path.skillsNeeded?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {path.skillsNeeded.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2">
        <Link
          to={`/dashboard/path/${path._id}`}
          className="btn-primary w-full text-center text-sm py-3 flex items-center justify-center gap-2"
        >
          View Full Roadmap
          <FiZap size={14} />
        </Link>
      </div>
    </div>
  );
};

const Results = () => {
  const navigate = useNavigate();
  const results = useQuizStore((s) => s.results);
  const paths = results?.length ? results : MOCK_RESULTS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="section-container">
          <div className="mb-4">
            <button
              onClick={() => navigate("/quiz")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft size={14} /> Back to Quiz
            </button>
          </div>

          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">
                Your Results
              </span>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 font-display">
                {paths.length} Income Paths Found
              </h1>
              <p className="mt-3 text-gray-600 leading-relaxed max-w-xl">
                These paths were chosen based on your skills, available time,
                and income goals. Each comes with a step-by-step roadmap.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate("/quiz")}
                className="btn-secondary flex items-center gap-2"
              >
                <FiRefreshCw size={14} />
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary flex items-center gap-2"
              >
                <FiZap size={14} />
                Go to Dashboard
              </button>
            </div>
          </div>

          {!results && (
            <div className="mb-6 px-5 py-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-700">
              <strong>Demo mode:</strong> Connect to the backend API to get real
              AI-generated paths based on your answers.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path, i) => (
              <ResultCard
                key={path._id || i}
                path={path}
                index={i}
                onSave={() => {}}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Want to save and track your paths?
            </p>
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center gap-2"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
