import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiArrowLeft, FiZap, FiSearch } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-16 group">
        <span className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white transition-transform group-hover:scale-110">
          <FiZap size={17} />
        </span>
        <span className="font-display font-bold text-xl text-gray-900">
          SkillMatcher
        </span>
      </Link>

      <div className="text-center max-w-md">
        {/* 404 Display */}
        <div className="relative mb-8">
          <p className="text-[9rem] font-black text-gray-100 leading-none select-none font-display tracking-tighter">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400 shadow-sm">
              <FiSearch size={36} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 font-display mb-3">
          This page doesn't exist
        </h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Looks like you took a wrong turn. The page you're looking for might
          have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FiArrowLeft size={15} />
            Go Back
          </button>
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FiHome size={15} />
            {isAuthenticated ? "Dashboard" : "Go Home"}
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4">
            Or visit one of these pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Take the Quiz", to: "/quiz" },
              { label: "See Pricing", to: "/#pricing" },
              { label: "Login", to: "/login" },
              { label: "Register", to: "/register" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors border border-orange-200 hover:border-orange-300 px-3.5 py-1.5 rounded-lg"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
