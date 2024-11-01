import Students from "../models/Students.js";
import validator from "validator";
import Semesters from "../models/Semesters.js";
import Grades from "../models/Grades.js";

// Create Student Controller
const createStudent = async (req, res) => {
  const {
    student_first_name,
    student_last_name,
    gender,
    dob,
    email,
    phone,
    join_date,
    semester_number, // Semester number from frontend
    grade_code, // Grade code from frontend
  } = req.body;

  // Validate input
  if (!student_first_name || !student_last_name || !gender || !dob || !email) {
    return res
      .status(400)
      .json({ createStudentMessage: "All required fields must be provided." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ createStudentMessage: "Enter a valid email address." });
  }

  try {
    // Check if a student with the same email already exists
    const existingStudent = await Students.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({
        createStudentMessage: "Student with this email already exists.",
      });
    }

    // Find the semester primary key using semester_number
    const semester = await Semesters.findOne({
      where: { semester_number },
    });
    const semester_id_fk = semester ? semester.semester_id_pk : null;

    // Find the grade primary key using grade_code
    const grade = await Grades.findOne({
      where: { grade_code },
    });
    const grade_id_fk = grade ? grade.grade_id_pk : null;

    // Create a new student
    const newStudent = await Students.create({
      student_first_name,
      student_last_name,
      gender,
      dob,
      email,
      phone: phone || null, // Optional field
      join_date: join_date || null, // Optional field
      semester_id_fk,
      grade_id_fk,
    });

    return res.status(201).json({
      createStudentMessage: "Student created successfully!",
      newStudent,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({
      createStudentMessage: "Server error. Please try again later.",
      createStudentCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get all Students Controller
const getAllStudents = async (req, res) => {
  try {
    const students = await Students.findAll({ where: { is_deleted: false } });
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      getStudentsMessage: "Server error. Please try again later.",
      getAllStudentCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get Single Student by ID Controller
const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Students.findOne({
      where: { student_id_pk: studentId, is_deleted: false },
    });

    if (!student) {
      return res.status(404).json({ getStudentMessage: "Student not found!" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return res.status(500).json({
      getStudentMessage: "Server error. Please try again later.",
      getAllStudentCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update Student Controller
const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const {
    student_first_name,
    student_last_name,
    gender,
    dob,
    email,
    phone,
    section,
    join_date,
    semester_number, // Semester number from frontend
    grade_code, // Grade code from frontend
  } = req.body;

  if (
    !student_first_name &&
    !student_last_name &&
    !gender &&
    !dob &&
    !email &&
    !phone &&
    !section &&
    !join_date &&
    !semester_number &&
    !grade_code
  ) {
    return res.status(400).json({
      updateStudentMessage: "No fields to update.",
    });
  }

  try {
    // Find the student by ID
    const student = await Students.findOne({
      where: { student_id_pk: studentId, is_deleted: false },
    });

    if (!student) {
      return res
        .status(404)
        .json({ updateStudentMessage: "Student not found!" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ updateStudentMessage: "Enter a valid email address!" });
    }

    // Find the semester primary key using semester_number
    const semester = semester_number
      ? await Semesters.findOne({ where: { semester_number } })
      : null;
    const semester_id_fk = semester
      ? semester.semester_id_pk
      : student.semester_id_fk;

    // Find the grade primary key using grade_code
    const grade = grade_code
      ? await Grades.findOne({ where: { grade_code } })
      : null;
    const grade_id_fk = grade ? grade.grade_id_pk : student.grade_id_fk;

    // Update student details
    await student.update({
      student_first_name: student_first_name || student.student_first_name,
      student_last_name: student_last_name || student.student_last_name,
      gender: gender || student.gender,
      dob: dob || student.dob,
      email: email || student.email,
      phone: phone || student.phone,
      section: section || student.section,
      join_date: join_date || student.join_date,
      semester_id_fk,
      grade_id_fk,
    });

    return res
      .status(200)
      .json({ updateStudentMessage: "Student details updated successfully!" });
  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({
      updateStudentMessage: "Server error. Please try again later.",
      updateStudentCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Delete Student Controller (Soft Delete)
const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Find the student by ID
    const student = await Students.findOne({
      where: { student_id_pk: studentId, is_deleted: false },
    });

    if (!student) {
      return res
        .status(404)
        .json({ deleteStudentMessage: "Student not found!" });
    }

    // Mark student as deleted
    await student.update({ is_deleted: true });

    return res
      .status(200)
      .json({ deleteStudentMessage: "Student deleted successfully." });
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).json({
      deleteStudentMessage: "Server error. Please try again later.",
      deleteStudentCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover Deleted Student (Soft Delete Recovery)
const recoverStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Find the deleted student by ID
    const student = await Students.findOne({
      where: { student_id_pk: studentId, is_deleted: true },
    });

    if (!student) {
      return res.status(404).json({
        recoverStudentMessage: "Student not found or is not deleted!",
      });
    }

    // Mark student as active
    await student.update({ is_deleted: false });

    return res
      .status(200)
      .json({ recoverStudentMessage: "Student recovered successfully!" });
  } catch (error) {
    console.error("Error recovering student:", error);
    return res.status(500).json({
      recoverStudentMessage: "Server error. Please try again later.",
      recoverStudentCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  recoverStudent,
};
