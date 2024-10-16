import Attendance from "../models/Attendance.js";
import Students from "../models/Students.js";
import Semester_Subject from "../models/SemesterSubject.js";

// Create a new attendance record
const createAttendance = async (req, res) => {
  const {
    student_id_fk,
    semester_subject_id_fk,
    attendance_date,
    attendance_status,
    attendance_type,
    reason,
  } = req.body;

  // Validate required input
  if (
    !student_id_fk ||
    !semester_subject_id_fk ||
    !attendance_status ||
    !attendance_type
  ) {
    return res.status(400).json({
      createAttendanceMessage: "Missing required fields.",
    });
  }

  try {
    // Validate if the student exists
    const studentExists = await Students.findOne({
      where: { student_id_pk: student_id_fk, is_deleted: false },
    });
    if (!studentExists) {
      return res.status(404).json({
        createAttendanceMessage: "Student not found!",
      });
    }

    // Validate if the semester subject exists
    const semesterSubjectExists = await Semester_Subject.findOne({
      where: {
        semester_subject_id_pk: semester_subject_id_fk,
        is_deleted: false,
      },
    });
    if (!semesterSubjectExists) {
      return res.status(404).json({
        createAttendanceMessage: "Semester subject not found!",
      });
    }

    // Create a new attendance record
    const newAttendance = await Attendance.create({
      student_id_fk,
      semester_subject_id_fk,
      attendance_date,
      attendance_status,
      attendance_type,
      reason,
    });

    return res.status(201).json({
      createAttendanceMessage: "Attendance record created successfully!",
      newAttendance,
    });
  } catch (error) {
    console.error("Error creating attendance:", error);
    return res.status(500).json({
      createAttendanceMessage: "Server error. Please try again later.",
      createAttendanceCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Students,
          as: "student", // Use the alias defined in the association
          attributes: ["student_id_pk"],
        },
        {
          model: Semester_Subject,
          as: "semester_subject", // Ensure the correct alias for Semester_Subject
          attributes: ["semester_subject_id_pk"],
        },
      ],
    });

    return res.status(200).json({
      attendanceRecords,
    });
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    return res.status(500).json({
      getAllAttendanceMessage: "Server error. Please try again later.",
    });
  }
};

// Get a single attendance record by ID
const getAttendanceById = async (req, res) => {
  const { attendanceId } = req.params;

  try {
    const attendanceRecord = await Attendance.findOne({
      where: { attendance_id_pk: attendanceId, is_deleted: false },
      include: [
        {
          model: Students,
          as: "student", // Use the alias defined in the association
          attributes: ["student_id_pk"],
        },
        {
          model: Semester_Subject,
          as: "semester_subject", // Ensure the correct alias for Semester_Subject
          attributes: ["semester_subject_id_pk"],
        },
      ],
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        getAttendanceMessage: "Attendance record not found!",
      });
    }

    return res.status(200).json({
      attendanceRecord,
    });
  } catch (error) {
    console.error("Error retrieving attendance record:", error);
    return res.status(500).json({
      getAttendanceMessage: "Server error. Please try again later.",
    });
  }
};

// Update an attendance record
const updateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const {
    student_id_fk,
    semester_subject_id_fk,
    attendance_date,
    attendance_status,
    attendance_type,
    reason,
  } = req.body;

  try {
    // Find the attendance record by ID
    const attendance = await Attendance.findOne({
      where: { attendance_id_pk: attendanceId, is_deleted: false },
    });

    if (!attendance) {
      return res.status(404).json({
        updateAttendanceMessage: "Attendance record not found!",
      });
    }

    // Validate if student exists if provided
    if (student_id_fk) {
      const studentExists = await Students.findOne({
        where: { student_id_pk: student_id_fk, is_deleted: false },
      });
      if (!studentExists) {
        return res.status(404).json({
          updateAttendanceMessage: "Student not found!",
        });
      }
      attendance.student_id_fk = student_id_fk;
    }

    // Validate if semester subject exists if provided
    if (semester_subject_id_fk) {
      const semesterSubjectExists = await Semester_Subject.findOne({
        where: {
          semester_subject_id_pk: semester_subject_id_fk,
          is_deleted: false,
        },
      });
      if (!semesterSubjectExists) {
        return res.status(404).json({
          updateAttendanceMessage: "Semester subject not found!",
        });
      }
      attendance.semester_subject_id_fk = semester_subject_id_fk;
    }

    // Update other fields
    if (attendance_date) attendance.attendance_date = attendance_date;
    if (attendance_status) attendance.attendance_status = attendance_status;
    if (attendance_type) attendance.attendance_type = attendance_type;
    if (reason) attendance.reason = reason;

    await attendance.save();

    return res.status(200).json({
      updateAttendanceMessage: "Attendance record updated successfully!",
      attendance,
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    return res.status(500).json({
      updateAttendanceMessage: "Server error. Please try again later.",
      updateAttendanceCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft delete an attendance record
const deleteAttendance = async (req, res) => {
  const { attendanceId } = req.params;

  try {
    const attendance = await Attendance.findOne({
      where: { attendance_id_pk: attendanceId, is_deleted: false },
    });

    if (!attendance) {
      return res.status(404).json({
        deleteAttendanceMessage:
          "Attendance record not found or already deleted!",
      });
    }

    attendance.is_deleted = true;
    await attendance.save();

    return res.status(200).json({
      deleteAttendanceMessage: "Attendance record deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return res.status(500).json({
      deleteAttendanceMessage: "Server error. Please try again later.",
    });
  }
};

// Recover a soft deleted attendance record
const recoverAttendance = async (req, res) => {
  const { attendanceId } = req.params;

  try {
    const attendance = await Attendance.findOne({
      where: { attendance_id_pk: attendanceId, is_deleted: true },
    });

    if (!attendance) {
      return res.status(404).json({
        recoverAttendanceMessage: "Attendance record not found or not deleted!",
      });
    }

    attendance.is_deleted = false;
    await attendance.save();

    return res.status(200).json({
      recoverAttendanceMessage: "Attendance record recovered successfully!",
      attendance,
    });
  } catch (error) {
    console.error("Error recovering attendance record:", error);
    return res.status(500).json({
      recoverAttendanceMessage: "Server error. Please try again later.",
    });
  }
};

export {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  recoverAttendance,
};
