import { loginWithGoogle } from "../services/auth.service.js";

export const googleLogin = async (req, res) => {
  try {
    const data = await loginWithGoogle(req.body);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
