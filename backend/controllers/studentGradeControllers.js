import StudentGrades from "../models/StudentGrades.js";
import Students from "../models/Students.js"; // Adjust the path as necessary

// Create a new student grade record
const createStudentGrade = async (req, res) => {
  const {
    student_id_fk,
    grade,
    academic_year,
    semester,
    start_date,
    end_date,
  } = req.body;

  if (
    !student_id_fk ||
    !grade ||
    !academic_year ||
    !semester ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({
      createGradeMessage: "All fields are required.",
    });
  }

  // Check if student exists
  const student = await Students.findOne({
    where: { student_id_pk: student_id_fk, is_deleted: false },
  });

  if (!student) {
    return res.status(404).json({
      createGradeMessage: "Student not found.",
    });
  }

  try {
    const newStudentGrade = await StudentGrades.create({
      student_id_fk,
      grade,
      academic_year,
      semester,
      start_date,
      end_date,
    });

    return res.status(201).json({
      createGradeMessage: "Student grade record created successfully!",
      newStudentGrade,
    });
  } catch (error) {
    console.error("Error creating student grade:", error);
    return res.status(500).json({
      createGradeMessage: "Server error. Please try again later.",
      createGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all student grades
const getAllStudentGrades = async (req, res) => {
  try {
    const studentGrades = await StudentGrades.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Students,
          as: "student",
        },
      ],
    });

    return res.status(200).json({
      getAllGradesMessage: "Student grades retrieved successfully!",
      studentGrades,
    });
  } catch (error) {
    console.error("Error retrieving student grades:", error);
    return res.status(500).json({
      getAllGradesMessage: "Server error. Please try again later.",
      getAllGradesCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single student grade by ID
const getStudentGradeById = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const studentGrade = await StudentGrades.findOne({
      where: { student_grades_id_pk: gradeId, is_deleted: false },
      include: [
        {
          model: Students,
          as: "student",
        },
      ],
    });

    if (!studentGrade) {
      return res.status(404).json({
        getGradeMessage: "Student grade not found or deleted.",
      });
    }

    return res.status(200).json({
      getGradeMessage: "Student grade retrieved successfully!",
      studentGrade,
    });
  } catch (error) {
    console.error("Error retrieving student grade:", error);
    return res.status(500).json({
      getGradeMessage: "Server error. Please try again later.",
      getGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a student grade
const updateStudentGrade = async (req, res) => {
  const { gradeId } = req.params;
  const { grade, academic_year, semester, start_date, end_date } = req.body;

  try {
    const studentGrade = await StudentGrades.findOne({
      where: { student_grades_id_pk: gradeId, is_deleted: false },
    });

    if (!studentGrade) {
      return res.status(404).json({
        updateGradeMessage: "Student grade not found or deleted.",
      });
    }

    // Update fields
    if (grade) studentGrade.grade = grade;
    if (academic_year) studentGrade.academic_year = academic_year;
    if (semester) studentGrade.semester = semester;
    if (start_date) studentGrade.start_date = start_date;
    if (end_date) studentGrade.end_date = end_date;

    await studentGrade.save();

    return res.status(200).json({
      updateGradeMessage: "Student grade updated successfully!",
      studentGrade,
    });
  } catch (error) {
    console.error("Error updating student grade:", error);
    return res.status(500).json({
      updateGradeMessage: "Server error. Please try again later.",
      updateGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a student grade (soft delete)
const deleteStudentGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const studentGrade = await StudentGrades.findOne({
      where: { student_grades_id_pk: gradeId, is_deleted: false },
    });

    if (!studentGrade) {
      return res.status(404).json({
        deleteGradeMessage: "Student grade not found or already deleted.",
      });
    }

    // Soft delete the student grade
    studentGrade.is_deleted = true;
    await studentGrade.save();

    return res.status(200).json({
      deleteGradeMessage: "Student grade deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting student grade:", error);
    return res.status(500).json({
      deleteGradeMessage: "Server error. Please try again later.",
      deleteGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted student grade
const recoverStudentGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const studentGrade = await StudentGrades.findOne({
      where: { student_grades_id_pk: gradeId, is_deleted: true },
    });

    if (!studentGrade) {
      return res.status(404).json({
        recoverGradeMessage: "Student grade not found or not deleted.",
      });
    }

    // Restore the student grade
    studentGrade.is_deleted = false;
    await studentGrade.save();

    return res.status(200).json({
      recoverGradeMessage: "Student grade recovered successfully!",
      studentGrade,
    });
  } catch (error) {
    console.error("Error recovering student grade:", error);
    return res.status(500).json({
      recoverGradeMessage: "Server error. Please try again later.",
      recoverGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createStudentGrade,
  getAllStudentGrades,
  getStudentGradeById,
  updateStudentGrade,
  deleteStudentGrade,
  recoverStudentGrade,
};
