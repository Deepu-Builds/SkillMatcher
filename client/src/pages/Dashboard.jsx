import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiZap,
  FiPlus,
  FiTrendingUp,
  FiTarget,
  FiClock,
  FiBarChart2,
  FiBookmark,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { pathsApi } from "../api/pathsApi";
import PathCard from "../components/PathCard";
import ProgressBar from "../components/ProgressBar";
import SkeletonLoader from "../components/SkeletonLoader";
import Navbar from "../components/Navbar";

const StatCard = ({ icon: Icon, label, value, sub, color = "orange" }) => {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="card hover:border-orange-200 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon size={22} />
        </div>
      </div>
      <p className="text-sm text-slate-600 font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-2">{sub}</p>}
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadPaths();
  }, [isAuthenticated]);

  const loadPaths = async () => {
    setLoading(true);
    try {
      const { data } = await pathsApi.getPaths();
      if (data?.paths?.length) setPaths(data.paths);
    } catch (err) {
      console.error("Failed to load paths:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPaths = paths.filter((p) => {
    if (activeFilter === "saved") return p.isSaved;
    if (activeFilter === "active")
      return (p.roadmap?.steps?.filter((s) => s.isCompleted).length || 0) > 0;
    return true;
  });

  const totalSteps = paths.reduce(
    (acc, p) => acc + (p.roadmap?.steps?.length || 0),
    0,
  );
  const completedSteps = paths.reduce(
    (acc, p) =>
      acc + (p.roadmap?.steps?.filter((s) => s.isCompleted).length || 0),
    0,
  );
  const overallProgress = totalSteps
    ? Math.round((completedSteps / totalSteps) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="section-container">
          {/* Premium Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Welcome back, {user?.name?.split(" ")[0] || "there"}!
                </h1>
                <p className="text-slate-600 text-lg">
                  Track your income paths, complete milestones, and grow your
                  earnings
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card animate-shimmer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-16 mb-2 animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatCard
                  icon={FiTrendingUp}
                  label="Active Paths"
                  value={paths.length}
                  color="orange"
                />
                <StatCard
                  icon={FiTarget}
                  label="Steps Completed"
                  value={`${completedSteps}/${totalSteps}`}
                  color="green"
                />
                <StatCard
                  icon={FiBarChart2}
                  label="Overall Progress"
                  value={`${overallProgress}%`}
                  color="blue"
                />
                <StatCard
                  icon={FiBookmark}
                  label="Saved Paths"
                  value={paths.filter((p) => p.isSaved).length}
                  color="purple"
                />
              </>
            )}
          </div>

          {/* Progress Section */}
          {loading ? (
            <div className="card mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-32 mb-2 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-48 animate-pulse" />
                </div>
                <div className="h-8 bg-slate-200 rounded w-16 animate-pulse" />
              </div>
              <div className="h-2 bg-slate-200 rounded-full w-full animate-pulse mb-4" />
              <div className="flex gap-6">
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
              </div>
            </div>
          ) : (
            totalSteps > 0 && (
              <div className="card-elevated mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-card-title flex items-center gap-2">
                      <FiBarChart2 size={20} />
                      Overall Progress
                    </h3>
                    <p className="text-body-sm mt-1">
                      Track your advancement across all active paths
                    </p>
                  </div>
                  <span className="text-4xl font-bold text-orange-600">
                    {overallProgress}%
                  </span>
                </div>
                <ProgressBar
                  percent={overallProgress}
                  size="lg"
                  color={overallProgress === 100 ? "green" : "orange"}
                />
                <div className="flex gap-8 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-slate-600">
                      {completedSteps} completed steps
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    <span className="text-slate-600">
                      {totalSteps - completedSteps} remaining
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: "All Paths" },
                  { id: "active", label: "In Progress" },
                  { id: "saved", label: "Saved" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeFilter === f.id ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <Link
                to="/explore"
                className="btn-secondary px-4 py-2 text-sm w-fit"
              >
                <FiPlus size={14} className="inline mr-1.5" /> Explore Paths
              </Link>
            </div>
          </div>

          {/* Paths Grid */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : filteredPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path) => (
                <PathCard
                  key={path._id}
                  path={path}
                  showProgress
                  onSave={() => loadPaths()}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                <FiZap size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No paths yet</h3>
              <p className="text-sm text-gray-600 mb-6">
                Take the assessment to discover income paths tailored to your
                skills
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 font-semibold text-white bg-orange-500 px-6 py-2.5 rounded-lg transition-colors duration-200"
              >
                <FiPlus size={16} /> Start Assessment
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
