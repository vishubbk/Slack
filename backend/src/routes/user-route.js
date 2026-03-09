import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword,
  getUserById,
  searchUsers,
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔓 Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);


// 👤 Profile Routes
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// 🔍 User Search (for DM / Add members)
router.get("/search", protect, searchUsers);

// 📄 Get user by ID
router.get("/:userId", protect, getUserById);

export default router;
