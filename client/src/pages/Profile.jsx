import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiTrash2,
  FiAlertCircle,
  FiCheck,
  FiShield,
  FiBell,
  FiLogOut,
  FiEdit2,
  FiX,
  FiCopy,
  FiExternalLink,
  FiChevronRight,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiBookOpen,
  FiActivity,
  FiGlobe,
  FiLink2,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiGrid,
  FiList,
  FiDownload,
  FiRefreshCw,
  FiInfo,
  FiCheckCircle,
  FiClock,
  FiZap,
  FiTarget,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/authApi";
import Navbar from "../components/Navbar";

// ─── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold backdrop-blur-sm animate-toast-in pointer-events-auto
          ${t.type === "success" ? "bg-emerald-500/95 text-white" : t.type === "error" ? "bg-red-500/95 text-white" : "bg-slate-800/95 text-white"}`}
      >
        {t.type === "success" ? (
          <FiCheckCircle size={16} />
        ) : t.type === "error" ? (
          <FiAlertCircle size={16} />
        ) : (
          <FiInfo size={16} />
        )}
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── Section Card ────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, icon: Icon, children, accent }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-5 group hover:shadow-md transition-shadow duration-300">
    <div
      className={`px-8 py-5 border-b border-gray-100 flex items-center gap-3 ${accent ? "bg-gradient-to-r from-orange-50 to-amber-50/30" : "bg-gray-50/50"}`}
    >
      {Icon && (
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-600"}`}
        >
          <Icon size={16} />
        </div>
      )}
      <div>
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-8 py-6">{children}</div>
  </div>
);

// ─── Stat Badge ──────────────────────────────────────────────────────────────
const StatBadge = ({ icon: Icon, label, value, color }) => (
  <div
    className={`flex flex-col items-center p-4 rounded-xl border ${color} gap-1`}
  >
    <Icon size={18} className="opacity-70" />
    <span className="text-2xl font-black">{value}</span>
    <span className="text-xs font-medium opacity-60">{label}</span>
  </div>
);

// ─── Toggle ──────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${checked ? "bg-orange-500" : "bg-gray-200"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-0"}`}
    />
  </button>
);

// ─── Input Field ─────────────────────────────────────────────────────────────
const InputField = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  hint,
  badge,
  rightEl,
  error,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {badge && (
        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
          {badge}
        </span>
      )}
    </div>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} ${rightEl ? "pr-12" : "pr-4"} py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white
          disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
    {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <FiAlertCircle size={11} />
        {error}
      </p>
    )}
  </div>
);

// ─── Password Strength ───────────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  if (!password) return null;
  const score = getStrength(password);
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-emerald-400",
  ];
  const textColors = [
    "text-red-500",
    "text-yellow-500",
    "text-blue-500",
    "text-emerald-500",
  ];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${score > 0 ? textColors[score - 1] : "text-gray-400"}`}
      >
        {score > 0 ? labels[score - 1] : ""}
      </p>
    </div>
  );
};

// ─── Activity Chart ──────────────────────────────────────────────────────────
const ActivityChart = ({ data }) => {
  const max = Math.max(...data, 1);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-orange-400/80 transition-all duration-500"
            style={{
              height: `${(v / max) * 48}px`,
              minHeight: v > 0 ? "4px" : "0",
            }}
          />
          <span className="text-[9px] text-gray-400">{days[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Skill Tag ───────────────────────────────────────────────────────────────
const SkillTag = ({ skill, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-lg border border-orange-200/60 group/tag">
    {skill}
    {onRemove && (
      <button
        onClick={() => onRemove(skill)}
        className="opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-red-500"
      >
        <FiX size={11} />
      </button>
    )}
  </span>
);

// ─── Avatar Crop Modal ───────────────────────────────────────────────────────
const AvatarModal = ({ src, onSave, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Preview Photo</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiX size={18} />
        </button>
      </div>
      <img
        src={src}
        alt="Preview"
        className="w-full aspect-square object-cover rounded-xl mb-4"
      />
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(src)}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Save Photo
        </button>
      </div>
    </div>
  </div>
);

// ─── Delete Confirm Modal ────────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onClose, loading }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <FiTrash2 size={24} className="text-red-500" />
      </div>
      <h3 className="font-bold text-gray-900 text-center text-lg mb-1">
        Delete Account?
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        This will permanently delete your account and all data. This action{" "}
        <strong>cannot</strong> be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ─── SESSION ITEM ────────────────────────────────────────────────────────────
const SessionItem = ({ device, location, time, current }) => (
  <div
    className={`flex items-center justify-between p-4 rounded-xl border ${current ? "border-orange-200 bg-orange-50/50" : "border-gray-100 bg-gray-50/50"}`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${current ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500"}`}
      >
        <FiGlobe size={14} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{device}</p>
        <p className="text-xs text-gray-400">
          {location} · {time}
        </p>
      </div>
    </div>
    {current ? (
      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full">
        Current
      </span>
    ) : (
      <button className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
        Revoke
      </button>
    )}
  </div>
);

