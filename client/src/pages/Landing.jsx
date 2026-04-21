import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import {
  FiZap,
  FiArrowRight,
  FiTarget,
  FiBarChart2,
  FiUsers,
  FiAward,
  FiClipboard,
  FiBriefcase,
  FiMap,
  FiTrendingUp,
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiStar,
  FiCheck,
  FiShield,
  FiCpu,
} from "react-icons/fi";

// ─── HERO ────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative pt-32 pb-24 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(249,115,22,0.12),transparent)]" />
    <div className="section-container relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100/50 border border-orange-200 text-orange-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
          <FiZap size={14} className="animate-pulse" />
          AI-Powered Income Path Discovery
        </div>
        <h1 className="text-hero mb-6">
          Turn Your Skills Into{" "}
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent relative inline-block">
            Real Income
            <svg
              className="absolute -bottom-3 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M2 9C60 3 120 1 150 1C180 1 240 3 298 9"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          Answer 5 quick questions. Our AI analyzes your unique skills and
          matches you with personalized income paths — complete with
          step-by-step roadmaps.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to="/register"
            className="btn-primary btn-primary-lg flex items-center gap-2 active-scale"
          >
            Discover Your Path
            <FiArrowRight size={18} />
          </Link>
          <Link to="/#how-it-works" className="btn-outline px-8 py-4 text-base">
            See How It Works
          </Link>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          ✓ Free to start · ✓ No credit card · ✓ Takes 3 minutes
        </p>
      </div>

      {/* Dashboard mockup */}
      <div className="mt-20 relative max-w-5xl mx-auto">
        <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-400 font-medium">
              SkillMatcher Dashboard
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Freelance Content Writer",
                income: "$800–$2,500/mo",
                diff: "Beginner",
                prog: 65,
              },
              {
                title: "UX/UI Design Consultant",
                income: "$2,000–$6,000/mo",
                diff: "Intermediate",
                prog: 30,
              },
              {
                title: "Online Course Creator",
                income: "$1,500–$8,000/mo",
                diff: "Intermediate",
                prog: 10,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-4 bg-gray-50/50"
              >
                <span
                  className={`badge text-xs ${item.diff === "Beginner" ? "badge-beginner" : "badge-intermediate"}`}
                >
                  {item.diff}
                </span>
                <p className="font-bold text-gray-900 text-sm mt-2 font-display leading-snug">
                  {item.title}
                </p>
                <p className="text-xs text-orange-500 font-semibold mt-1">
                  {item.income}
                </p>
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${item.prog}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {item.prog}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
      </div>
    </div>
  </section>
);

