import Admins from "../models/Admins.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

// Create a new admin
const createAdmin = async (req, res) => {
  const { username, password, email_address, full_name, role } = req.body;

  // Input validation
  if (!username || !password || !email_address || !full_name) {
    return res
      .status(400)
      .json({ createAdminMessage: "All fields are required" });
  }

  if (!validator.isEmail(email_address)) {
    return res
      .status(400)
      .json({ createAdminMessage: "Invalid email address" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const admin = await Admins.create({
      username,
      password_hash: hashedPassword, // Store the hashed password
      email_address,
      full_name,
      role,
    });
    res
      .status(201)
      .json({ createAdminMessage: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ createAdminMessage: "Internal Server Error" });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.findAll();
    res
      .status(200)
      .json({ getAdminsMessage: "Admins retrieved successfully", admins });
  } catch (error) {
    res.status(500).json({ getAdminsMessage: "Internal Server Error" });
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  const { adminId } = req.params;

  if (!validator.isUUID(adminId)) {
    return res.status(400).json({ getAdminByIdMessage: "Invalid admin ID" });
  }

  try {
    const admin = await Admins.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ getAdminByIdMessage: "Admin not found" });
    }
    res
      .status(200)
      .json({ getAdminByIdMessage: "Admin retrieved successfully", admin });
  } catch (error) {
    res.status(500).json({ getAdminByIdMessage: "Internal Server Error" });
  }
};

// Update admin by ID (with token verification)
const updateAdmin = async (req, res) => {
  const { username, password, email, first_name, last_name, role } = req.body;

  // Validate input
  if (!username || !password || !email || !first_name || last_name) {
    return res
      .status(400)
      .json({ signupUserMessage: "All fields marked are required." });
  }

  // Extract token from headers
  const token = req.headers.authorization?.split(" ")[1];

  let decoded;
  try {
    // Decode token to extract user information
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ updateAdminMessage: "Token is expired!" });
    }
    return res.status(401).json({ updateAdminMessage: "Invalid token!" });
  }

  const adminId = decoded.user_id_pk; // Extract user ID from token payload
  const userType = decoded.user_type; // Extract user type (admin/user) from token payload

  // Optionally, you can check if the user is authorized to perform this action
  if (userType !== "admin") {
    return res.status(403).json({
      updateAdminMessage: "You are not authorized to update admin details.",
    });
  }

  // If password is provided, hash it
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

  const existingUser = await Users.findOne({ where: { username } });
  if (existingUser) {
    return res
      .status(400)
      .json({ signupUserMessage: "Username is already taken." });
  }

  existingUser = await Users.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(400)
      .json({ signupUserMessage: "Email is already taken." });
  }

  let updatedPassword = user.password_hash; // Keep existing password
  if (password) {
    updatedPassword = await bcrypt.hash(password, 10); // Hash new password
  }

  try {
    // Update user fields in the Users model
    await user.update({
      username: username || user.username,
      email: email || user.email,
      password_hash: updatedPassword, // Update password if provided
    });

    return res.status(200).json({
      updateAdminMessage: "Admin updated successfully",
    });
  } catch (error) {
    res.status(500).json({ updateAdminMessage: "Internal Server Error" });
  }
};

// Delete admin by ID (soft delete)
const deleteAdmin = async (req, res) => {
  // Extract token from headers
  const token = req.headers.authorization?.split(" ")[1];

  let decoded;
  try {
    // Decode token to extract user information
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ updateAdminMessage: "Token is expired!" });
    }
    return res.status(401).json({ updateAdminMessage: "Invalid token!" });
  }

  const adminId = decoded.user_id_pk; // Extract user ID from token payload

  if (!validator.isUUID(adminId)) {
    return res.status(400).json({ deleteAdminMessage: "Invalid admin ID" });
  }

  try {
    const [updated] = await Admins.update(
      { is_deleted: true }, // Mark as deleted
      {
        where: { admin_id_pk: adminId },
      }
    );
    if (updated) {
      return res
        .status(200)
        .json({ deleteAdminMessage: "Admin deleted successfully" });
    }
    return res.status(404).json({ deleteAdminMessage: "Admin not found" });
  } catch (error) {
    res.status(500).json({ deleteAdminMessage: "Internal Server Error" });
  }
};

export { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin };
