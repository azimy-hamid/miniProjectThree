import Semesters from "../models/Semesters.js";

// Create a new semester
const createSemester = async (req, res) => {
  const { semester_number, year } = req.body;

  // Validate required fields
  if (!semester_number || !year) {
    return res.status(400).json({
      createSemesterMessage: "Semester number and year are required.",
    });
  }

  try {
    const newSemester = await Semesters.create({
      semester_number,
      year,
    });

    return res.status(201).json({
      createSemesterMessage: "Semester created successfully!",
      newSemester,
    });
  } catch (error) {
    console.error("Error creating semester:", error);
    return res.status(500).json({
      createSemesterMessage: "Server error. Please try again later.",
      createSemesterCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all semesters
const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semesters.findAll({
      where: { is_deleted: false },
    });

    return res.status(200).json({
      getAllSemestersMessage: "Semesters retrieved successfully!",
      semesters,
    });
  } catch (error) {
    console.error("Error retrieving semesters:", error);
    return res.status(500).json({
      getAllSemestersMessage: "Server error. Please try again later.",
      getAllSemestersCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single semester by ID
const getSemesterById = async (req, res) => {
  const { semesterId } = req.params;

  try {
    const semester = await Semesters.findOne({
      where: { semester_id_pk: semesterId, is_deleted: false },
    });

    if (!semester) {
      return res.status(404).json({
        getSemesterMessage: "Semester not found or deleted.",
      });
    }

    return res.status(200).json({
      getSemesterMessage: "Semester retrieved successfully!",
      semester,
    });
  } catch (error) {
    console.error("Error retrieving semester:", error);
    return res.status(500).json({
      getSemesterMessage: "Server error. Please try again later.",
      getSemesterCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a semester
const updateSemester = async (req, res) => {
  const { semesterId } = req.params;
  const { semester_number, year } = req.body;

  try {
    const semester = await Semesters.findOne({
      where: { semester_id_pk: semesterId, is_deleted: false },
    });

    if (!semester) {
      return res.status(404).json({
        updateSemesterMessage: "Semester not found or deleted.",
      });
    }

    // Update fields
    if (semester_number) semester.semester_number = semester_number;
    if (year) semester.year = year;

    await semester.save();

    return res.status(200).json({
      updateSemesterMessage: "Semester updated successfully!",
      semester,
    });
  } catch (error) {
    console.error("Error updating semester:", error);
    return res.status(500).json({
      updateSemesterMessage: "Server error. Please try again later.",
      updateSemesterCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a semester
const deleteSemester = async (req, res) => {
  const { semesterId } = req.params;

  try {
    const semester = await Semesters.findOne({
      where: { semester_id_pk: semesterId, is_deleted: false },
    });

    if (!semester) {
      return res.status(404).json({
        deleteSemesterMessage: "Semester not found or already deleted.",
      });
    }

    // Soft delete the semester record
    semester.is_deleted = true;
    await semester.save();

    return res.status(200).json({
      deleteSemesterMessage: "Semester deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting semester:", error);
    return res.status(500).json({
      deleteSemesterMessage: "Server error. Please try again later.",
      deleteSemesterCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted semester
const recoverSemester = async (req, res) => {
  const { semesterId } = req.params;

  try {
    const semester = await Semesters.findOne({
      where: { semester_id_pk: semesterId, is_deleted: true },
    });

    if (!semester) {
      return res.status(404).json({
        recoverSemesterMessage: "Semester not found or not deleted.",
      });
    }

    // Restore the semester record
    semester.is_deleted = false;
    await semester.save();

    return res.status(200).json({
      recoverSemesterMessage: "Semester recovered successfully!",
      semester,
    });
  } catch (error) {
    console.error("Error recovering semester:", error);
    return res.status(500).json({
      recoverSemesterMessage: "Server error. Please try again later.",
      recoverSemesterCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
  recoverSemester,
};
