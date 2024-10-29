import Classrooms from "../models/Classrooms.js";

// Create Classroom
const createClassroom = async (req, res) => {
  const { capacity, room_type, description } = req.body;

  // Validate input
  if (!capacity || !room_type) {
    return res
      .status(400)
      .json({ createClassroomMessage: "Capacity and Room Type are required." });
  }

  try {
    // Create a new classroom
    const newClassroom = await Classrooms.create({
      capacity,
      room_type,
      description: description || null, // Optional field
    });

    return res.status(201).json({
      createClassroomMessage: "Classroom created successfully!",
      newClassroom,
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    return res.status(500).json({
      createClassroomMessage: "Server error. Please try again later.",
      createClassroomCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get All Classrooms
const getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classrooms.findAll({
      where: { is_deleted: false },
    });
    return res.status(200).json(classrooms);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return res.status(500).json({
      getClassroomsMessage: "Server error. Please try again later.",
      getAllClassroomsCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get Classroom by ID
const getClassroomById = async (req, res) => {
  const { classroomId } = req.params;

  try {
    const classroom = await Classrooms.findOne({
      where: { classroom_id_pk: classroomId, is_deleted: false },
    });

    if (!classroom) {
      return res
        .status(404)
        .json({ getClassroomMessage: "Classroom not found!" });
    }

    return res.status(200).json(classroom);
  } catch (error) {
    console.error("Error fetching classroom:", error);
    return res.status(500).json({
      getClassroomMessage: "Server error. Please try again later.",
      getClassroomCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update Classroom
const updateClassroom = async (req, res) => {
  const { classroomId } = req.params;
  const { capacity, room_type, description } = req.body;

  try {
    const classroom = await Classrooms.findOne({
      where: { classroom_id_pk: classroomId },
    });

    if (!classroom) {
      return res.status(404).json({
        getClassroomMessage: "Classroom not found!",
      });
    }

    // If the classroom is found but is marked as deleted
    if (classroom.is_deleted) {
      return res.status(410).json({
        getClassroomMessage: "Classroom has been deleted!",
      });
    }

    // Update classroom details
    await classroom.update({
      capacity: capacity || classroom.capacity,
      room_type: room_type || classroom.room_type,
      description: description || classroom.description,
    });

    return res.status(200).json({
      updateClassroomMessage: "Classroom details updated successfully!",
    });
  } catch (error) {
    console.error("Error updating classroom:", error);
    return res.status(500).json({
      updateClassroomMessage: "Server error. Please try again later.",
      updateClassroomCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Delete Classroom (Soft Delete)
const deleteClassroom = async (req, res) => {
  const { classroomId } = req.params;

  try {
    // Find the classroom by ID
    const classroom = await Classrooms.findOne({
      where: { classroom_id_pk: classroomId, is_deleted: false },
    });

    if (!classroom) {
      return res
        .status(404)
        .json({ deleteClassroomMessage: "Classroom not found!" });
    }

    // Mark classroom as deleted
    await classroom.update({ is_deleted: true });

    return res
      .status(200)
      .json({ deleteClassroomMessage: "Classroom deleted successfully." });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    return res.status(500).json({
      deleteClassroomMessage: "Server error. Please try again later.",
      deleteClassroomCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover Deleted Classroom
const recoverClassroom = async (req, res) => {
  const { classroomId } = req.params;

  try {
    // Find the deleted classroom by ID
    const classroom = await Classrooms.findOne({
      where: { classroom_id_pk: classroomId, is_deleted: true },
    });

    if (!classroom) {
      return res.status(404).json({
        recoverClassroomMessage: "Classroom not found or is not deleted!",
      });
    }

    // Mark classroom as active
    await classroom.update({ is_deleted: false });

    return res
      .status(200)
      .json({ recoverClassroomMessage: "Classroom recovered successfully!" });
  } catch (error) {
    console.error("Error recovering classroom:", error);
    return res.status(500).json({
      recoverClassroomMessage: "Server error. Please try again later.",
      recoverClassroomCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get All Classroom Codes
const getAllClassroomCodes = async (req, res) => {
  try {
    // Fetch all classroom codes
    const classrooms = await Classrooms.findAll({
      attributes: ["classroom_code"], // Specify to retrieve only classroom_code
      where: { is_deleted: false }, // Filter to include only non-deleted classrooms
    });

    // Extract classroom codes from the retrieved classrooms
    const classroomCodes = classrooms.map(
      (classroom) => classroom.classroom_code
    );

    return res.status(200).json(classroomCodes);
  } catch (error) {
    console.error("Error fetching classroom codes:", error);
    return res.status(500).json({
      getClassroomCodesMessage: "Server error. Please try again later.",
      getAllClassroomCodesCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Exporting all controllers
export {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  recoverClassroom,
  getAllClassroomCodes,
};
