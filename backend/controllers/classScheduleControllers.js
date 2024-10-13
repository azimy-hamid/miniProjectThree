import ClassSchedule from "../models/ClassSchedule.js"; // Adjust path as necessary
import Classrooms from "../models/Classrooms.js"; // Adjust path as necessary
import Subjects from "../models/Subjects.js"; // Adjust path as necessary

// Create a new class schedule
const createClassSchedule = async (req, res) => {
  const { subject_id_fk, classroom_id_fk, day_of_week, start_time, end_time } =
    req.body;

  // Validate required input
  if (!subject_id_fk || !classroom_id_fk || !day_of_week) {
    return res.status(400).json({
      createClassScheduleMessage:
        "Subject ID, Classroom ID, and Day of Week are required.",
    });
  }

  try {
    const newClassSchedule = await ClassSchedule.create({
      subject_id_fk,
      classroom_id_fk,
      day_of_week,
      start_time,
      end_time,
    });

    return res.status(201).json({
      createClassScheduleMessage: "Class schedule created successfully!",
      newClassSchedule,
    });
  } catch (error) {
    console.error("Error creating class schedule:", error);
    return res.status(500).json({
      createClassScheduleMessage: "Server error. Please try again later.",
      createClassScheduleCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all class schedules
const getAllClassSchedules = async (req, res) => {
  try {
    const classSchedules = await ClassSchedule.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Subjects,
          as: "subject",
        },
        {
          model: Classrooms,
          as: "classroom",
        },
      ],
    });

    return res.status(200).json({
      getAllClassSchedulesMessage: "Class schedules retrieved successfully!",
      classSchedules,
    });
  } catch (error) {
    console.error("Error retrieving class schedules:", error);
    return res.status(500).json({
      getAllClassSchedulesMessage: "Server error. Please try again later.",
      getAllClassSchedulesCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single class schedule by ID
const getClassScheduleById = async (req, res) => {
  const { classScheduleId } = req.params;

  try {
    const classSchedule = await ClassSchedule.findOne({
      where: { schedule_id_pk: classScheduleId, is_deleted: false },
      include: [
        {
          model: Subjects,
          as: "subject",
          attributes: ["subject_id_pk", "subject_name"],
        },
        {
          model: Classrooms,
          as: "classroom",
          attributes: ["classroom_id_pk", "classroom_name"],
        },
      ],
    });

    if (!classSchedule) {
      return res.status(404).json({
        getClassScheduleMessage: "Class schedule not found or deleted.",
      });
    }

    return res.status(200).json({
      getClassScheduleMessage: "Class schedule retrieved successfully!",
      classSchedule,
    });
  } catch (error) {
    console.error("Error retrieving class schedule:", error);
    return res.status(500).json({
      getClassScheduleMessage: "Server error. Please try again later.",
      getClassScheduleCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a class schedule
const updateClassSchedule = async (req, res) => {
  const { classScheduleId } = req.params;
  const { subject_id_fk, classroom_id_fk, day_of_week, start_time, end_time } =
    req.body;

  try {
    const classSchedule = await ClassSchedule.findOne({
      where: { schedule_id_pk: classScheduleId, is_deleted: false },
    });

    if (!classSchedule) {
      return res.status(404).json({
        updateClassScheduleMessage: "Class schedule not found or deleted.",
      });
    }

    // Update fields
    if (subject_id_fk) classSchedule.subject_id_fk = subject_id_fk;
    if (classroom_id_fk) classSchedule.classroom_id_fk = classroom_id_fk;
    if (day_of_week) classSchedule.day_of_week = day_of_week;
    if (start_time) classSchedule.start_time = start_time;
    if (end_time) classSchedule.end_time = end_time;

    await classSchedule.save();

    return res.status(200).json({
      updateClassScheduleMessage: "Class schedule updated successfully!",
      classSchedule,
    });
  } catch (error) {
    console.error("Error updating class schedule:", error);
    return res.status(500).json({
      updateClassScheduleMessage: "Server error. Please try again later.",
      updateClassScheduleCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a class schedule
const deleteClassSchedule = async (req, res) => {
  const { classScheduleId } = req.params;

  try {
    const classSchedule = await ClassSchedule.findOne({
      where: { schedule_id_pk: classScheduleId, is_deleted: false },
    });

    if (!classSchedule) {
      return res.status(404).json({
        deleteClassScheduleMessage: "Class schedule not found or deleted.",
      });
    }

    // Mark as deleted
    classSchedule.is_deleted = true;
    await classSchedule.save();

    return res.status(200).json({
      deleteClassScheduleMessage: "Class schedule deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting class schedule:", error);
    return res.status(500).json({
      deleteClassScheduleMessage: "Server error. Please try again later.",
      deleteClassScheduleCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted class schedule
const recoverClassSchedule = async (req, res) => {
  const { classScheduleId } = req.params;

  try {
    const classSchedule = await ClassSchedule.findOne({
      where: { schedule_id_pk: classScheduleId, is_deleted: true }, // Find only deleted schedules
    });

    if (!classSchedule) {
      return res.status(404).json({
        recoverClassScheduleMessage: "Class schedule not found or not deleted.",
      });
    }

    // Restore the class schedule
    classSchedule.is_deleted = false;
    await classSchedule.save();

    return res.status(200).json({
      recoverClassScheduleMessage: "Class schedule recovered successfully!",
      classSchedule,
    });
  } catch (error) {
    console.error("Error recovering class schedule:", error);
    return res.status(500).json({
      recoverClassScheduleMessage: "Server error. Please try again later.",
      recoverClassScheduleCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createClassSchedule,
  getAllClassSchedules,
  getClassScheduleById,
  updateClassSchedule,
  deleteClassSchedule,
  recoverClassSchedule,
};
