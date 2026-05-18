import prisma from "../db/db.js";

/* =============================
   CREATE WORKSPACE
============================= */
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        owner: {
          connect: {
            id: req.user.id,
          },
        },
        members: {
          connect: [{
            id: req.user.id,
          }],
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error creating workspace:", error);
  }
};

/* =============================
   GET USER WORKSPACES
============================= */
export const getUserWorkspaces = async (req, res) => {
  try {
    const admin = req.user.email;
    if(!admin){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            id: req.user.id,
          },
        },
        isDeleted: false,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json( { data: workspaces, admin} );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   GET SINGLE WORKSPACE
============================= */
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
          },
        },
        channels: true,
      },
    });

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

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId,
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: {
        id: req.params.workspaceId,
      },
      data: {
        name: name || workspace.name,
      },
    });

    res.json(updatedWorkspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   DELETE WORKSPACE (SOFT)
============================= */
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId,
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    await prisma.workspace.update({
      where: {
        id: req.params.workspaceId,
      },
      data: {
        isDeleted: true,
      },
    });

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

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId,
      },
      include: {
        members: true,
      },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const memberExists = workspace.members.some(
      (member) => member.id === userId
    );

    if (!memberExists) {
      await prisma.workspace.update({
        where: {
          id: req.params.workspaceId,
        },
        data: {
          members: {
            connect: [{
              id: userId,
            }],
          },
        },
      });
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

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId,
      },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    await prisma.workspace.update({
      where: {
        id: req.params.workspaceId,
      },
      data: {
        members: {
          disconnect: [{
            id: userId,
          }],
        },
      },
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
