import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiZap,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error } = useAuth();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.includes("@")) errs.email = "Enter a valid email";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    await register(form.name, form.email, form.password);
  };

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white">
              <FiZap size={17} />
            </span>
            <span className="font-display font-bold text-xl text-gray-900">
              SkillMatcher
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Create your account
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Start discovering your income paths in 3 minutes.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Alex Johnson"
                  className={`input-field pl-10 ${fieldErrors.name ? "border-red-300 focus:ring-red-500" : ""}`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="alex@example.com"
                  className={`input-field pl-10 ${fieldErrors.email ? "border-red-300 focus:ring-red-500" : ""}`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${fieldErrors.password ? "border-red-300 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <FiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Register;
