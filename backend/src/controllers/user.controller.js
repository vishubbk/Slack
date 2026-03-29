import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SendEmail } from "../../config/email.verification.js";
import User from "../models/user-model.js";
import Otp from "../models/otp-model.js";

/* ===============================
   GENERATE JWT TOKEN
================================ */
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ===============================
   REGISTER USER
================================ */
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, contact } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      contact,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   LOGIN USER
================================ */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email & password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   LOGOUT USER
================================ */
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   SEND OTP
================================ */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Delete old OTPs for this email
    await Otp.deleteMany({ email });

    // Save OTP in temporary collection
    const expiry = Date.now() + 5 * 60 * 1000;

    await Otp.create({
      email,
      otp,
      expiresAt: expiry,
    });

    // Send Email
    await SendEmail(email, "Your OTP Code", otp);

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("❌ OTP ERROR:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/* ===============================
   VERIFY OTP
================================ */
export const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({
        status: "error",
        message: "OTP expired",
      });
    }

    // Delete OTP after verification
    await Otp.deleteMany({ email });

    // Check or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        isVerified: true,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // 🔥 ✅ SET COOKIE HERE
    res.cookie("token", token, {
      httpOnly: true,              // 🔒 secure (no JS access)
      secure: false,               // ⚠️ localhost (true in production)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      data: {
        user, // ✅ token remove kar sakta hai (optional)
      },
    });

  } catch (error) {
    console.error("❌ VERIFY ERROR:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};


/* ===============================
   GET LOGGED-IN USER PROFILE
================================ */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   UPDATE PROFILE
================================ */
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, theme, profilePic } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.theme = theme || user.theme;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   CHANGE PASSWORD
================================ */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   GET USER BY ID
================================ */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   SEARCH USERS
================================ */
export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query)
      return res.status(400).json({ message: "Search query is required" });

    const users = await User.find({
      fullName: { $regex: query, $options: "i" },
      _id: { $ne: req.user._id },
    }).select("fullName email profilePic");

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};


/* ===============================
   ThemeChange USERS
================================ */
export const themeChange = async(req,res,next)=> {
  try {
    const user =req.user._id;
    const {mode, theme}= req.body;
    console.log("THEME CHANGE REQUEST:", { user, mode, theme });


    const updatedUser = await User.findByIdAndUpdate(user,{appearance:{theme, mode}},{new:true})
    if(!updatedUser) return res.status(404).json({message:"User not found"});

    res.status(200).json({
      status:"success",
      message:"Theme updated successfully",

    })


  } catch (error) {
    console.error("❌ THEME CHANGE ERROR:", error.message);

  }

}
