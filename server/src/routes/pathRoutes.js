import { Router } from "express";
import {
  getPaths,
  getPath,
  savePath,
  deletePath,
  completeStep,
  toggleStar,
  toggleSaveAction,
  getBuiltInPaths,
  getSavedPaths,
} from "../controllers/pathController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// All path routes require authentication
router.use(protect);

router.get("/saved", getSavedPaths);
router.get("/explore/all", getBuiltInPaths);
router.get("/", getPaths);
router.post("/save/:id", savePath);
router.post("/star/:id", toggleStar);
router.post("/save-action/:id", toggleSaveAction);
router.get("/:id", getPath);
router.delete("/:id", deletePath);
router.patch("/:id/step/:stepId", completeStep);

export default router;
