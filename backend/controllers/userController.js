import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-otpCode -otpExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("User lookup failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, bio, targetRole, education, experience, location } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (targetRole !== undefined) user.targetRole = targetRole.trim();
    if (education !== undefined) user.education = education.trim();
    if (experience !== undefined) user.experience = experience.trim();
    if (location !== undefined) user.location = location.trim();

    if (req.file) {
      if (user.profileImagePublicId) {
        await cloudinary.uploader.destroy(user.profileImagePublicId);
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "intelliprep/profile-images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        uploadStream.end(req.file.buffer);
      });

      user.profileImage = result.secure_url;
      user.profileImagePublicId = result.public_id;
    }

    await user.save();

    const updatedUser = await User.findById(req.userId).select(
      "-otpCode -otpExpire",
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    await User.findByIdAndDelete(req.userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};
