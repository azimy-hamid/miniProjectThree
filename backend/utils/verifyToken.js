// controllers/authController.js

import jwt from "jsonwebtoken";
import Users from "../models/Users.js"; // Path to your User model
import User_Role_Assignment from "../models/UserRoleAssignment.js"; // Path to your UserRoleAssignment model
import User_Roles from "../models/UserRoles.js"; // Path to your UserRoles model

export const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Fetch the user based on the user_id_pk from the decoded token
    const user = await Users.findByPk(decoded.user_id_pk);

    if (!user || user.is_deleted) {
      // Check if user exists and is not deleted
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Get the role from the request body
    const { role: roleFromBody } = req.body; // Get the role from req.body
    if (!roleFromBody) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required." });
    }

    // Check if the user has a role assignment
    const roleAssignment = await Users.findOne({
      where: { user_id_fk: user.user_id_pk },
      include: [{ model: User_Roles, required: true }], // Include the UserRoles model
    });

    if (!roleAssignment || roleAssignment.is_deleted) {
      return res
        .status(403)
        .json({ success: false, message: "Role assignment not found." });
    }

    // Access the role
    const userRole = roleAssignment.User_Role;

    // Compare the role from the request body with the user's role
    if (userRole.role_name !== roleFromBody) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions." });
    }

    // Successfully verified token and permissions
    return res.status(200).json({ success: true, role: userRole.role_name });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