// ─── Sidebar Nav ─────────────────────────────────────────────────────────────
const navItems = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "stats", label: "Stats & Activity", icon: FiActivity },
  { id: "skills", label: "Skills & Interests", icon: FiStar },
  { id: "links", label: "Social Links", icon: FiLink2 },
  { id: "security", label: "Security", icon: FiShield },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "sessions", label: "Sessions", icon: FiGlobe },
  { id: "danger", label: "Danger Zone", icon: FiTrash2, danger: true },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();

  // Profile
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    occupation: user?.occupation || "",
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Avatar
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Password
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [pwErrors, setPwErrors] = useState({});

  // Skills
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(user?.skillTags || []);

  // Social Links
  const [links, setLinks] = useState({
    twitter: user?.links?.twitter || "",
    linkedin: user?.links?.linkedin || "",
    github: user?.links?.github || "",
    portfolio: user?.links?.portfolio || "",
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    weekly: true,
    milestones: false,
    achievements: true,
    newPaths: false,
    security: true,
    ...(user?.notifications || {}),
  });

  // Theme & Display
  const [displayMode, setDisplayMode] = useState("grid");
  const [profileVisible, setProfileVisible] = useState(true);

  // UI state
  const [activeSection, setActiveSection] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingBio, setEditingBio] = useState(false);

  // Sessions (mock data for UI)
  const sessions = [
    {
      device: "Chrome on macOS",
      location: "Mumbai, IN",
      time: "Active now",
      current: true,
    },
    {
      device: "Safari on iPhone",
      location: "Mumbai, IN",
      time: "2h ago",
      current: false,
    },
    {
      device: "Firefox on Windows",
      location: "Delhi, IN",
      time: "3 days ago",
      current: false,
    },
  ];

  // Activity mock
  const activity = [4, 7, 2, 9, 5, 1, 6];

  const sectionRefs = useRef({});

  useEffect(() => {
    if (user?.notifications)
      setNotifications((p) => ({ ...p, ...user.notifications }));
    if (user?.avatar) setAvatar(user.avatar);
    if (user?.skillTags) setSkills(user.skillTags);
  }, [user]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // ── Toast system ──
  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  // ── Validate profile ──
  const validateProfile = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = "Name is required";
    if (!profile.email.includes("@")) errors.email = "Invalid email address";
    if (profile.website && !profile.website.match(/^https?:\/\//))
      errors.website = "Must start with http:// or https://";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Save profile ──
  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      showToast("Please fix the errors", "error");
      return;
    }
    setSaving(true);
    try {
      const { data } = await authApi.updateMe(profile);
      // Server returns { success, message, user } — sync that user into store
      const serverUser = data?.user;
      if (serverUser) {
        updateUser(serverUser);
      } else {
        updateUser(profile);
      }
      showToast("Profile updated successfully");
      setProfileErrors({});
    } catch (err) {
      // API failed — at least update locally so UI reflects change
      updateUser(profile);
      showToast(
        err.response?.data?.message || "Profile updated locally",
        "info",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Password validation ──
  const validatePassword = () => {
    const errors = {};
    if (!passwords.current) errors.current = "Required";
    if (!passwords.newPass) errors.newPass = "Required";
    else if (passwords.newPass.length < 8)
      errors.newPass = "At least 8 characters";
    if (passwords.newPass !== passwords.confirm)
      errors.confirm = "Passwords don't match";
    setPwErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      showToast("Please fix password errors", "error");
      return;
    }
    setSaving(true);
    try {
      await authApi.updateMe({ password: passwords.newPass });
      setPasswords({ current: "", newPass: "", confirm: "" });
      showToast("Password changed successfully");
      setPwErrors({});
    } catch (err) {
      showToast("Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Notifications ──
  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const { data } = await authApi.updateMe({ notifications });
      updateUser(data?.user || { ...user, notifications });
      showToast("Notification preferences saved");
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Social links ──
  const handleSaveLinks = async () => {
    setSaving(true);
    try {
      await authApi.updateMe({ links });
      updateUser({ ...user, links });
      showToast("Social links updated");
    } catch {
      showToast("Links saved locally");
    } finally {
      setSaving(false);
    }
  };

  // ── Skills ──
  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s) || skills.length >= 20) return;
    const newSkills = [...skills, s];
    setSkills(newSkills);
    setSkillInput("");
    authApi.updateMe({ skillTags: newSkills }).catch(() => {});
    updateUser({ ...user, skillTags: newSkills });
  };

  const removeSkill = (skill) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    authApi.updateMe({ skillTags: newSkills }).catch(() => {});
    updateUser({ ...user, skillTags: newSkills });
  };

  // ── Image compression & upload ──
  const compressImage = (base64, callback) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 400;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.75));
    };
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be less than 5MB", "error");
      return;
    }
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      compressImage(ev.target.result, (compressed) =>
        setPreviewAvatar(compressed),
      );
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = async (compressed) => {
    setPreviewAvatar(null);
    setAvatar(compressed);
    setUploading(true);
    try {
      const { data } = await authApi.updateMe({ avatar: compressed });
      // Always sync from server response so other sessions stay in sync
      const updatedUser = data?.user;
      if (updatedUser) {
        updateUser(updatedUser);
        setAvatar(updatedUser.avatar);
      } else {
        updateUser({ ...user, avatar: compressed });
      }
      showToast("Profile photo updated");
    } catch {
      // Still update locally so current session sees it
      updateUser({ ...user, avatar: compressed });
      showToast("Photo saved locally");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatar("");
    try {
      await authApi.updateMe({ avatar: "" });
      updateUser({ ...user, avatar: "" });
      showToast("Profile photo removed");
    } catch {
      showToast("Photo removed", "info");
    }
  };

  // ── Delete account ──
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authApi.deleteAccount();
      logout();
      window.location.href = "/";
    } catch {
      showToast("Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Copy profile link ──
  const copyProfileLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/u/${user?._id || "me"}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Profile link copied!");
  };

  // ── Export data ──
  const exportData = () => {
    const data = JSON.stringify(
      { user, skills, links, notifications },
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-data.json";
    a.click();
    showToast("Data exported successfully");
  };

  // ── Scroll to section ──
  const scrollTo = (id) => {
    setActiveSection(id);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const setP = (f) => (e) => setProfile((p) => ({ ...p, [f]: e.target.value }));
  const setPw = (f) => (e) =>
    setPasswords((p) => ({ ...p, [f]: e.target.value }));
  const togglePw = (f) => () => setShowPasswords((p) => ({ ...p, [f]: !p[f] }));
  const setL = (f) => (e) => setLinks((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-toast-in { animation: toastIn 0.25s ease forwards; }
        .nav-item-active { background: #fff9f5; color: #ea580c; border-color: #fed7aa; }
      `}</style>

      <Navbar />
      <Toast toasts={toasts} />
      {previewAvatar && (
        <AvatarModal
          src={previewAvatar}
          onSave={handleAvatarSave}
          onClose={() => setPreviewAvatar(null)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onClose={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ── Hero / Profile Banner ── */}
          <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 rounded-2xl overflow-hidden mb-6 shadow-lg">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative px-8 py-8 flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl ring-4 ring-white/30 overflow-hidden shadow-xl">
                  {avatar && avatar.startsWith("data:") ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-300 flex items-center justify-center text-white text-3xl font-black">
                      {initials}
                    </div>
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
                <button
                  onClick={() =>
                    document.getElementById("avatar-input")?.click()
                  }
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white text-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-50 transition-colors"
                >
                  <FiCamera size={13} />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white truncate">
                    {user?.name || "Your Name"}
                  </h1>
                  {profileVisible && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 text-white rounded-full">
                      Public
                    </span>
                  )}
                </div>
                <p className="text-orange-100 text-sm mt-0.5">{user?.email}</p>
                {profile.occupation && (
                  <p className="text-orange-200 text-xs mt-1 flex items-center gap-1">
                    <FiBriefcase size={11} />
                    {profile.occupation}
                  </p>
                )}
                {profile.location && (
                  <p className="text-orange-200 text-xs mt-0.5 flex items-center gap-1">
                    <FiMapPin size={11} />
                    {profile.location}
                  </p>
                )}
                <p className="text-orange-200 text-xs mt-1 flex items-center gap-1">
                  <FiCalendar size={11} />
                  Member since {memberSince}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={copyProfileLink}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl transition-colors backdrop-blur-sm"
                >
                  {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                {avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="border-t border-white/20 px-8 py-3 grid grid-cols-4 gap-4 bg-black/10">
              {[
                { label: "Paths Saved", value: user?.savedPaths?.length || 0 },
                {
                  label: "Quizzes Taken",
                  value: user?.quizHistory?.length || 0,
                },
                { label: "Skills", value: skills.length },
                { label: "Day Streak", value: 7 },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-white font-black text-xl">{value}</div>
                  <div className="text-orange-200 text-[10px] font-medium">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Layout ── */}
          <div className="flex gap-5 items-start">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-2">
                  {navItems.map(({ id, label, icon: Icon, danger }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left border border-transparent
                        ${activeSection === id && !danger ? "nav-item-active" : danger ? "text-red-400 hover:bg-red-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    >
                      <Icon size={15} />
                      {label}
                      <FiChevronRight
                        size={12}
                        className="ml-auto opacity-30"
                      />
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-3">
                  <button
                    onClick={exportData}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FiDownload size={13} />
                    Export My Data
                  </button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* ── Profile Information ── */}
              <div ref={setRef("profile")}>
                <SectionCard
                  title="Profile Information"
                  subtitle="Your public-facing profile details."
                  icon={FiUser}
                  accent
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Full Name"
                      icon={FiUser}
                      value={profile.name}
                      onChange={setP("name")}
                      placeholder="Your full name"
                      error={profileErrors.name}
                    />
                    <InputField
                      label="Email Address"
                      icon={FiMail}
                      value={profile.email}
                      onChange={setP("email")}
                      placeholder="you@example.com"
                      error={profileErrors.email}
                    />
                    <InputField
                      label="Occupation"
                      icon={FiBriefcase}
                      value={profile.occupation}
                      onChange={setP("occupation")}
                      placeholder="e.g. Software Engineer"
                    />
                    <InputField
                      label="Location"
                      icon={FiMapPin}
                      value={profile.location}
                      onChange={setP("location")}
                      placeholder="e.g. Mumbai, India"
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="Website"
                        icon={FiExternalLink}
                        value={profile.website}
                        onChange={setP("website")}
                        placeholder="https://yoursite.com"
                        error={profileErrors.website}
                        badge="Optional"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Bio
                      </label>
                      <span className="text-xs text-gray-400">
                        {profile.bio.length}/200
                      </span>
                    </div>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        e.target.value.length <= 200 && setP("bio")(e)
                      }
                      placeholder="Write a short bio about yourself..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>

                  {/* Visibility */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Public Profile
                      </p>
                      <p className="text-xs text-gray-400">
                        Allow others to view your profile
                      </p>
                    </div>
                    <Toggle
                      checked={profileVisible}
                      onChange={() => setProfileVisible((v) => !v)}
                    />
                  </div>

                  <div className="mt-5 flex justify-between items-center">
                    <button
                      onClick={() =>
                        setProfile({
                          name: user?.name || "",
                          email: user?.email || "",
                          bio: user?.bio || "",
                          location: "",
                          website: "",
                          occupation: "",
                        })
                      }
                      className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors"
                    >
                      <FiRefreshCw size={13} />
                      Reset
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 py-2.5 px-6 disabled:opacity-60"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiSave size={14} />
                      )}
                      Save Changes
                    </button>
                  </div>
                </SectionCard>
              </div>

              {/* ── Stats & Activity ── */}
              <div ref={setRef("stats")}>
                <SectionCard
                  title="Stats & Activity"
                  subtitle="Your learning progress and engagement."
                  icon={FiActivity}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <StatBadge
                      icon={FiTarget}
                      label="Paths Saved"
                      value={user?.savedPaths?.length || 0}
                      color="border-orange-100 bg-orange-50 text-orange-600"
                    />
                    <StatBadge
                      icon={FiZap}
                      label="Quizzes"
                      value={user?.quizHistory?.length || 0}
                      color="border-blue-100 bg-blue-50 text-blue-600"
                    />
                    <StatBadge
                      icon={FiAward}
                      label="Day Streak"
                      value={7}
                      color="border-amber-100 bg-amber-50 text-amber-600"
                    />
                    <StatBadge
                      icon={FiTrendingUp}
                      label="Skills"
                      value={skills.length}
                      color="border-emerald-100 bg-emerald-50 text-emerald-600"
                    />
                  </div>

                  {/* Weekly activity */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                      <FiClock size={12} />
                      Weekly Activity
                    </p>
                    <ActivityChart data={activity} />
                  </div>

                  {/* Achievements */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                      <FiAward size={12} />
                      Achievements
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {[
                        {
                          label: "Early Adopter",
                          color: "bg-purple-100 text-purple-600",
                          icon: "rocket",
                        },
                        {
                          label: "Quiz Master",
                          color: "bg-blue-100 text-blue-600",
                          icon: "target",
                        },
                        {
                          label: "Skill Builder",
                          color: "bg-emerald-100 text-emerald-600",
                          icon: "⭐",
                        },
                      ].map(({ label, color, icon }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${color}`}
                        >
                          <span>{icon}</span>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* ── Skills & Interests ── */}
              <div ref={setRef("skills")}>
                <SectionCard
                  title="Skills & Interests"
                  subtitle="Add skills to get better path recommendations."
                  icon={FiStar}
                >
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Type a skill and press Enter..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      onClick={addSkill}
                      className="px-4 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <SkillTag
                          key={skill}
                          skill={skill}
                          onRemove={removeSkill}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <FiStar size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">
                        No skills added yet. Add some to get better path
                        recommendations!
                      </p>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {skills.length}/20 skills added
                      </p>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all"
                          style={{ width: `${(skills.length / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </SectionCard>
              </div>

              {/* ── Social Links ── */}
              <div ref={setRef("links")}>
                <SectionCard
                  title="Social Links"
                  subtitle="Connect your social profiles."
                  icon={FiLink2}
                >
                  <div className="space-y-3">
                    <InputField
                      label="Twitter / X"
                      icon={FiTwitter}
                      value={links.twitter}
                      onChange={setL("twitter")}
                      placeholder="https://twitter.com/username"
                    />
                    <InputField
                      label="LinkedIn"
                      icon={FiLinkedin}
                      value={links.linkedin}
                      onChange={setL("linkedin")}
                      placeholder="https://linkedin.com/in/username"
                    />
                    <InputField
                      label="GitHub"
                      icon={FiGithub}
                      value={links.github}
                      onChange={setL("github")}
                      placeholder="https://github.com/username"
                    />
                    <InputField
                      label="Portfolio / Website"
                      icon={FiGlobe}
                      value={links.portfolio}
                      onChange={setL("portfolio")}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={handleSaveLinks}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 py-2.5 px-6"
                    >
                      <FiSave size={14} />
                      Save Links
                    </button>
                  </div>
                </SectionCard>
              </div>

              {/* ── Security ── */}
              <div ref={setRef("security")}>
                <SectionCard
                  title="Security"
                  subtitle="Keep your account secure with a strong password."
                  icon={FiShield}
                >
                  <div className="space-y-4">
                    <InputField
                      label="Current Password"
                      icon={FiLock}
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={setPw("current")}
                      placeholder="Your current password"
                      error={pwErrors.current}
                      rightEl={
                        <button
                          type="button"
                          onClick={togglePw("current")}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.current ? (
                            <FiEyeOff size={15} />
                          ) : (
                            <FiEye size={15} />
                          )}
                        </button>
                      }
                    />
                    <div>
                      <InputField
                        label="New Password"
                        icon={FiLock}
                        type={showPasswords.newPass ? "text" : "password"}
                        value={passwords.newPass}
                        onChange={setPw("newPass")}
                        placeholder="Min. 8 characters"
                        error={pwErrors.newPass}
                        rightEl={
                          <button
                            type="button"
                            onClick={togglePw("newPass")}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPasswords.newPass ? (
                              <FiEyeOff size={15} />
                            ) : (
                              <FiEye size={15} />
                            )}
                          </button>
                        }
                      />
                      <PasswordStrength password={passwords.newPass} />
                    </div>
                    <InputField
                      label="Confirm New Password"
                      icon={FiLock}
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={setPw("confirm")}
                      placeholder="Repeat new password"
                      error={pwErrors.confirm}
                      rightEl={
                        <button
                          type="button"
                          onClick={togglePw("confirm")}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.confirm ? (
                            <FiEyeOff size={15} />
                          ) : (
                            <FiEye size={15} />
                          )}
                        </button>
                      }
                    />
                  </div>

                  {/* Tips */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                      <FiInfo size={12} />
                      Password Tips
                    </p>
                    <ul className="space-y-1">
                      {[
                        "Use at least 8 characters",
                        "Mix uppercase & lowercase",
                        "Include numbers & symbols",
                        "Don't reuse passwords",
                      ].map((tip) => (
                        <li
                          key={tip}
                          className="text-xs text-blue-600 flex items-center gap-1.5"
                        >
                          <FiCheck size={10} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="btn-secondary flex items-center gap-2 py-2.5 px-6"
                    >
                      <FiShield size={14} />
                      Update Password
                    </button>
                  </div>
                </SectionCard>
              </div>

              {/* ── Notifications ── */}
              <div ref={setRef("notifications")}>
                <SectionCard
                  title="Notifications"
                  subtitle="Choose what updates you want to receive."
                  icon={FiBell}
                >
                  <div className="space-y-1">
                    {[
                      {
                        key: "email",
                        label: "Email notifications",
                        desc: "Receive updates about your roadmap progress.",
                        category: "General",
                      },
                      {
                        key: "weekly",
                        label: "Weekly digest",
                        desc: "A summary of your progress every Monday.",
                        category: "General",
                      },
                      {
                        key: "milestones",
                        label: "Milestone alerts",
                        desc: "Get notified when you complete a roadmap step.",
                        category: "Progress",
                      },
                      {
                        key: "achievements",
                        label: "Achievement unlocks",
                        desc: "Celebrate when you earn new badges.",
                        category: "Progress",
                      },
                      {
                        key: "newPaths",
                        label: "New path suggestions",
                        desc: "Discover relevant paths based on your skills.",
                        category: "Discover",
                      },
                      {
                        key: "security",
                        label: "Security alerts",
                        desc: "Login attempts, password changes, etc.",
                        category: "Security",
                      },
                    ].map(({ key, label, desc, category }, i, arr) => {
                      const prevCat = i > 0 ? arr[i - 1].category : null;
                      return (
                        <div key={key}>
                          {prevCat !== category && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-1 first:mt-0">
                              {category}
                            </p>
                          )}
                          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {label}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {desc}
                              </p>
                            </div>
                            <Toggle
                              checked={notifications[key]}
                              onChange={() =>
                                setNotifications((p) => ({
                                  ...p,
                                  [key]: !p[key],
                                }))
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 flex justify-between items-center">
                    <button
                      onClick={() =>
                        setNotifications({
                          email: false,
                          weekly: false,
                          milestones: false,
                          achievements: false,
                          newPaths: false,
                          security: true,
                        })
                      }
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Disable all
                    </button>
                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 py-2.5 px-6"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiBell size={14} />
                      )}
                      Save Preferences
                    </button>
                  </div>
                </SectionCard>
              </div>

              {/* ── Sessions ── */}
              <div ref={setRef("sessions")}>
                <SectionCard
                  title="Active Sessions"
                  subtitle="Devices currently logged into your account."
                  icon={FiGlobe}
                >
                  <div className="space-y-2">
                    {sessions.map((s, i) => (
                      <SessionItem key={i} {...s} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <button className="w-full py-2.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <FiLogOut size={14} />
                      Sign Out All Other Sessions
                    </button>
                  </div>
                </SectionCard>
              </div>

              {/* ── Danger Zone ── */}
              <div ref={setRef("danger")}>
                <div className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-red-100 bg-red-50/50">
                    <h2 className="text-base font-bold text-red-600 flex items-center gap-2">
                      <FiTrash2 size={16} />
                      Danger Zone
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      These actions are irreversible. Proceed with extreme
                      caution.
                    </p>
                  </div>
                  <div className="px-8 py-6 space-y-4">
                    {/* Export before delete */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Export Your Data
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Download a copy of your profile, skills, and activity
                          data.
                        </p>
                      </div>
                      <button
                        onClick={exportData}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
                      >
                        <FiDownload size={14} />
                        Export Data
                      </button>
                    </div>

                    {/* Sign out */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Sign Out
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Sign out from this device.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          window.location.href = "/";
                        }}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
                      >
                        <FiLogOut size={14} />
                        Sign Out
                      </button>
                    </div>

                    {/* Delete account */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          Delete Account
                        </p>
                        <p className="text-xs text-red-400 mt-0.5">
                          Permanently delete your account and all associated
                          data. Cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-white px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors shrink-0"
                      >
                        <FiTrash2 size={14} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
