import Teachers from "../models/Teachers.js";
import validator from "validator";

// Create Teacher Controller
const createTeacher = async (req, res) => {
  const {
    teacher_first_name,
    teacher_last_name,
    gender,
    dob,
    email,
    phone,
    join_date,
    working_days,
  } = req.body;

  // Validate input
  if (
    !teacher_first_name ||
    !teacher_last_name ||
    !gender ||
    !dob ||
    !email ||
    !working_days
  ) {
    return res
      .status(400)
      .json({ createTeacherMessage: "All required fields must be provided." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ createTeacherMessage: "Enter a valid email address." });
  }

  try {
    // Check if a teacher with the same email already exists
    const existingTeacher = await Teachers.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(400).json({
        createTeacherMessage: "Teacher with this email already exists.",
      });
    }

    // Create a new teacher
    const newTeacher = await Teachers.create({
      teacher_first_name,
      teacher_last_name,
      gender,
      dob,
      email,
      phone: phone || null, // Optional field
      join_date: join_date || null, // Optional field
      working_days,
    });

    return res.status(201).json({
      createTeacherMessage: "Teacher created successfully!",
      newTeacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return res.status(500).json({
      createTeacherMessage: "Server error. Please try again later.",
      createTeacherCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get all Teachers Controller
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teachers.findAll({ where: { is_deleted: false } });
    return res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return res.status(500).json({
      getTeachersMessage: "Server error. Please try again later.",
      getAllTeacherCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get Single Teacher by ID Controller
const getTeacherById = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teachers.findOne({
      where: { teacher_id_pk: teacherId, is_deleted: false },
    });

    if (!teacher) {
      return res.status(404).json({ getTeacherMessage: "Teacher not found!" });
    }

    return res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return res.status(500).json({
      getTeacherMessage: "Server error. Please try again later.",
      getAllTeacherCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update Teacher Controller
const updateTeacher = async (req, res) => {
  const { teacherId } = req.params;
  const {
    teacher_first_name,
    teacher_last_name,
    gender,
    dob,
    email,
    phone,
    join_date,
    working_days,
  } = req.body;

  try {
    // Find the teacher by ID
    const teacher = await Teachers.findOne({
      where: { teacher_id_pk: teacherId, is_deleted: false },
    });

    if (!teacher) {
      return res.status(404).json({
        updateTeacherMessage: "Teacher not found or might be deleted!",
      });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ updateTeacherMessage: "Enter a valid email address!" });
    }

    // Update teacher details
    await teacher.update({
      teacher_first_name: teacher_first_name || teacher.teacher_first_name,
      teacher_last_name: teacher_last_name || teacher.teacher_last_name,
      gender: gender || teacher.gender,
      dob: dob || teacher.dob,
      email: email || teacher.email,
      phone: phone || teacher.phone,
      join_date: join_date || teacher.join_date,
      working_days: working_days || teacher.working_days,
    });

    return res
      .status(200)
      .json({ updateTeacherMessage: "Teacher details updated successfully!" });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return res.status(500).json({
      updateTeacherMessage: "Server error. Please try again later.",
      updateTeacherCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Delete Teacher Controller (Soft Delete)
const deleteTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find the teacher by ID
    const teacher = await Teachers.findOne({
      where: { teacher_id_pk: teacherId, is_deleted: false },
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ deleteTeacherMessage: "Teacher not found!" });
    }

    // Mark teacher as deleted
    await teacher.update({ is_deleted: true });

    return res
      .status(200)
      .json({ deleteTeacherMessage: "Teacher deleted successfully." });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return res.status(500).json({
      deleteTeacherMessage: "Server error. Please try again later.",
      deleteTeacherCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover Deleted Teacher (Soft Delete Recovery)
const recoverTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find the deleted teacher by ID
    const teacher = await Teachers.findOne({
      where: { teacher_id_pk: teacherId, is_deleted: true },
    });

    if (!teacher) {
      return res.status(404).json({
        recoverTeacherMessage: "Teacher not found or is not deleted!",
      });
    }

    // Mark teacher as active
    await teacher.update({ is_deleted: false });

    return res
      .status(200)
      .json({ recoverTeacherMessage: "Teacher recovered successfully!" });
  } catch (error) {
    console.error("Error recovering teacher:", error);
    return res.status(500).json({
      recoverTeacherMessage: "Server error. Please try again later.",
      recoverTeacherCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  recoverTeacher,
};
