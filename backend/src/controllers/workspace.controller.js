import Workspace from "../models/workspace-model.js";
import User from "../models/user-model.js";

/* =============================
   CREATE WORKSPACE
============================= */
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   GET USER WORKSPACES
============================= */
export const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user._id,
    }).populate("owner", "fullName email");

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   GET SINGLE WORKSPACE
============================= */
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate("owner", "fullName email")
      .populate("members", "fullName email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   UPDATE WORKSPACE
============================= */
export const updateWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.name = name || workspace.name;
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   DELETE WORKSPACE (SOFT)
============================= */
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.isDeleted = true;
    await workspace.save();

    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   ADD MEMBER
============================= */
export const addWorkspaceMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (!workspace.members.includes(userId)) {
      workspace.members.push(userId);
      await workspace.save();
    }

    res.json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   REMOVE MEMBER
============================= */
export const removeWorkspaceMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.members = workspace.members.filter(
      (member) => member.toString() !== userId
    );

    await workspace.save();

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
