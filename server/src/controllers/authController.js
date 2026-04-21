import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { success, error, created } from "../utils/apiResponse.js";

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return error(res, "Name, email, and password are required", 400);
    }
    if (password.length < 6) {
      return error(res, "Password must be at least 6 characters", 400);
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return error(res, "An account with this email already exists", 409);
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });
    const token = generateToken(user._id);

    return created(
      res,
      { user: user.toPublic(), token },
      "Account created successfully",
    );
  } catch (err) {
    console.error("[register]", err);
    return error(res, err.message || "Registration failed", 500);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");
    if (!user) {
      return error(res, "Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, "Invalid email or password", 401);
    }

    if (!user.isActive) {
      return error(res, "This account has been deactivated", 401);
    }

    const token = generateToken(user._id);
    return success(res, { user: user.toPublic(), token }, "Login successful");
  } catch (err) {
    console.error("[login]", err);
    return error(res, "Login failed", 500);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedPaths",
      "title difficulty incomeRange category",
    );
    return success(res, { user: user.toPublic() });
  } catch (err) {
    console.error("[getMe]", err);
    return error(res, "Failed to fetch profile", 500);
  }
};

// ─── PUT /api/auth/me ─────────────────────────────────────────────────────────
export const updateMe = async (req, res) => {
  try {
    const { name, email, password, notifications, skillTags, avatar } =
      req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (skillTags) user.skillTags = skillTags;
    if (avatar) user.avatar = avatar;
    if (notifications)
      user.notifications = { ...user.notifications, ...notifications };

    // Password change: require current password or just set if provided
    if (password) {
      if (password.length < 6) {
        return error(res, "New password must be at least 6 characters", 400);
      }
      user.password = password; // pre-save hook will hash it
    }

    await user.save();
    return success(
      res,
      { user: user.toPublic() },
      "Profile updated successfully",
    );
  } catch (err) {
    console.error("[updateMe]", err);
    if (err.code === 11000) {
      return error(res, "Email already in use by another account", 409);
    }
    return error(res, err.message || "Failed to update profile", 500);
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = async (_req, res) => {
  // JWT is stateless — client deletes token. Server just confirms.
  return success(res, {}, "Logged out successfully");
};

// ─── DELETE /api/auth/me ──────────────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete the user account
    await User.findByIdAndDelete(userId);

    return success(res, {}, "Account deleted successfully");
  } catch (err) {
    console.error("[deleteAccount]", err);
    return error(res, "Failed to delete account", 500);
  }
};

// ─── POST /api/auth/upload-avatar ─────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "No file uploaded", 400);
    }

    const user = await User.findById(req.user._id);

    // Delete old avatar if it exists
    if (user.avatar && user.avatar.includes("/public/images/avatars/")) {
      const fs = await import("fs/promises");
      const oldPath = user.avatar.replace("/public", "");
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        // File might not exist, continue anyway
        console.log("Could not delete old avatar:", err.message);
      }
    }

    // Set new avatar URL
    const avatarUrl = `/public/images/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;

    await user.save();

    return success(
      res,
      { user: user.toPublic() },
      "Avatar uploaded successfully",
    );
  } catch (err) {
    console.error("[uploadAvatar]", err);
    return error(res, err.message || "Failed to upload avatar", 500);
  }
};
