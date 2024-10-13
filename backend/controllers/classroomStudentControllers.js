import Classroom_Student from "../models/Classroom_Student.js"; // Adjust path as necessary
import Students from "../models/Students.js"; // Adjust path as necessary
import Classrooms from "../models/Classrooms.js"; // Adjust path as necessary

// Create a new classroom-student relationship
const createClassroomStudent = async (req, res) => {
  const { classroom_id_fk, student_id_fk, grade } = req.body;

  // Validate required input
  if (!classroom_id_fk || !student_id_fk || !grade) {
    return res.status(400).json({
      createClassroomStudentMessage:
        "Classroom ID, Student ID, and Grade are required.",
    });
  }

  const student = await Students.findOne({
    where: { student_id_pk: student_id_fk },
    paranoid: false, // Include soft-deleted records in the query
  });

  if (!student) {
    return res.status(404).json({
      createClassroomStudentMessage: "Student not found.",
    });
  }

  // Check if the student is deleted
  if (student.is_deleted) {
    return res.status(400).json({
      createClassroomStudentMessage: "Student has been deleted.",
    });
  }

  const classroom = await Classrooms.findOne({
    where: { classroom_id_pk: classroom_id_fk },
    paranoid: false, // Include soft-deleted records in the query
  });

  if (!classroom) {
    return res.status(404).json({
      createClassroomStudentMessage: "Classroom not found.",
    });
  }

  // Check if the student is deleted
  if (classroom.is_deleted) {
    return res.status(400).json({
      createClassroomStudentMessage: "Classroom has been deleted.",
    });
  }

  try {
    const newClassroomStudent = await Classroom_Student.create({
      classroom_id_fk,
      student_id_fk,
      grade,
    });

    return res.status(201).json({
      createClassroomStudentMessage:
        "Classroom-Student relationship created successfully!",
      newClassroomStudent,
    });
  } catch (error) {
    console.error("Error creating classroom-student relationship:", error);
    return res.status(500).json({
      createClassroomStudentMessage: "Server error. Please try again later.",
      createClassroomStudentCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all classroom-student relationships
const getAllClassroomStudents = async (req, res) => {
  try {
    const classroomStudents = await Classroom_Student.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["student_id_pk", "student_name"],
        },
        {
          model: Classrooms,
          as: "classroom",
          attributes: ["classroom_id_pk", "classroom_name"],
        },
      ],
    });

    return res.status(200).json({
      getAllClassroomStudentsMessage:
        "Classroom-Student relationships retrieved successfully!",
      classroomStudents,
    });
  } catch (error) {
    console.error("Error retrieving classroom-student relationships:", error);
    return res.status(500).json({
      getAllClassroomStudentsMessage: "Server error. Please try again later.",
      getAllClassroomStudentsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single classroom-student relationship by ID
const getClassroomStudentById = async (req, res) => {
  const { classroomStudentId } = req.params;

  try {
    const classroomStudent = await Classroom_Student.findOne({
      where: { classroom_student_id_pk: classroomStudentId, is_deleted: false },
      include: [
        {
          model: Students,
          as: "student",
          attributes: ["student_id_pk", "student_name"],
        },
        {
          model: Classrooms,
          as: "classroom",
          attributes: ["classroom_id_pk", "classroom_name"],
        },
      ],
    });

    if (!classroomStudent) {
      return res.status(404).json({
        getClassroomStudentMessage:
          "Classroom-Student relationship not found or deleted.",
      });
    }

    return res.status(200).json({
      getClassroomStudentMessage:
        "Classroom-Student relationship retrieved successfully!",
      classroomStudent,
    });
  } catch (error) {
    console.error("Error retrieving classroom-student relationship:", error);
    return res.status(500).json({
      getClassroomStudentMessage: "Server error. Please try again later.",
      getClassroomStudentCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a classroom-student relationship
const updateClassroomStudent = async (req, res) => {
  const { classroomStudentId } = req.params;
  const { classroom_id_fk, student_id_fk, grade } = req.body;

  try {
    const classroomStudent = await Classroom_Student.findOne({
      where: { classroom_student_id_pk: classroomStudentId, is_deleted: false },
    });

    if (!classroomStudent) {
      return res.status(404).json({
        updateClassroomStudentMessage:
          "Classroom-Student relationship not found or deleted.",
      });
    }

    const student = await Students.findOne({
      where: { student_id_pk: student_id_fk },
      paranoid: false, // Include soft-deleted records in the query
    });

    if (!student) {
      return res.status(404).json({
        createClassroomStudentMessage: "Student not found.",
      });
    }

    // Check if the student is deleted
    if (student.is_deleted) {
      return res.status(400).json({
        createClassroomStudentMessage: "Student has been deleted.",
      });
    }

    const classroom = await Classrooms.findOne({
      where: { classroom_id_pk: classroom_id_fk },
      paranoid: false, // Include soft-deleted records in the query
    });

    if (!classroom) {
      return res.status(404).json({
        createClassroomStudentMessage: "Classroom not found.",
      });
    }

    // Check if the student is deleted
    if (classroom.is_deleted) {
      return res.status(400).json({
        createClassroomStudentMessage: "Classroom has been deleted.",
      });
    }

    // Update fields
    if (classroom_id_fk) classroomStudent.classroom_id_fk = classroom_id_fk;
    if (student_id_fk) classroomStudent.student_id_fk = student_id_fk;
    if (grade) classroomStudent.grade = grade;

    await classroomStudent.save();

    return res.status(200).json({
      updateClassroomStudentMessage:
        "Classroom-Student relationship updated successfully!",
      classroomStudent,
    });
  } catch (error) {
    console.error("Error updating classroom-student relationship:", error);
    return res.status(500).json({
      updateClassroomStudentMessage: "Server error. Please try again later.",
      updateClassroomStudentCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a classroom-student relationship
const deleteClassroomStudent = async (req, res) => {
  const { classroomStudentId } = req.params;

  try {
    const classroomStudent = await Classroom_Student.findOne({
      where: { classroom_student_id_pk: classroomStudentId, is_deleted: false },
    });

    if (!classroomStudent) {
      return res.status(404).json({
        deleteClassroomStudentMessage:
          "Classroom-Student relationship not found or deleted.",
      });
    }

    // Mark as deleted
    classroomStudent.is_deleted = true;
    await classroomStudent.save();

    return res.status(200).json({
      deleteClassroomStudentMessage:
        "Classroom-Student relationship deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting classroom-student relationship:", error);
    return res.status(500).json({
      deleteClassroomStudentMessage: "Server error. Please try again later.",
      deleteClassroomStudentCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted classroom-student relationship
const recoverClassroomStudent = async (req, res) => {
  const { classroomStudentId } = req.params;

  try {
    const classroomStudent = await Classroom_Student.findOne({
      where: { classroom_student_id_pk: classroomStudentId, is_deleted: true }, // Find only deleted records
    });

    if (!classroomStudent) {
      return res.status(404).json({
        recoverClassroomStudentMessage:
          "Classroom-Student relationship not found or not deleted.",
      });
    }

    // Restore the relationship
    classroomStudent.is_deleted = false;
    await classroomStudent.save();

    return res.status(200).json({
      recoverClassroomStudentMessage:
        "Classroom-Student relationship recovered successfully!",
      classroomStudent,
    });
  } catch (error) {
    console.error("Error recovering classroom-student relationship:", error);
    return res.status(500).json({
      recoverClassroomStudentMessage: "Server error. Please try again later.",
      recoverClassroomStudentCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createClassroomStudent,
  getAllClassroomStudents,
  getClassroomStudentById,
  updateClassroomStudent,
  deleteClassroomStudent,
  recoverClassroomStudent,
};
