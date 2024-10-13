import Marks from "../models/Marks.js";
import Students from "../models/Students.js";
import Subjects from "../models/Subjects.js";

// Create a new mark
const createMark = async (req, res) => {
  const { student_id_fk, subject_id_fk, subject_mark } = req.body;

  // Validate required input
  if (!student_id_fk || !subject_id_fk || subject_mark === undefined) {
    return res.status(400).json({
      createMarkMessage:
        "Student ID, Subject ID, and Subject Mark are required.",
    });
  }

  try {
    // Check if the student exists
    const student = await Students.findOne({
      where: { student_id_pk: student_id_fk },
    });

    if (!student) {
      return res.status(404).json({
        createMarkMessage: "Student not found.",
      });
    }

    // Check if the student is deleted
    if (student.is_deleted) {
      return res.status(404).json({
        createMarkMessage: "Student is deleted.",
      });
    }

    // Check if the subject exists
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subject_id_fk },
    });

    if (!subject) {
      return res.status(404).json({
        createMarkMessage: "Subject not found.",
      });
    }

    if (subject.is_deleted) {
      return res.status(404).json({
        createMarkMessage: "Subject is deleted.",
      });
    }

    // Create a new mark entry
    const newMark = await Marks.create({
      student_id_fk,
      subject_id_fk,
      subject_mark,
    });

    return res.status(201).json({
      createMarkMessage: "Mark created successfully!",
      newMark,
    });
  } catch (error) {
    console.error("Error creating mark:", error);
    return res.status(500).json({
      createMarkMessage: "Server error. Please try again later.",
      createMarkCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get all marks
const getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.findAll({
      where: { is_deleted: false },
      include: [
        { model: Students, as: "student", attributes: ["student_id_pk"] }, // Use the alias for Students
        { model: Subjects, as: "subject", attributes: ["subject_name"] }, // Use the alias for Subjects
      ],
    });

    return res.status(200).json({
      getAllMarksMessage: "Marks retrieved successfully!",
      marks,
    });
  } catch (error) {
    console.error("Error retrieving marks:", error);
    return res.status(500).json({
      getAllMarksMessage: "Server error. Please try again later.",
      getAllMarksCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get a single mark by ID
const getMarkById = async (req, res) => {
  const { markId } = req.params;

  try {
    const mark = await Marks.findOne({
      where: { mark_id_pk: markId, is_deleted: false },
      include: [
        { model: Students, attributes: ["student_name"] },
        { model: Subjects, attributes: ["subject_name"] },
      ],
    });

    if (!mark) {
      return res.status(404).json({
        getMarkByIdMessage: "Mark not found or deleted.",
      });
    }

    return res.status(200).json({
      getMarkByIdMessage: "Mark retrieved successfully!",
      mark,
    });
  } catch (error) {
    console.error("Error retrieving mark:", error);
    return res.status(500).json({
      getMarkByIdMessage: "Server error. Please try again later.",
      getMarkByIdCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update a mark
const updateMark = async (req, res) => {
  const { markId } = req.params;
  const { subject_mark } = req.body;

  try {
    // Find the mark
    const mark = await Marks.findOne({
      where: { mark_id_pk: markId, is_deleted: false },
    });

    if (!mark) {
      return res.status(404).json({
        updateMarkMessage: "Mark not found or deleted.",
      });
    }

    // Update mark details
    await mark.update({
      subject_mark:
        subject_mark !== undefined ? subject_mark : mark.subject_mark,
    });

    return res.status(200).json({
      updateMarkMessage: "Mark updated successfully!",
      mark,
    });
  } catch (error) {
    console.error("Error updating mark:", error);
    return res.status(500).json({
      updateMarkMessage: "Server error. Please try again later.",
      updateMarkCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft delete a mark
const deleteMark = async (req, res) => {
  const { markId } = req.params;

  try {
    // Find the mark
    const mark = await Marks.findOne({
      where: { mark_id_pk: markId, is_deleted: false },
    });

    if (!mark) {
      return res.status(404).json({
        deleteMarkMessage: "Mark not found or already deleted.",
      });
    }

    // Soft delete the mark
    await mark.update({ is_deleted: true });

    return res.status(200).json({
      deleteMarkMessage: "Mark deleted successfully!",
      mark,
    });
  } catch (error) {
    console.error("Error deleting mark:", error);
    return res.status(500).json({
      deleteMarkMessage: "Server error. Please try again later.",
      deleteMarkCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover a soft-deleted mark
const recoverMark = async (req, res) => {
  const { markId } = req.params;

  try {
    // Find the soft-deleted mark
    const mark = await Marks.findOne({
      where: { mark_id_pk: markId, is_deleted: true },
    });

    if (!mark) {
      return res.status(404).json({
        recoverMarkMessage: "Mark not found or already recovered.",
      });
    }

    // Recover the mark
    await mark.update({ is_deleted: false });

    return res.status(200).json({
      recoverMarkMessage: "Mark recovered successfully!",
      mark,
    });
  } catch (error) {
    console.error("Error recovering mark:", error);
    return res.status(500).json({
      recoverMarkMessage: "Server error. Please try again later.",
      recoverMarkCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createMark,
  getAllMarks,
  getMarkById,
  updateMark,
  deleteMark,
  recoverMark,
};