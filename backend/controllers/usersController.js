import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

import Users from "../models/Users.js";
import User_Roles from "../models/UserRoles.js";
import User_Role_Assignment from "../models/UserRoleAssignment.js";

const generateToken = (userId) => {
  return jwt.sign({ user_id_pk: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
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

    // Create new user
    const newUser = await Users.create({
      username,
      password_hash: hashedPassword,
      user_id_fk,
      user_type,
      email,
    });

    const role = await User_Roles.findOne({
      where: { role_name: user_type.toLowerCase() },
    });
    if (!role || role.is_deleted) {
      return res.status(400).json({
        signupUserMessage: "User role not found or is deleted.",
      });
    }

    try {
      // Assign the role to the user
      await User_Role_Assignment.create({
        user_id_fk: newUser.user_id_pk,
        role_id_fk: role.role_id_pk,
      });
    } catch (error) {
      console.log(error);
    }

    // Generate JWT token
    const token = generateToken(newUser.user_id_pk);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ signupUserMessage: "Server error. Please try again later." });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ loginUserMessage: "Username and password are required." });
  }

  try {
    // Find user by username
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

    // Generate JWT token with user_id_pk in the payload
    const token = generateToken(user.user_id_pk);

    // Respond with the token and user ID
    return res.status(200).json({ token });
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
      // Decode token to extract the user ID
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ updateUserMessage: "Token is expired!" });
      }
      return res.status(401).json({ updateUserMessage: "Invalid token!" });
    }

    const userId = decoded.user_id_pk; // Extract user ID from token payload

    const { username, email, password } = req.body;

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

    // Find the user by ID
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ updateUserMessage: "User not found!" });
    }

    // Check if the user is marked as deleted (is_deleted)
    if (user.is_deleted) {
      return res.status(400).json({
        updateUserMessage: "User deleted! Recover your account first!",
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

export { signup, login, updateUser, deleteUser, recoverUser };
