import User from "../models/User.js";
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

export { googleAuth };
