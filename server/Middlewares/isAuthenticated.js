import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        msg: "User not Authenticated",
        success: false,
      });
    }

    const isVerify = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isVerify) {
      return res.status(401).json({
        msg: "Token Invalid",
        success: false,
      });
    }
    req.id = isVerify.userId;
    next();
  } catch (error) {
    console.log("error isAuthenticated", error);
  }
};
