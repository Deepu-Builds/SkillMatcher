import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiZap,
  FiMenu,
  FiX,
  FiUser,
  FiBookmark,
  FiClock,
  FiGrid,
  FiCompass,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isLanding = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <FiZap size={16} className="font-bold" />
            </span>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              SkillMatcher
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${isActive ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}`
                  }
                >
                  Explore Paths
                </NavLink>
                <a
                  href="/#features"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  Features
                </a>
                <a
                  href="/#pricing"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  Pricing
                </a>
                <a
                  href="/#how-it-works"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  How It Works
                </a>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${isActive ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}`
                  }
                >
                  <FiGrid size={14} /> Dashboard
                </NavLink>
                <NavLink
                  to="/quiz"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${isActive ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}`
                  }
                >
                  <FiZap size={14} /> New Quiz
                </NavLink>
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${isActive ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}`
                  }
                >
                  <FiCompass size={14} /> Explore
                </NavLink>
                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${isActive ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}`
                  }
                >
                  <FiBookmark size={14} /> Saved
                </NavLink>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <FiChevronDown
                    size={13}
                    className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/60 py-1.5 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    {[
                      { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
                      { to: "/saved", icon: FiBookmark, label: "Saved Paths" },
                      { to: "/history", icon: FiClock, label: "Quiz History" },
                      {
                        to: "/profile",
                        icon: FiUser,
                        label: "Account Settings",
                      },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Icon size={14} /> {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1 shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              {[
                { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
                { to: "/quiz", icon: FiZap, label: "New Quiz" },
                { to: "/explore", icon: FiCompass, label: "Explore Paths" },
                { to: "/saved", icon: FiBookmark, label: "Saved Paths" },
                { to: "/history", icon: FiClock, label: "Quiz History" },
                { to: "/profile", icon: FiUser, label: "Account Settings" },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100 pt-3"
              >
                <FiLogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/explore"
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Explore Paths
              </Link>
              <a
                href="/#features"
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Features
              </a>
              <a
                href="/#pricing"
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Pricing
              </a>
              <a
                href="/#how-it-works"
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                How It Works
              </a>
              <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="btn-secondary text-center text-sm py-2.5"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-center text-sm py-2.5"
                >
                  Get Started Free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
