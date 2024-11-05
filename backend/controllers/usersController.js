import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

import Users from "../models/Users.js";
import User_Roles from "../models/UserRoles.js";
import User_Role_Assignment from "../models/UserRoleAssignment.js";

const generateToken = (userId, userType) => {
  return jwt.sign(
    { user_id_pk: userId, user_type: userType },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const signup = async (req, res) => {
  const { email, username, password, user_id_fk, user_type } = req.body;

  // Validate input
  if (!email || !username || !password || !user_id_fk || !user_type) {
    return res
      .status(400)
      .json({ signupUserMessage: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ signupUserMessage: "Enter a valid email, Please." });
  }

  if (!validator.isLength(username, { min: 3 })) {
    return res.status(400).json({
      signupUserMessage: "Username must be at least 3 characters long.",
    });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      signupUserMessage:
        "Password not strong enough! Must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.",
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ signupUserMessage: "Username is already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch the role
    const role = await User_Roles.findOne({
      where: { role_name: user_type.toLowerCase() },
    });
    if (!role || role.is_deleted) {
      return res.status(400).json({
        signupUserMessage: "User role not found or is deleted.",
      });
    }

    // Create new user
    const newUser = await Users.create({
      username,
      password_hash: hashedPassword,
      user_id_fk,
      user_type,
      email,
    });

    // Assign the role to the user
    await User_Role_Assignment.create({
      user_id_fk: newUser.user_id_pk,
      role_id_fk: role.role_id_pk,
    });

    // Generate JWT token
    const token = generateToken(newUser.user_id_pk, newUser.user_type);

    // Respond with the token and role
    return res.status(200).json({ token, role: role.role_name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      signupUserMessage: "Server error. Please try again later.",
      signupUserCatchBlkErr: error,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ loginUserMessage: "Email and password are required." });
  }

  try {
    // Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ loginUserMessage: "Invalid credentials." });
    }

    // Compare hashed password with the one provided by the user
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ loginUserMessage: "Invalid credentials." });
    }

    if (user.is_deleted) {
      return res.status(400).json({
        updateUserMessage: "User deleted! Recover your account first!",
      });
    }

    // Fetch the role assignment for the user
    const userInAssignment = await User_Role_Assignment.findOne({
      where: { user_id_fk: user.user_id_pk },
    });

    if (!userInAssignment) {
      return res.status(403).json({ error: "User does not have a role." });
    }

    // Fetch the role name from User_Roles
    const role = await User_Roles.findOne({
      where: { role_id_pk: userInAssignment.role_id_fk },
    });

    if (!role) {
      return res.status(403).json({ error: "Role not found." });
    }

    // Generate JWT token with user_id_pk and role in the payload
    const token = generateToken(user.user_id_pk, user.user_type);

    // Respond with the token, user ID, user role, and user_id_fk
    return res.status(200).json({
      token,
      role: role.role_name,
      user_id_fk: user.user_id_fk,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ loginUserMessage: "Server error. Please try again later." });
  }
};

// Update User Controller
const updateUser = async (req, res) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(" ")[1];

    let decoded;
    try {
      // Decode token to extract user information
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ updateUserMessage: "Token is expired!" });
      }
      return res.status(401).json({ updateUserMessage: "Invalid token!" });
    }

    const userId = decoded.user_id_pk; // Extract user ID from token payload
    const userType = decoded.user_type; // Extract user type (admin/user) from token payload
    const { username, email, password, targetUserId } = req.body;

    // Check if the user is an admin
    let targetId;
    if (userType === "admin" && targetUserId) {
      // Admin can specify a different user to update
      targetId = targetUserId;
    } else {
      // Non-admins (or if no targetUserId provided) can only update their own details
      targetId = userId;
    }

    // Find the target user by ID
    const user = await Users.findByPk(targetId);

    if (!user) {
      return res.status(404).json({ updateUserMessage: "User not found!" });
    }

    // Admin cannot update deleted users (is_deleted check)
    if (user.is_deleted) {
      return res.status(400).json({
        updateUserMessage: "User is deleted! Recover their account first!",
      });
    }

    // Check if at least one field is being updated
    if (!username && !email && !password) {
      return res
        .status(400)
        .json({ updateUserMessage: "At least one field must be updated!" });
    }

    // Validate email format if provided
    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ updateUserMessage: "Enter a valid email address!" });
    }

    // Validate password strength if provided
    if (password && !validator.isStrongPassword(password)) {
      return res.status(400).json({
        updateUserMessage:
          "Password not strong enough! Must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.",
      });
    }

    // Hash password if it's provided for update
    let updatedPassword = user.password_hash; // Keep existing password
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10); // Hash new password
    }

    // Update user fields in the Users model
    await user.update({
      username: username || user.username,
      email: email || user.email,
      password_hash: updatedPassword, // Update password if provided
    });

    return res
      .status(200)
      .json({ updateUserMessage: "User details updated successfully!" });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({
      updateUserMessage: "An error occurred while updating user details.",
      catchBlockErr: error,
    });
  }
};

