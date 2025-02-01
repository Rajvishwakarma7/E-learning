import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { Error } from "mongoose";
import { deleteCloudinaryMedia, uploadMedia } from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exist " });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashPassword,
    });
    return res
      .status(200)
      .json({ success: true, msg: "User Created Successfully" });
  } catch (error) {
    console.log("register----->>", error);
    return res.status(501).json({ success: false, msg: "failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ msg: "Password not match" });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log("login----->>", error);
    return res.status(501).json({ success: false, msg: "failed to login" });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById({ _id: userId }).select("-password");
    if (!user) {
      return res.status(401).json({
        msg: "Profle not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("error getUserProfile", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Load User profile",
    });
  }
};

export const updateUserprofile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.id;

    const user = await User.findById({ _id: req.id });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.photoUrl && req.file) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deleteCloudinaryMedia(publicId);
    }

    let updatedData = {};
    if (req.file) {
      const cloudResponse = await uploadMedia(req.file.path);
      updatedData.photoUrl = cloudResponse.secure_url;
    }
    if (name) {
      updatedData.name = name;
    }
    const UpdateUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      UpdateUser,
      success: true,
      message: "User Update Successfully",
    });
  } catch (error) {
    console.log("error getUserProfile", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Load updateUserprofile",
    });
  }
};
