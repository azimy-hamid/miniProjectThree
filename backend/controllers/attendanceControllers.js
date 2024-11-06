import Attendance from "../models/Attendance.js";
import Students from "../models/Students.js";
import Subjects from "../models/Subjects.js";

// Create a new attendance record
const createAttendance = async (req, res) => {
  const {
    student_ids_fk, // Expecting an array of student IDs
    subject_id_fk,
    attendance_date,
    attendance_status,
    reason,
  } = req.body;

  // Validate required input
  if (
    !student_ids_fk ||
    !Array.isArray(student_ids_fk) ||
    student_ids_fk.length === 0 ||
    !subject_id_fk ||
    !attendance_status
  ) {
    return res.status(400).json({
      createAttendanceMessage:
        "Missing required fields or invalid student list.",
    });
  }

  try {
    // Validate if the subject exists
    const subjectExists = await Subjects.findOne({
      where: { subject_id_pk: subject_id_fk },
    });
    if (!subjectExists) {
      return res.status(404).json({
        createAttendanceMessage: "Subject not found!",
      });
    }

    // Create attendance records for each student in the list
    const attendanceRecords = [];
    const skippedStudents = [];

    // Normalize the attendance date to ignore time (e.g., set to midnight)
    const normalizedAttendanceDate = new Date(attendance_date).setHours(
      0,
      0,
      0,
      0
    );

    for (const student_id_fk of student_ids_fk) {
      // Validate if each student exists
      const studentExists = await Students.findOne({
        where: { student_id_pk: student_id_fk, is_deleted: false },
      });
      if (!studentExists) {
        // If a student is not found, skip this iteration and log the missing student
        console.warn(`Student with ID ${student_id_fk} not found, skipping.`);
        skippedStudents.push(student_id_fk);
        continue;
      }

      // Check if attendance already exists for this student on the same date (ignoring time)
      const attendanceExists = await Attendance.findOne({
        where: {
          student_id_fk,
          subject_id_fk,
          attendance_date: new Date(normalizedAttendanceDate).toISOString(),
        },
      });

      if (attendanceExists) {
        // If attendance already exists, skip this student
        console.warn(
          `Attendance already marked for student ID ${student_id_fk} on ${attendance_date}`
        );
        skippedStudents.push(student_id_fk);
        continue;
      }

      // Create a new attendance record for each student
      const newAttendance = await Attendance.create({
        student_id_fk,
        subject_id_fk,
        attendance_date: normalizedAttendanceDate, // Ensure correct date format
        attendance_status,
        reason,
      });
      attendanceRecords.push(newAttendance);
    }

    // Check if any records were created
    if (attendanceRecords.length === 0) {
      return res.status(404).json({
        createAttendanceMessage:
          "No valid students found to create attendance records, or students already have attendance marked.",
        skippedStudents,
      });
    }

    return res.status(201).json({
      createAttendanceMessage: "Attendance records created successfully!",
      attendanceRecords,
      skippedStudents, // List of students who were skipped (either not found or already had attendance marked)
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

export {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  recoverAttendance,
};
