import Channel from "../models/channel-model.js";
import User from "../models/user-model.js";

/* =====================================
   CREATE OR GET DM (1-to-1)
===================================== */
export const createOrGetDM = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const currentUser = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    if (userId === currentUser.toString()) {
      return res.status(400).json({ message: "Cannot create DM with yourself" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔍 Check if DM already exists
    let existingDM = await Channel.findOne({
      type: "dm",
      members: { $all: [currentUser, userId] },
    }).populate("members", "fullName email profilePic");

    if (existingDM) {
      return res.status(200).json(existingDM);
    }

    // 🔥 Create new DM channel
    const dm = await Channel.create({
      name: "direct-message",
      type: "dm",
      workspace: null,
      members: [currentUser, userId],
      createdBy: currentUser,
    });

    const populatedDM = await dm.populate(
      "members",
      "fullName email profilePic"
    );

    res.status(201).json(populatedDM);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET ALL USER DMs
===================================== */
export const getUserDMs = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const dms = await Channel.find({
      type: "dm",
      members: userId,
      isDeleted: false,
    })
      .populate("members", "fullName email profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(dms);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET SINGLE DM
===================================== */
export const getDMById = async (req, res, next) => {
  try {
    const { dmId } = req.params;

    const dm = await Channel.findOne({
      _id: dmId,
      type: "dm",
      members: req.user._id,
    }).populate("members", "fullName email profilePic");

    if (!dm) {
      return res.status(404).json({ message: "DM not found" });
    }

    res.status(200).json(dm);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   DELETE / LEAVE DM (Soft)
===================================== */
export const deleteDM = async (req, res, next) => {
  try {
    const { dmId } = req.params;

    const dm = await Channel.findOne({
      _id: dmId,
      type: "dm",
      members: req.user._id,
    });

    if (!dm) {
      return res.status(404).json({ message: "DM not found" });
    }

    dm.isDeleted = true;
    await dm.save();

    res.status(200).json({ message: "DM deleted successfully" });
  } catch (error) {
    next(error);
  }
};
