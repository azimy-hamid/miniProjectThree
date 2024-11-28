import Student_Subjects from "../models/StudentSubjects.js";
import Students from "../models/Students.js";
import Subjects from "../models/Subjects.js";

// Create a new student-subject association
const createStudentSubject = async (req, res) => {
  const { student_id_fk, subject_code } = req.body;

  // Validate required fields
  if (!student_id_fk || !subject_code) {
    return res.status(400).json({
      createStudentSubjectMessage: "Student ID and Subject Code are required.",
    });
  }

  try {
    // Check if the student exists and is not deleted
    const student = await Students.findOne({
      where: { student_id_pk: student_id_fk, is_deleted: false },
    });
    if (!student) {
      return res.status(404).json({
        createStudentSubjectMessage: "Student not found or deleted.",
      });
    }

    // Check if the subject exists based on the subject_code and is not deleted
    const subject = await Subjects.findOne({
      where: { subject_code: subject_code, is_deleted: false },
    });
    if (!subject) {
      return res.status(404).json({
        createStudentSubjectMessage: "Subject not found or deleted.",
      });
    }

    // Check if the student's grade_code matches the subject's grade_code
    if (student.grade_id_fk !== subject.grade_id_fk) {
      return res.status(400).json({
        createStudentSubjectMessage:
          "You are not in the grade in which this subject is taught.",
      });
    }

    // Check if the student is already enrolled in the subject
    const existingEnrollment = await Student_Subjects.findOne({
      where: {
        student_id_fk,
        subject_id_fk: subject.subject_id_pk,
        is_done: false,
        is_deleted: false, // Ensure it's not a deleted record
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        createStudentSubjectMessage:
          "Student is already enrolled in this subject.",
      });
    }

    // Create the association using subject_id_pk from the subject found
    const newStudentSubject = await Student_Subjects.create({
      student_id_fk,
      subject_id_fk: subject.subject_id_pk,
    });

    return res.status(201).json({
      createStudentSubjectMessage:
        "Student-Subject association created successfully!",
      newStudentSubject,
    });
  } catch (error) {
    console.error("Error creating student-subject association:", error);
    return res.status(500).json({
      createStudentSubjectMessage: "Server error. Please try again later.",
      createStudentSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all student-subject associations
const getAllStudentSubjects = async (req, res) => {
  try {
    const studentsWithSubjects = await Students.findAll({
      where: { is_deleted: false }, // Filter on the Students table
      include: [
        {
          model: Subjects,
          as: "subjects", // Alias for Subjects as defined in belongsToMany
          where: { is_deleted: false }, // Optional filter on Subjects
        },
      ],
    });

    return res.status(200).json({
      getAllStudentSubjectsMessage:
        "Student-Subject associations retrieved successfully!",
      studentsWithSubjects,
    });
  } catch (error) {
    console.error("Error retrieving student-subject associations:", error);
    return res.status(500).json({
      getAllStudentSubjectsMessage: "Server error. Please try again later.",
      getAllStudentSubjectsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single student-subject association by ID
const getStudentSubjectById = async (req, res) => {
  const { studentSubjectId } = req.params;

  try {
    const studentSubject = await Student_Subjects.findOne({
      where: { student_subjects_id_pk: studentSubjectId, is_deleted: false },
      include: [
        { model: Students, where: { is_deleted: false } },
        { model: Subjects, where: { is_deleted: false } },
      ],
    });

    if (!studentSubject) {
      return res.status(404).json({
        getStudentSubjectMessage:
          "Student-Subject association not found or deleted.",
      });
    }

    return res.status(200).json({
      getStudentSubjectMessage:
        "Student-Subject association retrieved successfully!",
      studentSubject,
    });
  } catch (error) {
    console.error("Error retrieving student-subject association:", error);
    return res.status(500).json({
      getStudentSubjectMessage: "Server error. Please try again later.",
      getStudentSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a student-subject association
const updateStudentSubject = async (req, res) => {
  const { studentSubjectId } = req.params;
  const { student_id_fk, subject_code } = req.body;

  try {
    const studentSubject = await Student_Subjects.findOne({
      where: { student_subjects_id_pk: studentSubjectId, is_deleted: false },
    });

    if (!studentSubject) {
      return res.status(404).json({
        updateStudentSubjectMessage:
          "Student-Subject association not found or deleted.",
      });
    }

    // Validate new student if provided
    if (student_id_fk) {
      const student = await Students.findOne({
        where: { student_id_pk: student_id_fk, is_deleted: false },
      });
      if (!student) {
        return res.status(404).json({
          updateStudentSubjectMessage: "Student not found or deleted.",
        });
      }
      studentSubject.student_id_fk = student_id_fk;
    }

    // Validate and update subject using subject_code if provided
    if (subject_code) {
      const subject = await Subjects.findOne({
        where: { subject_code: subject_code, is_deleted: false },
      });
      if (!subject) {
        return res.status(404).json({
          updateStudentSubjectMessage: "Subject not found or deleted.",
        });
      }
      studentSubject.subject_id_fk = subject.subject_id_pk;
    }

    await studentSubject.save();

    return res.status(200).json({
      updateStudentSubjectMessage:
        "Student-Subject association updated successfully!",
      studentSubject,
    });
  } catch (error) {
    console.error("Error updating student-subject association:", error);
    return res.status(500).json({
      updateStudentSubjectMessage: "Server error. Please try again later.",
      updateStudentSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a student-subject association
const deleteStudentSubject = async (req, res) => {
  const { studentSubjectId } = req.params;

  try {
    const studentSubject = await Student_Subjects.findOne({
      where: { student_subjects_id_pk: studentSubjectId, is_deleted: false },
    });

    if (!studentSubject) {
      return res.status(404).json({
        deleteStudentSubjectMessage:
          "Student-Subject association not found or already deleted.",
      });
    }

    // Soft delete the association
    studentSubject.is_deleted = true;
    await studentSubject.save();

    return res.status(200).json({
      deleteStudentSubjectMessage:
        "Student-Subject association deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting student-subject association:", error);
    return res.status(500).json({
      deleteStudentSubjectMessage: "Server error. Please try again later.",
      deleteStudentSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted student-subject association
const recoverStudentSubject = async (req, res) => {
  const { studentSubjectId } = req.params;

  try {
    const studentSubject = await Student_Subjects.findOne({
      where: { student_subjects_id_pk: studentSubjectId, is_deleted: true },
    });

    if (!studentSubject) {
      return res.status(404).json({
        recoverStudentSubjectMessage:
          "Student-Subject association not found or not deleted.",
      });
    }

    // Restore the association
    studentSubject.is_deleted = false;
    await studentSubject.save();

    return res.status(200).json({
      recoverStudentSubjectMessage:
        "Student-Subject association recovered successfully!",
      studentSubject,
    });
  } catch (error) {
    console.error("Error recovering student-subject association:", error);
    return res.status(500).json({
      recoverStudentSubjectMessage: "Server error. Please try again later.",
      recoverStudentSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createStudentSubject,
  getAllStudentSubjects,
  getStudentSubjectById,
  updateStudentSubject,
  deleteStudentSubject,
  recoverStudentSubject,
};
