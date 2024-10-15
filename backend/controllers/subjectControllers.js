import Subjects from "../models/Subjects.js";
import Classrooms from "../models/Classrooms.js"; // Include related model if necessary

// Create a new subject
const createSubject = async (req, res) => {
  const { subject_name, classroom_id_fk, section } = req.body;

  // Validate required fields
  if (!subject_name || !classroom_id_fk) {
    return res.status(400).json({
      createSubjectMessage: "Subject Name and Classroom ID are required.",
    });
  }

  // Validate that the classroom exists
  const classroom = await Classrooms.findOne({
    where: { classroom_id_pk: classroom_id_fk },
    paranoid: false, // Include soft-deleted records if necessary
  });

  if (!classroom) {
    return res.status(404).json({
      createSubjectMessage: "Classroom not found.",
    });
  }

  try {
    const newSubject = await Subjects.create({
      subject_name,
      classroom_id_fk,
      section,
    });

    return res.status(201).json({
      createSubjectMessage: "Subject created successfully!",
      newSubject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    return res.status(500).json({
      createSubjectMessage: "Server error. Please try again later.",
      createSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subjects.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Classrooms,
          as: "classroom", // Adjust if you set an alias in your model
        },
      ],
    });

    return res.status(200).json({
      getAllSubjectsMessage: "Subjects retrieved successfully!",
      subjects,
    });
  } catch (error) {
    console.error("Error retrieving subjects:", error);
    return res.status(500).json({
      getAllSubjectsMessage: "Server error. Please try again later.",
      getAllSubjectsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single subject by ID
const getSubjectById = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false },
      include: [
        {
          model: Classrooms,
          as: "classroom", // Adjust if you set an alias in your model
        },
      ],
    });

    if (!subject) {
      return res.status(404).json({
        getSubjectMessage: "Subject not found or deleted.",
      });
    }

    return res.status(200).json({
      getSubjectMessage: "Subject retrieved successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error retrieving subject:", error);
    return res.status(500).json({
      getSubjectMessage: "Server error. Please try again later.",
      getSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a subject
const updateSubject = async (req, res) => {
  const { subjectId } = req.params;
  const { subject_name, classroom_id_fk, section } = req.body;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false },
    });

    if (!subject) {
      return res.status(404).json({
        updateSubjectMessage: "Subject not found or deleted.",
      });
    }

    // Update fields
    if (subject_name) subject.subject_name = subject_name;
    if (classroom_id_fk) subject.classroom_id_fk = classroom_id_fk;
    if (section) subject.section = section;

    await subject.save();

    return res.status(200).json({
      updateSubjectMessage: "Subject updated successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    return res.status(500).json({
      updateSubjectMessage: "Server error. Please try again later.",
      updateSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false },
    });

    if (!subject) {
      return res.status(404).json({
        deleteSubjectMessage: "Subject not found or already deleted.",
      });
    }

    // Soft delete the subject record
    subject.is_deleted = true;
    await subject.save();

    return res.status(200).json({
      deleteSubjectMessage: "Subject deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return res.status(500).json({
      deleteSubjectMessage: "Server error. Please try again later.",
      deleteSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted subject
const recoverSubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: true },
    });

    if (!subject) {
      return res.status(404).json({
        recoverSubjectMessage: "Subject not found or not deleted.",
      });
    }

    // Restore the subject record
    subject.is_deleted = false;
    await subject.save();

    return res.status(200).json({
      recoverSubjectMessage: "Subject recovered successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error recovering subject:", error);
    return res.status(500).json({
      recoverSubjectMessage: "Server error. Please try again later.",
      recoverSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  recoverSubject,
};
