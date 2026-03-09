import express from "express";
import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
} from "../controllers/workspace.controller.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔥 Create Workspace
router.post("/", protect, createWorkspace);

// 🔥 Get all workspaces of logged-in user
router.get("/", protect, getUserWorkspaces);

// 🔥 Get single workspace
router.get("/:workspaceId", protect, getWorkspaceById);

// 🔥 Update workspace (only admin/subadmin)
router.put(
  "/:workspaceId",
  protect,
  authorizeRoles("admin", "subadmin"),
  updateWorkspace
);

// 🔥 Delete workspace (only admin)
router.delete(
  "/:workspaceId",
  protect,
  authorizeRoles("admin"),
  deleteWorkspace
);

// 🔥 Add member to workspace (admin/subadmin)
router.post(
  "/:workspaceId/members",
  protect,
  authorizeRoles("admin", "subadmin"),
  addWorkspaceMember
);

// 🔥 Remove member from workspace (admin only)
router.delete(
  "/:workspaceId/members/:userId",
  protect,
  authorizeRoles("admin"),
  removeWorkspaceMember
);

export default router;
