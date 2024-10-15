import Semester_Subject from "../models/SemesterSubject.js";
import Semesters from "../models/Semesters.js";
import Subjects from "../models/Subjects.js";

// Create a Semester-Subject record
const createSemesterSubject = async (req, res) => {
  const { semester_id_fk, subject_id_fk } = req.body;

  // Validate required input
  if (!semester_id_fk || !subject_id_fk) {
    return res.status(400).json({
      createSemesterSubjectMessage: "Semester ID and Subject ID are required.",
    });
  }

  try {
    // Check if the semester exists
    const semester = await Semesters.findOne({
      where: { semester_id_pk: semester_id_fk },
      paranoid: false,
    });

    if (!semester) {
      return res.status(404).json({
        createSemesterSubjectMessage: "Semester not found.",
      });
    }

    // Check if the subject exists
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subject_id_fk },
      paranoid: false,
    });

    if (!subject) {
      return res.status(404).json({
        createSemesterSubjectMessage: "Subject not found.",
      });
    }

    // Create a new semester-subject association
    const newSemesterSubject = await Semester_Subject.create({
      semester_id_fk,
      subject_id_fk,
    });

    return res.status(201).json({
      createSemesterSubjectMessage: "Semester-Subject created successfully!",
      newSemesterSubject,
    });
  } catch (error) {
    console.error("Error creating semester-subject association:", error);
    return res.status(500).json({
      createSemesterSubjectMessage: "Server error. Please try again later.",
      createSemesterSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get All Semester-Subject Associations
const getAllSemesterSubjects = async (req, res) => {
  try {
    const semesterSubjects = await Semester_Subject.findAll({
      where: { is_deleted: false }, // Fetch only non-deleted records
    });

    return res.status(200).json(semesterSubjects);
  } catch (error) {
    console.error("Error fetching semester-subject associations:", error);
    return res.status(500).json({
      getAllSemesterSubjectsMessage: "Server error. Please try again later.",
      getAllSemesterSubjectsCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get Single Semester-Subject Association by ID
const getSemesterSubjectById = async (req, res) => {
  const { semesterSubjectId } = req.params;

  try {
    const semesterSubject = await Semester_Subject.findOne({
      where: { semester_subject_id_pk: semesterSubjectId, is_deleted: false },
    });

    if (!semesterSubject) {
      return res.status(404).json({
        getSemesterSubjectMessage: "Semester-Subject not found!",
      });
    }

    return res.status(200).json(semesterSubject);
  } catch (error) {
    console.error("Error fetching semester-subject association:", error);
    return res.status(500).json({
      getSemesterSubjectMessage: "Server error. Please try again later.",
      getSemesterSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update Semester-Subject Association
const updateSemesterSubject = async (req, res) => {
  const { semesterSubjectId } = req.params;
  const { semester_id_fk, subject_id_fk } = req.body;

  try {
    // Find the semester-subject association by ID
    const semesterSubject = await Semester_Subject.findOne({
      where: { semester_subject_id_pk: semesterSubjectId, is_deleted: false },
    });

    if (!semesterSubject) {
      return res.status(404).json({
        updateSemesterSubjectMessage: "Semester-Subject not found!",
      });
    }

    // Update the semester-subject association
    semesterSubject.semester_id_fk =
      semester_id_fk || semesterSubject.semester_id_fk;
    semesterSubject.subject_id_fk =
      subject_id_fk || semesterSubject.subject_id_fk;

    await semesterSubject.save();

    return res.status(200).json({
      updateSemesterSubjectMessage: "Semester-Subject updated successfully!",
      semesterSubject,
    });
  } catch (error) {
    console.error("Error updating semester-subject association:", error);
    return res.status(500).json({
      updateSemesterSubjectMessage: "Server error. Please try again later.",
      updateSemesterSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft Delete Semester-Subject Association
const deleteSemesterSubject = async (req, res) => {
  const { semesterSubjectId } = req.params;

  try {
    // Find the semester-subject association by ID
    const semesterSubject = await Semester_Subject.findOne({
      where: { semester_subject_id_pk: semesterSubjectId, is_deleted: false },
    });

    if (!semesterSubject) {
      return res.status(404).json({
        deleteSemesterSubjectMessage:
          "Semester-Subject not found or might be already deleted!",
      });
    }

    // Soft delete by setting `is_deleted` to true
    semesterSubject.is_deleted = true;
    await semesterSubject.save();

    return res.status(200).json({
      deleteSemesterSubjectMessage: "Semester-Subject deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting semester-subject association:", error);
    return res.status(500).json({
      deleteSemesterSubjectMessage: "Server error. Please try again later.",
      deleteSemesterSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover a soft-deleted Semester-Subject Association
const recoverSemesterSubject = async (req, res) => {
  const { semesterSubjectId } = req.params;

  try {
    const semesterSubject = await Semester_Subject.findOne({
      where: { semester_subject_id_pk: semesterSubjectId, is_deleted: true },
    });

    if (!semesterSubject) {
      return res.status(404).json({
        recoverSemesterSubjectMessage:
          "Semester-Subject not found or is not deleted!",
      });
    }

    await semesterSubject.update({ is_deleted: false });

    return res.status(200).json({
      recoverSemesterSubjectMessage: "Semester-Subject recovered successfully!",
    });
  } catch (error) {
    console.error("Error recovering semester-subject association:", error);
    return res.status(500).json({
      recoverSemesterSubjectMessage: "Server error. Please try again later.",
      recoverSemesterSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createSemesterSubject,
  getAllSemesterSubjects,
  getSemesterSubjectById,
  updateSemesterSubject,
  deleteSemesterSubject,
  recoverSemesterSubject,
};
