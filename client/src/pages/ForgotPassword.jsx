import { useState } from "react";
import { Link } from "react-router-dom";
import { FiZap, FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

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
            {submitted ? "Check your inbox" : "Reset your password"}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            {submitted
              ? `We sent a password reset link to ${email}`
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-5">
                <FiCheck size={28} />
              </div>
              <p className="text-sm text-gray-600 mb-6">
                If an account exists with <strong>{email}</strong>, you'll
                receive an email with instructions to reset your password. Check
                your spam folder if you don't see it within a few minutes.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="btn-secondary w-full text-sm py-3"
                >
                  Try a different email
                </button>
                <Link
                  to="/login"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