// ─── STATS ────────────────────────────────────────────────────────────────────
const Stats = () => (
  <section className="py-20 border-y border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50">
    <div className="section-container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "12,000+", label: "Paths Generated", icon: FiBarChart2 },
          { value: "94%", label: "Match Accuracy", icon: FiTarget },
          { value: "8,500+", label: "Active Users", icon: FiUsers },
          { value: "3 min", label: "To Get Results", icon: FiZap },
        ].map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600">
              <Icon size={20} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{value}</span>
            <span className="text-sm text-slate-600 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-slate-50/50">
    <div className="section-container">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-sm font-semibold text-orange-600 uppercase tracking-widest">
          ✨ Simple Process
        </span>
        <h2 className="text-section-title mt-4 mb-4">
          Four steps to your income path
        </h2>
        <p className="text-lg text-slate-600">
          No fluff, no generic advice. Just a focused, personalized process that
          matches your real skills to real income opportunities.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            step: "01",
            icon: FiClipboard,
            title: "Answer 5 Questions",
            desc: "Tell us what you're good at, how much time you have, and your income goals.",
          },
          {
            step: "02",
            icon: FiCpu,
            title: "AI Analyzes Your Profile",
            desc: "Gemini AI processes your answers and matches you with realistic, relevant paths.",
          },
          {
            step: "03",
            icon: FiBriefcase,
            title: "Get 3 Custom Paths",
            desc: "Receive three personalized income paths ranked by fit, difficulty, and earning potential.",
          },
          {
            step: "04",
            icon: FiMap,
            title: "Follow Your Roadmap",
            desc: "Each path includes a step-by-step 30-day action plan to get you started immediately.",
          },
        ].map(({ step, icon: Icon, title, desc }) => (
          <div
            key={step}
            className="card relative group hover:border-orange-200 transition-all"
          >
            <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
              {step}
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-200 transition-colors">
              <Icon size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const Features = () => (
  <section id="features" className="py-24 bg-slate-50">
    <div className="section-container">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-orange-600 uppercase tracking-widest">
          <FiTarget size={16} />
          Everything You Need
        </span>
        <h2 className="text-section-title mt-4 mb-4">
          Built for serious income seekers
        </h2>
        <p className="text-lg text-slate-600">
          Comprehensive tools to discover, plan, and execute your income path
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: FiCpu,
            title: "Gemini AI Analysis",
            desc: "Powered by Google's Gemini model for nuanced skill matching and personalized path generation.",
          },
          {
            icon: FiMap,
            title: "30-Day Roadmaps",
            desc: "Each path includes concrete step-by-step action plans, not generic advice.",
          },
          {
            icon: FiTrendingUp,
            title: "Progress Tracking",
            desc: "Track your journey through each roadmap. Mark steps complete and stay motivated.",
          },
          {
            icon: FiAward,
            title: "Difficulty Ratings",
            desc: "Every path is rated Beginner, Intermediate, or Advanced so you start where you're ready.",
          },
          {
            icon: FiShield,
            title: "Realistic Income Ranges",
            desc: "All income projections are grounded in real market data — no false promises.",
          },
          {
            icon: FiTarget,
            title: "Skill Tag Matching",
            desc: "Our AI categorizes your skills and cross-references hundreds of viable income models.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
              <Icon size={20} />
            </div>
            <h3 className="font-bold text-gray-900 font-display mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const Testimonials = () => (
  <section className="py-24 bg-white">
    <div className="section-container">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">
          Real Results
        </span>
        <h2 className="text-section-title mt-4">
          People are already earning through their paths
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "Sarah M.",
            role: "Teacher → Content Strategist",
            rating: 5,
            text: "Didn't know my teaching skills translated to content strategy. The roadmap showed exactly what to learn and how to pitch clients. Made $1,200 in month two.",
          },
          {
            name: "James T.",
            role: "Accountant → Excel Consultant",
            rating: 5,
            text: 'Specific guidance — not just "learn Excel" but which features, where to find clients, pricing. $0 to $3K/month in 90 days.',
          },
          {
            name: "Priya K.",
            role: "Designer → UX Consultant",
            rating: 5,
            text: "I knew design but not how to position for higher income. The AI showed exactly where my skills fit in consulting. Game changer.",
          },
        ].map(({ name, role, rating, text }) => (
          <div
            key={name}
            className="card hover:shadow-lg hover:border-orange-200 transition-all"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(rating)].map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className="text-orange-400 fill-orange-400"
                />
              ))}
            </div>
            <p className="text-base text-slate-700 leading-relaxed mb-5 flex-1">
              "{text}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-700 font-bold text-sm">
                {name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── PRICING ──────────────────────────────────────────────────────────────────
const Pricing = () => (
  <section id="pricing" className="py-24 bg-gray-50">
    <div className="section-container">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">
          Pricing
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 font-display">
          Start free, scale when ready
        </h2>
        <p className="mt-4 text-gray-600">
          No subscriptions required to get started.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[
          {
            name: "Free",
            price: "$0",
            period: "forever",
            desc: "Everything you need to discover your path.",
            features: [
              "1 AI-powered quiz per month",
              "3 career path suggestions",
              "Basic roadmap (5 steps)",
              "Progress tracking",
            ],
            cta: "Get Started Free",
            ctaLink: "/register",
            highlight: false,
          },
          {
            name: "Pro",
            price: "$12",
            period: "per month",
            desc: "For serious career-changers who want full access.",
            features: [
              "Unlimited AI quizzes",
              "Up to 5 career paths per result",
              "Full 30-day roadmaps",
              "Priority AI analysis",
              "Path bookmarking",
              "Email progress reports",
            ],
            cta: "Start Pro Plan",
            ctaLink: "/register",
            highlight: true,
          },
        ].map(
          ({
            name,
            price,
            period,
            desc,
            features,
            cta,
            ctaLink,
            highlight,
          }) => (
            <div
              key={name}
              className={`rounded-2xl p-8 border-2 transition-all duration-200 ${highlight ? "border-orange-500 bg-white shadow-xl shadow-orange-100/50" : "border-gray-200 bg-white"}`}
            >
              {highlight && (
                <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="font-display font-bold text-xl text-gray-900">
                {name}
              </h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900 font-display">
                  {price}
                </span>
                <span className="text-sm text-gray-400 pb-1">/{period}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{desc}</p>
              <ul className="mt-6 space-y-3">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-700"
                  >
                    <FiCheck size={14} className="text-orange-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={ctaLink}
                className={`mt-8 w-full block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${highlight ? "btn-primary" : "btn-secondary"}`}
              >
                {cta}
              </Link>
            </div>
          ),
        )}
      </div>
    </div>
  </section>
);

// ─── CTA ──────────────────────────────────────────────────────────────────────
const CTA = () => (
  <section className="py-24 bg-gradient-to-b from-white to-slate-50">
    <div className="section-container">
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl px-8 py-20 text-center max-w-4xl mx-auto relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />
        <div className="relative space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to turn your skills into income?
          </h2>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of people who've transformed their natural skills
            into consistent, real income. Discover your personalized path in
            just 3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/register"
              className="btn-primary bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-bold shadow-lg active-scale"
            >
              Start For Free
              <FiArrowRight size={18} className="ml-2" />
            </Link>
            <p className="text-orange-100 text-sm">✓ No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-gray-100 py-12 bg-white">
    <div className="section-container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white">
            <FiZap size={13} />
          </span>
          <span className="font-display font-bold text-gray-900">
            SkillMatcher
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/#features"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {[FiTwitter, FiGithub, FiLinkedin].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all duration-200"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} SkillMatcher. All rights reserved. Built
          with AI for real people.
        </p>
      </div>
    </div>
  </footer>
);

// ─── LANDING (assembled) ──────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  return (
    <div>
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
