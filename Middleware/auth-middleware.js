const jwt = require("jsonwebtoken");
const User = require("../Models/user-model");

const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.header("authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    // Remove "Bearer" prefix and trim whitespace
    const jwttoken = token.replace("Bearer", "").trim();

    // Verify the token
    const isVerified = jwt.verify(jwttoken, process.env.JWT_KEY);

    // Find the user by email in token payload
    const userData = await User.findOne({ email: isVerified.email }).select("-password");
    // console.log("userdata",userData)

    // Check if user exists
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info to request
    req.user = userData;
    req.token = jwttoken;
    req.userID = userData._id;
    req.isAdmin = userData.isAdmin;

    // Pass to next middleware/route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
