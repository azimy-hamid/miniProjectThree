import Attendance from "../models/Attendance.js";
import Students from "../models/Students.js";
import Subjects from "../models/Subjects.js";

// Create a new attendance record
const createAttendance = async (req, res) => {
  const attendanceRecords = req.body; // Expecting an array of attendance objects

  // Validate input
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res.status(400).json({
      createAttendanceMessage: "Invalid attendance data provided.",
    });
  }

  try {
    const createdRecords = [];
    const skippedRecords = [];

    for (const record of attendanceRecords) {
      const {
        student_ids_fk,
        subject_id_fk,
        attendance_date,
        attendance_status,
        reason,
      } = record;

      if (
        !student_ids_fk ||
        !subject_id_fk ||
        !attendance_date ||
        !attendance_status
      ) {
        skippedRecords.push({ record, reason: "Missing required fields" });
        continue;
      }

      // Validate if the subject exists
      const subjectExists = await Subjects.findOne({
        where: { subject_id_pk: subject_id_fk },
      });
      if (!subjectExists) {
        skippedRecords.push({ record, reason: "Subject not found" });
        continue;
      }

      // Validate if the student exists
      const studentExists = await Students.findOne({
        where: { student_id_pk: student_ids_fk, is_deleted: false },
      });
      if (!studentExists) {
        skippedRecords.push({ record, reason: "Student not found" });
        continue;
      }

      // Normalize the attendance date to ignore time
      const normalizedAttendanceDate = new Date(attendance_date).setHours(
        0,
        0,
        0,
        0
      );

      // Check if attendance already exists
      const attendanceExists = await Attendance.findOne({
        where: {
          student_id_fk: student_ids_fk,
          subject_id_fk,
          attendance_date: new Date(normalizedAttendanceDate).toISOString(),
        },
      });
      if (attendanceExists) {
        skippedRecords.push({
          record,
          reason: "Attendance already marked for this date",
        });
        continue;
      }

      // Create attendance record
      const newAttendance = await Attendance.create({
        student_id_fk: student_ids_fk,
        subject_id_fk,
        attendance_date: normalizedAttendanceDate,
        attendance_status,
        reason,
      });
      createdRecords.push(newAttendance);
    }

    if (createdRecords.length === 0) {
      return res.status(404).json({
        createAttendanceMessage:
          "No attendance records created. All records were skipped.",
        skippedRecords,
      });
    }

    return res.status(201).json({
      createAttendanceMessage: "Attendance records created successfully!",
      createdRecords,
      skippedRecords,
    });
  } catch (error) {
    console.error("Error creating attendance:", error);
    return res.status(500).json({
      createAttendanceMessage: "Server error. Please try again later.",
      error: error.message || "Unknown error",
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

const getStudentAttendanceGroupedBySubject = async (req, res) => {
  const { studentId } = req.params; // Expecting student ID from request parameters

  if (!studentId) {
    return res.status(400).json({
      getAttendanceMessage: "Student ID is required.",
    });
  }

  try {
    // Fetch attendance records grouped by subject
    const attendanceRecords = await Attendance.findAll({
      where: { student_id_fk: studentId },
      include: [
        {
          model: Subjects,
          as: "subject",
          attributes: ["subject_id_pk", "subject_code", "subject_name"],
        },
      ],
      attributes: [
        "attendance_date",
        "attendance_status",
        "reason",
        "subject_id_fk",
      ],
      order: [["attendance_date", "ASC"]],
    });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        getAttendanceMessage: "No attendance records found for this student.",
      });
    }

    // Group attendance by subject
    const groupedAttendance = attendanceRecords.reduce((acc, record) => {
      const subjectCode = record.subject.subject_code;
      const subjectName = record.subject.subject_name;

      if (!acc[subjectCode]) {
        acc[subjectCode] = {
          subjectName,
          subjectCode,
          attendance: [],
        };
      }

      acc[subjectCode].attendance.push({
        date: record.attendance_date,
        status: record.attendance_status,
        reason: record.reason,
      });

      return acc;
    }, {});

    return res.status(200).json({
      getAttendanceMessage: "Attendance records retrieved successfully!",
      groupedAttendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    return res.status(500).json({
      getAttendanceMessage: "Server error. Please try again later.",
      error: error.message || "Unknown error",
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
  getStudentAttendanceGroupedBySubject,
};
