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
    const user = await Users.findOne({
      where: { user_id_pk: decoded.user_id_pk }, // Use user_id_pk from decoded token
      include: [
        {
          model: User_Roles,
          as: "roles", // Use the alias specified in your association
          through: { model: User_Role_Assignment, as: "User_Role_Assignment" }, // Include through model if necessary
          required: false, // Optional join
        },
      ],
    });

    if (!user || user.is_deleted) {
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

    // Check if the user has any roles assigned
    const userRoles = user.roles; // Access the associated roles using the correct alias

    // If no roles are found
    if (!userRoles || userRoles.length === 0) {
      return res
        .status(403)
        .json({ success: false, message: "No role assignments found." });
    }

    // Check if the user has the requested role
    const hasRole = userRoles.some(
      (userRole) => userRole.role_name === roleFromBody
    );

    if (!hasRole) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions." });
    }

    // Successfully verified token and permissions
    return res
      .status(200)
      .json({ success: true, roles: userRoles.map((role) => role.role_name) });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