// Delete User Controller
const deleteUser = async (req, res) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the form "Bearer <token>"

    // Decode the token to extract the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user_id_pk; // Extract the user_id_pk from the token payload

    // Find the user by ID
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ deleteUserMessage: "User not found." });
    }

    // Mark user as deleted instead of hard delete
    user.is_deleted = true; // Assuming you have an is_deleted column
    await user.save();

    // Mark all role assignments as deleted
    await User_Role_Assignment.update(
      { is_deleted: true }, // Assuming you have an is_deleted column in User_Role_Assignment
      { where: { user_id_fk: userId } }
    );

    return res
      .status(200)
      .json({ deleteUserMessage: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ deleteUserMessage: "Server error. Please try again later." });
  }
};

// Account Recovery Controller
const recoverUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({
        recoverAccountMessage: "Email, username, and password are required.",
      });
    }

    // Compare hashed password with the one provided by the user
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ loginUserMessage: "Invalid credentials." });
    }

    // Find the user by email and username
    const user = await Users.findOne({
      where: { email, username },
    });

    if (!user) {
      return res.status(404).json({ recoverAccountMessage: "User not found!" });
    }

    // Check if the user is marked as deleted
    if (!user.is_deleted) {
      return res.status(400).json({
        recoverAccountMessage: "User account is not deleted!",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Recover the account by updating is_deleted and password_hash
    await user.update({
      is_deleted: false, // Mark the account as active
      password_hash: hashedPassword, // Update password
    });

    return res
      .status(200)
      .json({ recoverAccountMessage: "Account recovered successfully!" });
  } catch (error) {
    console.error("Error recovering account:", error);
    return res.status(500).json({
      recoverAccountMessage: "An error occurred while recovering the account.",
      catchBlockErr: error,
    });
  }
};

const getAllUserRoleAssignment = async (req, res) => {
  try {
    const userRoleAssignment = await User_Role_Assignment.findAll({
      where: { is_deleted: false },
      include: [
        { model: Users, where: { is_deleted: false } },
        { model: User_Roles, where: { is_deleted: false } },
      ],
    });

    return res.status(200).json({
      getAllStudentSubjectsMessage:
        "userRoleAssignment associations retrieved successfully!",
      userRoleAssignment,
    });
  } catch (error) {
    console.error("Error retrieving userRoleAssignment associations:", error);
    return res.status(500).json({
      getAllUserRoleAssignmentsMessage: "Server error. Please try again later.",
      getAllUserRoleAssignmentsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Check User Existence Controller
const checkUserExists = async (req, res) => {
  const { email, username } = req.params;

  // Validate input
  if (!email && !username) {
    return res.status(400).json({
      userExists: false,
      message: "At least one of email or username is required.",
    });
  }

  try {
    // Initialize flags for existence
    let emailExists = false;
    let usernameExists = false;

    // Check for email existence
    if (email) {
      const emailCheck = await Users.findOne({
        where: {
          email,
          is_deleted: false, // Ensure we are checking only active users
        },
      });
      if (emailCheck) {
        emailExists = true;
      }
    }

    // Check for username existence
    if (username) {
      const usernameCheck = await Users.findOne({
        where: {
          username,
          is_deleted: false, // Ensure we are checking only active users
        },
      });
      if (usernameCheck) {
        usernameExists = true;
      }
    }

    // Construct response based on the existence of email and username
    if (emailExists && usernameExists) {
      return res.status(200).json({
        userExists: true,
        checkUserExistsMessage: "Both email and username exist.",
      });
    } else if (emailExists || usernameExists) {
      return res.status(200).json({
        userExists: true,
        checkUserExistsMessage: "Either email or username exists.",
      });
    } else {
      return res.status(200).json({
        userExists: false,
        checkUserExistsMessage: "User does not exist.",
      });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({
      userExists: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export {
  signup,
  login,
  updateUser,
  deleteUser,
  recoverUser,
  getAllUserRoleAssignment,
  checkUserExists,
};
