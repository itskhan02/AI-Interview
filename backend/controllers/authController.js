import User from "../models/User.js";
import sendOTP from "../utils/sendOTP.js";
import generateToken from "../utils/generateToken.js";

//google auth
const googleAuth = async (req, res) => {
  try {

    const { name, email } = req.body;

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        isVerified: true,
      });

    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Google auth failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

// send OTP
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    await User.findOneAndUpdate(
      { phone },

      {
        phone,
        otpCode: otp,
        otpExpire,
      },

      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    await sendOTP(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP Sent",
    });
  } catch (error) {
    console.error("Failed to send OTP:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpire || user.otpExpire.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.otpCode = "";

    user.otpExpire = null;

    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("OTP verification failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};


export const logout = async (req, res) => {
  try{
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
    
  } catch(error){
    return res.status(500).json({
      success: false,
      message: "Logout Failed",
    });
  }
}

export { sendOtp, verifyOtp, googleAuth };
