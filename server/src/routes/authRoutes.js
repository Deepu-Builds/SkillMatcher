import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  logout,
  deleteAccount,
  uploadAvatar,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import upload from "../config/multer.js";

const router = Router();

// Public routes (with auth rate limiting)
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);
router.put("/me", protect, updateMe);
router.delete("/me", protect, deleteAccount);
router.post("/logout", protect, logout);

export default router;
