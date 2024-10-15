import Teacher_Subjects from "../models/TeacherSubjects.js";
import Teachers from "../models/Teachers.js";
import Subjects from "../models/Subjects.js";

// Create a Teacher-Subject record
const createTeacherSubject = async (req, res) => {
  const { teacher_id_fk, subject_id_fk } = req.body;

  // Validate required input
  if (!teacher_id_fk || !subject_id_fk) {
    return res.status(400).json({
      createTeacherSubjectMessage: "Teacher ID and Subject ID are required.",
    });
  }

  try {
    // Check if the teacher exists
    const teacher = await Teachers.findOne({
      where: { teacher_id_pk: teacher_id_fk },
      paranoid: false, // Include soft-deleted records
    });

    if (!teacher) {
      return res.status(404).json({
        createTeacherSubjectMessage: "Teacher not found.",
      });
    }

    // Check if the subject exists
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subject_id_fk },
      paranoid: false, // Include soft-deleted records
    });

    if (!subject) {
      return res.status(404).json({
        createTeacherSubjectMessage: "Subject not found.",
      });
    }

    // Create a new teacher-subject association
    const newTeacherSubject = await Teacher_Subjects.create({
      teacher_id_fk,
      subject_id_fk,
    });

    return res.status(201).json({
      createTeacherSubjectMessage: "Teacher-Subject created successfully!",
      newTeacherSubject,
    });
  } catch (error) {
    console.error("Error creating teacher-subject association:", error);
    return res.status(500).json({
      createTeacherSubjectMessage: "Server error. Please try again later.",
      createTeacherSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get All Teacher-Subject Associations
const getAllTeacherSubjects = async (req, res) => {
  try {
    const teacherSubjects = await Teacher_Subjects.findAll({
      where: { is_deleted: false }, // Fetch only non-deleted records
    });

    return res.status(200).json(teacherSubjects);
  } catch (error) {
    console.error("Error fetching teacher-subject associations:", error);
    return res.status(500).json({
      getAllTeacherSubjectsMessage: "Server error. Please try again later.",
      getAllTeacherSubjectsCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get Single Teacher-Subject Association by ID
const getTeacherSubjectById = async (req, res) => {
  const { teacherSubjectId } = req.params;

  try {
    const teacherSubject = await Teacher_Subjects.findOne({
      where: { teacher_subjects_id_pk: teacherSubjectId, is_deleted: false },
    });

    if (!teacherSubject) {
      return res.status(404).json({
        getTeacherSubjectMessage: "Teacher-Subject not found!",
      });
    }

    return res.status(200).json(teacherSubject);
  } catch (error) {
    console.error("Error fetching teacher-subject association:", error);
    return res.status(500).json({
      getTeacherSubjectMessage: "Server error. Please try again later.",
      getTeacherSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update Teacher-Subject Association
const updateTeacherSubject = async (req, res) => {
  const { teacherSubjectId } = req.params;
  const { teacher_id_fk, subject_id_fk } = req.body;

  try {
    // Find the teacher-subject association by ID
    const teacherSubject = await Teacher_Subjects.findOne({
      where: { teacher_subjects_id_pk: teacherSubjectId, is_deleted: false },
    });

    if (!teacherSubject) {
      return res.status(404).json({
        updateTeacherSubjectMessage: "Teacher-Subject not found!",
      });
    }

    // Update the teacher-subject association
    teacherSubject.teacher_id_fk =
      teacher_id_fk || teacherSubject.teacher_id_fk;
    teacherSubject.subject_id_fk =
      subject_id_fk || teacherSubject.subject_id_fk;

    await teacherSubject.save();

    return res.status(200).json({
      updateTeacherSubjectMessage: "Teacher-Subject updated successfully!",
      teacherSubject,
    });
  } catch (error) {
    console.error("Error updating teacher-subject association:", error);
    return res.status(500).json({
      updateTeacherSubjectMessage: "Server error. Please try again later.",
      updateTeacherSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft Delete Teacher-Subject Association
const deleteTeacherSubject = async (req, res) => {
  const { teacherSubjectId } = req.params;

  try {
    // Find the teacher-subject association by ID
    const teacherSubject = await Teacher_Subjects.findOne({
      where: { teacher_subjects_id_pk: teacherSubjectId, is_deleted: false },
    });

    if (!teacherSubject) {
      return res.status(404).json({
        deleteTeacherSubjectMessage:
          "Teacher-Subject not found or might be already deleted!",
      });
    }

    // Soft delete by setting `is_deleted` to true
    teacherSubject.is_deleted = true;
    await teacherSubject.save();

    return res.status(200).json({
      deleteTeacherSubjectMessage: "Teacher-Subject deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting teacher-subject association:", error);
    return res.status(500).json({
      deleteTeacherSubjectMessage: "Server error. Please try again later.",
      deleteTeacherSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover a soft-deleted Teacher-Subject Association
const recoverTeacherSubject = async (req, res) => {
  const { teacherSubjectId } = req.params;

  try {
    const teacherSubject = await Teacher_Subjects.findOne({
      where: { teacher_subjects_id_pk: teacherSubjectId, is_deleted: true },
    });

    if (!teacherSubject) {
      return res.status(404).json({
        recoverTeacherSubjectMessage:
          "Teacher-Subject not found or is not deleted!",
      });
    }

    await teacherSubject.update({ is_deleted: false });

    return res.status(200).json({
      recoverTeacherSubjectMessage: "Teacher-Subject recovered successfully!",
    });
  } catch (error) {
    console.error("Error recovering teacher-subject association:", error);
    return res.status(500).json({
      recoverTeacherSubjectMessage: "Server error. Please try again later.",
      recoverTeacherSubjectCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createTeacherSubject,
  getAllTeacherSubjects,
  getTeacherSubjectById,
  updateTeacherSubject,
  deleteTeacherSubject,
  recoverTeacherSubject,
};
