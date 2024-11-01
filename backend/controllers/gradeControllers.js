import Grades from "../models/Grades.js";

// Create a new grade record
const createGrade = async (req, res) => {
  const { grade_level } = req.body;

  // Check if grade_level is provided
  if (!grade_level) {
    return res.status(400).json({
      createGradeMessage: "Grade level is required.",
    });
  }

  try {
    // Check if the grade_level already exists
    const existingGrade = await Grades.findOne({ where: { grade_level } });
    if (existingGrade) {
      return res.status(409).json({
        createGradeMessage: "Grade level already exists.",
      });
    }

    // If not, create a new grade record
    const newGrade = await Grades.create({ grade_level });
    return res.status(201).json({
      createGradeMessage: "Grade record created successfully!",
      newGrade,
    });
  } catch (error) {
    console.error("Error creating grade:", error);
    return res.status(500).json({
      createGradeMessage: "Server error. Please try again later.",
      createGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all grades
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grades.findAll({ where: { is_deleted: false } });
    return res.status(200).json({
      getAllGradesMessage: "Grades retrieved successfully!",
      grades,
    });
  } catch (error) {
    console.error("Error retrieving grades:", error);
    return res.status(500).json({
      getAllGradesMessage: "Server error. Please try again later.",
      getAllGradesCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single grade by ID
const getGradeById = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const grade = await Grades.findOne({
      where: { grade_id_pk: gradeId, is_deleted: false },
    });

    if (!grade) {
      return res.status(404).json({
        getGradeMessage: "Grade not found or deleted.",
      });
    }

    return res.status(200).json({
      getGradeMessage: "Grade retrieved successfully!",
      grade,
    });
  } catch (error) {
    console.error("Error retrieving grade:", error);
    return res.status(500).json({
      getGradeMessage: "Server error. Please try again later.",
      getGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a grade
const updateGrade = async (req, res) => {
  const { gradeId } = req.params;
  const { grade_level } = req.body;

  try {
    const grade = await Grades.findOne({
      where: { grade_id_pk: gradeId, is_deleted: false },
    });

    if (!grade) {
      return res.status(404).json({
        updateGradeMessage: "Grade not found or deleted.",
      });
    }

    // Update fields
    if (grade_level) grade.grade_level = grade_level;
    await grade.save();

    return res.status(200).json({
      updateGradeMessage: "Grade updated successfully!",
      grade,
    });
  } catch (error) {
    console.error("Error updating grade:", error);
    return res.status(500).json({
      updateGradeMessage: "Server error. Please try again later.",
      updateGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a grade (soft delete)
const deleteGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const grade = await Grades.findOne({
      where: { grade_id_pk: gradeId, is_deleted: false },
    });

    if (!grade) {
      return res.status(404).json({
        deleteGradeMessage: "Grade not found or already deleted.",
      });
    }

    // Soft delete the grade
    grade.is_deleted = true;
    await grade.save();

    return res.status(200).json({
      deleteGradeMessage: "Grade deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting grade:", error);
    return res.status(500).json({
      deleteGradeMessage: "Server error. Please try again later.",
      deleteGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted grade
const recoverGrade = async (req, res) => {
  const { gradeId } = req.params;

  try {
    const grade = await Grades.findOne({
      where: { grade_id_pk: gradeId, is_deleted: true },
    });

    if (!grade) {
      return res.status(404).json({
        recoverGradeMessage: "Grade not found or not deleted.",
      });
    }

    // Restore the grade
    grade.is_deleted = false;
    await grade.save();

    return res.status(200).json({
      recoverGradeMessage: "Grade recovered successfully!",
      grade,
    });
  } catch (error) {
    console.error("Error recovering grade:", error);
    return res.status(500).json({
      recoverGradeMessage: "Server error. Please try again later.",
      recoverGradeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

const getAllGradeCodes = async (req, res) => {
  try {
    // Fetch all grade records from the Grades table
    const allGrades = await Grades.findAll();

    // Check if there are any grades found
    if (allGrades.length === 0) {
      return res.status(404).json({
        message: "No grade codes found.",
      });
    }

    // Extract only the grade codes from the retrieved records
    const gradeCodes = allGrades.map((grade) => grade.grade_code); // Adjust 'grade_code' to your actual field name

    // Return the array of grade codes
    return res.status(200).json({
      message: "Grade codes retrieved successfully.",
      gradeCodes, // Send only the array of grade codes
    });
  } catch (error) {
    console.error("Error fetching grade codes:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message || "Unknown error",
    });
  }
};

export {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  recoverGrade,
  getAllGradeCodes,
};
