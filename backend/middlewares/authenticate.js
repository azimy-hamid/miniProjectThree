import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User_Role_Assignment from "../models/UserRoleAssignment.js";
import User_Roles from "../models/UserRoles.js";
dotenv.config();

const authenticate = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      // Check for token in Authorization header
      const token = req.headers.authorization?.split(" ")[1];
      console.error("Extracted Token:", token);

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

      const userId = decoded.user_id_pk; // Assuming user_id_pk is part of the JWT payload

      // Fetch the role_id_fk for the user from UserRoleAssignment
      const userInAssignment = await User_Role_Assignment.findOne({
        where: { user_id_fk: userId },
      });

      if (!userInAssignment) {
        return res.status(403).json({ error: "User does not have a role." });
      }

      // Fetch the role name from UserRole using the role_id_fk
      const role = await User_Roles.findOne({
        where: { role_id_pk: userInAssignment.role_id_fk },
      });

      if (!role) {
        return res.status(403).json({ error: "Role not found." });
      }

      // Check if the user's role matches any of the required roles
      if (!requiredRoles.includes(role.role_name)) {
        return res
          .status(403)
          .json({ error: "Access denied. Insufficient permissions." });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Authentication error:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong with authentication." });
    }
  };
};

export default authenticate;
