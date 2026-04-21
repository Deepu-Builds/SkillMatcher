import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiTrash2,
  FiArrowRight,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiZap,
  FiPlus,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { pathsApi } from "../api/pathsApi";
import ProgressBar from "../components/ProgressBar";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  getDifficultyBadgeClass,
  calculateProgress,
} from "../utils/formatters";
import Navbar from "../components/Navbar";

const MOCK_SAVED = [];

const CATEGORIES = [
  "All",
  "Creative",
  "Tech",
  "Education",
  "Business",
  "Health",
];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const SavedCard = ({ path, onRemove }) => {
  const progress = calculateProgress(path.roadmap?.steps);
  const hasStarted = path.roadmap?.steps?.length > 0;
  return (
    <div className="card flex flex-col gap-4 group transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={getDifficultyBadgeClass(path.difficulty)}>
              {path.difficulty}
            </span>
            <span className="badge bg-gray-100 text-gray-500 text-xs transition-colors duration-200">
              {path.category}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 font-display text-lg leading-snug">
            {path.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onRemove(path._id)}
            className="w-8 h-8 rounded-lg text-gray-300 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Remove from saved"
          >
            <FiTrash2 size={14} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 transition-transform duration-200">
            <FiBookmark size={14} className="fill-orange-500" />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
        {path.description}
      </p>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 transition-all duration-200 cursor-default">
          <FiDollarSign size={14} className="text-orange-500" />
          <span className="font-semibold text-gray-700">
            {path.incomeRange}
          </span>
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

      <ProgressBar
        percent={progress}
        showLabel
        size="md"
        color={progress === 100 ? "green" : "orange"}
      />

      <div className="flex items-center gap-3 mt-auto pt-2">
        {!hasStarted ? (
          <Link
            to={`/dashboard/path/${path._id}`}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-orange-500 px-4 py-2.5 rounded-lg transition-all duration-200"
          >
            Unlock Earning Plan
            <FiArrowRight size={14} />
          </Link>
        ) : (
          <div className="flex-1 flex items-center justify-between text-xs text-gray-500">
            <span>{progress}% Complete</span>
            <Link
              to={`/dashboard/path/${path._id}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition-all duration-200"
            >
              Continue
              <FiArrowRight
                size={13}
                className="group-hover/link:translate-x-0.5 transition-transform duration-200"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const Saved = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [paths, setPaths] = useState(MOCK_SAVED);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [removed, setRemoved] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadSaved();
  }, [isAuthenticated]);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const { data } = await pathsApi.getSavedPaths();
      if (data?.paths?.length) {
        setPaths(data.paths);
      }
    } catch (err) {
      console.error("Failed to load saved paths:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    setRemoved((prev) => [...prev, id]);
    try {
      await pathsApi.deletePath(id);
    } catch {
      /* optimistic */
    }
    setTimeout(() => setPaths((prev) => prev.filter((p) => p._id !== id)), 400);
  };

  const filtered = paths
    .filter((p) => !removed.includes(p._id))
    .filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => difficulty === "All" || p.difficulty === difficulty)
    .sort((a, b) => {
      if (sortBy === "progress")
        return (
          calculateProgress(b.roadmap?.steps) -
          calculateProgress(a.roadmap?.steps)
        );
      if (sortBy === "income")
        return b.incomeRange.localeCompare(a.incomeRange);
      return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="section-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
                Saved Paths
              </h1>
              <p className="mt-1 text-gray-500">
                {filtered.length} saved income{" "}
                {filtered.length === 1 ? "path" : "paths"}
              </p>
            </div>
            <Link
              to="/quiz"
              className="btn-primary flex items-center gap-2 shrink-0"
            >
              <FiPlus size={15} />
              Find More Paths
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved paths..."
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field py-2.5 text-sm w-auto min-w-[130px]"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Difficulty filter */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-field py-2.5 text-sm w-auto min-w-[140px]"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2.5 text-sm w-auto min-w-[150px]"
            >
              <option value="newest">Sort: Newest</option>
              <option value="progress">Sort: Progress</option>
              <option value="income">Sort: Income</option>
            </select>
          </div>

          {/* Cards */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400 mx-auto mb-4">
                <FiBookmark size={24} />
              </div>
              <h3 className="font-bold text-gray-900 font-display mb-2">
                No saved paths
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                {search || category !== "All" || difficulty !== "All"
                  ? "No paths match your filters. Try adjusting them."
                  : "Take the quiz and bookmark the income paths you're interested in."}
              </p>
              <Link
                to="/quiz"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiZap size={14} /> Take the Quiz
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((path) => (
                <SavedCard key={path._id} path={path} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Saved;
