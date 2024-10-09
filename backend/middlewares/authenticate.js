import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticate = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    let decoded;
    try {
      // Verify the token using the secret key
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token is expired!" });
      }
      return res.status(401).json({ error: "Invalid token!" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong with authentication." });
  }
};

export default authenticate;
