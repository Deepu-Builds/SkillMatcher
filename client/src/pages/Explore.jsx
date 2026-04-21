import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiZap,
  FiX,
  FiBookmark,
} from "react-icons/fi";
import { getDifficultyBadgeClass } from "../utils/formatters";
import { pathsApi } from "../api/pathsApi";
import SkeletonLoader from "../components/SkeletonLoader";
import Navbar from "../components/Navbar";

const ALL_PATHS = [];

const CATEGORIES = [
  "All",
  "Creative",
  "Tech",
  "Education",
  "Business",
  "Health",
];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const PathCard = ({ path, saved, onSave }) => {
  const [starsCount, setStarsCount] = useState(path.stars?.length || 0);
  const [savesCount, setSavesCount] = useState(path.saves?.length || 0);
  const [isStarred, setIsStarred] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleStar = async () => {
    try {
      const { data } = await pathsApi.toggleStar(path._id);
      setIsStarred(data.isStarred);
      setStarsCount(data.starsCount);
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  const handleSaveClick = async () => {
    try {
      const { data } = await pathsApi.toggleSave(path._id);
      setIsSaved(data.isSaved);
      setSavesCount(data.savesCount);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  return (
    <div className="card-interactive group flex flex-col h-full">
      {/* Header: Badges and Title */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`badge ${path.difficulty === "Beginner" ? "badge-success" : path.difficulty === "Intermediate" ? "badge-primary" : "badge-danger"}`}
        >
          {path.difficulty}
        </span>
        <span className="badge">{path.category}</span>
      </div>

      <h3 className="text-card-title line-clamp-2 mb-3">{path.title}</h3>

      {/* Description */}
      <p className="text-body-sm line-clamp-2 mb-4">{path.description}</p>

      {/* Meta: Income & Time */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FiDollarSign size={14} className="text-orange-500 shrink-0" />
          <span className="text-sm font-semibold text-slate-900">
            {path.incomeRange}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock size={14} className="text-orange-500 shrink-0" />
          <span className="text-sm text-slate-600">{path.timeToStart}</span>
        </div>
      </div>

      {/* Skills */}
      {path.skillsNeeded?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {path.skillsNeeded.slice(0, 3).map((skill) => (
            <span key={skill} className="badge text-xs">
              {skill}
            </span>
          ))}
          {path.skillsNeeded.length > 3 && (
            <span className="badge text-xs text-slate-500">
              +{path.skillsNeeded.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Stats Row: Stars & Saves */}
      <div className="flex items-center gap-6 py-3 border-t border-slate-200 text-sm text-slate-600 mt-auto mb-4">
        <button
          onClick={handleStar}
          className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
            isStarred ? "text-orange-600" : "hover:text-orange-600"
          }`}
          title={isStarred ? "Remove star" : "Star this path"}
        >
          <span className="text-base leading-none">
            {isStarred ? "★" : "☆"}
          </span>
          <span>{starsCount}</span>
        </button>

        <button
          onClick={handleSaveClick}
          className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
            isSaved ? "text-orange-600" : "hover:text-orange-600"
          }`}
          title={isSaved ? "Remove from saves" : "Save this path"}
        >
          <FiBookmark
            size={14}
            className={`shrink-0 ${isSaved ? "fill-current" : ""}`}
          />
          <span>{savesCount}</span>
        </button>
      </div>

      {/* CTA Button */}
      <div className="w-full mt-auto pt-4">
        <Link
          to={`/dashboard/path/${path._id}`}
          className="btn-primary w-full text-center block inline-flex items-center justify-center gap-2"
        >
          Unlock Earning Plan
          <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

const Explore = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [savedIds, setSavedIds] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    setLoading(true);
    try {
      const { data } = await pathsApi.getBuiltInPaths();
      if (data?.paths?.length) {
        setPaths(data.paths);
      }
    } catch (err) {
      console.error("Failed to load paths:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const hasFilters = search || category !== "All" || difficulty !== "All";
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setDifficulty("All");
  };

  const filtered = paths
    .filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.skillsNeeded?.some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        ),
    )
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => difficulty === "All" || p.difficulty === difficulty);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="section-container">
          {/* Premium Hero Header */}
          <div className="mb-16 text-center">
            <span className="inline-block text-sm font-semibold text-orange-600 uppercase tracking-widest mb-3">
              🚀 Discover Income Paths
            </span>
            <h1 className="text-hero mb-4">
              Explore {paths.length} Curated Paths
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find the perfect income path tailored to your skills, interests,
              and goals
            </p>
          </div>

          {/* Premium CTA Card */}
          <div className="card-elevated mb-12 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <FiZap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Get Personalized Matches
                  </h3>
                  <p className="text-slate-600">
                    Take our 3-minute quiz to discover paths matched to your
                    skills
                  </p>
                </div>
              </div>
              <Link
                to="/quiz"
                className="btn-primary active-scale shrink-0 px-8 py-3 flex items-center gap-2"
              >
                Start Quiz
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-6 mb-10">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search paths, skills, categories..."
                className="input-field pl-12 py-3 text-base w-full"
              />
            </div>

            {/* Category Pills */}
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                Category
              </p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      category === c
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filters */}
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                Difficulty
              </p>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(difficulty === d ? "All" : d)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      difficulty === d
                        ? d === "Beginner"
                          ? "bg-green-500 text-white shadow-md"
                          : d === "Intermediate"
                            ? "bg-orange-500 text-white shadow-md"
                            : d === "Advanced"
                              ? "bg-red-500 text-white shadow-md"
                              : "bg-slate-200 text-slate-900"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="btn-outline px-4 py-2 text-sm w-fit"
              >
                <FiX size={14} className="inline mr-1.5" /> Clear Filters
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "path" : "paths"} found
                {hasFilters && (
                  <span className="text-slate-500">
                    {" "}
                    (filtered from {paths.length})
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FiBookmark size={14} className="text-orange-500" />
              <span>{savedIds.length} saved</span>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : filtered.length === 0 ? (
            <div className="empty-state-premium">
              <div className="empty-state-icon-premium">
                <FiSearch size={28} />
              </div>
              <h3 className="empty-state-title-premium">No paths found</h3>
              <p className="empty-state-desc-premium">
                Try adjusting your filters or search terms to discover more
                income paths
              </p>
              <button onClick={clearFilters} className="btn-primary px-6 py-3">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid-responsive animate-fade-in-up">
              {filtered.map((path, idx) => (
                <div
                  key={path._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <PathCard
                    path={path}
                    saved={savedIds.includes(path._id)}
                    onSave={handleSave}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
