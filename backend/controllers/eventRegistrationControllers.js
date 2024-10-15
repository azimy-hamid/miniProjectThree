import Event_Registration from "../models/EventRegistration.js";
import Students from "../models/Students.js";
import Events from "../models/Events.js";

// Create a new event registration
const createEventRegistration = async (req, res) => {
  const { student_id_fk, event_id_fk } = req.body;

  // Validate required input
  if (!student_id_fk || !event_id_fk) {
    return res.status(400).json({
      createRegistrationMessage: "Student ID and Event ID are required.",
    });
  }

  try {
    // Validate if student exists
    const studentExists = await Students.findOne({
      where: { student_id_pk: student_id_fk, is_deleted: false },
    });
    if (!studentExists) {
      return res.status(404).json({
        createRegistrationMessage: "Student not found!",
      });
    }

    // Validate if event exists
    const eventExists = await Events.findOne({
      where: { event_id_pk: event_id_fk, is_deleted: false },
    });
    if (!eventExists) {
      return res.status(404).json({
        createRegistrationMessage: "Event not found!",
      });
    }

    const newRegistration = await Event_Registration.create({
      student_id_fk,
      event_id_fk,
    });

    return res.status(201).json({
      createRegistrationMessage: "Event registration created successfully!",
      newRegistration,
    });
  } catch (error) {
    console.error("Error creating event registration:", error);
    return res.status(500).json({
      createRegistrationMessage: "Server error. Please try again later.",
      createRegistrationCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get all event registrations
const getAllEventRegistrations = async (req, res) => {
  try {
    const registrations = await Event_Registration.findAll({
      where: { is_deleted: false }, // Fetch only non-deleted registrations
    });

    return res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return res.status(500).json({
      getAllRegistrationsMessage: "Server error. Please try again later.",
      getAllRegistrationsCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get a single event registration by ID
const getEventRegistrationById = async (req, res) => {
  const { registrationId } = req.params;

  try {
    const registration = await Event_Registration.findOne({
      where: { registration_id_pk: registrationId, is_deleted: false },
    });

    if (!registration) {
      return res.status(404).json({
        getRegistrationMessage: "Event registration not found!",
      });
    }

    return res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching event registration:", error);
    return res.status(500).json({
      getRegistrationMessage: "Server error. Please try again later.",
      getRegistrationCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update an event registration
const updateEventRegistration = async (req, res) => {
  const { registrationId } = req.params;
  const { student_id_fk, event_id_fk } = req.body;

  try {
    // Find the registration by ID
    const registration = await Event_Registration.findOne({
      where: { registration_id_pk: registrationId, is_deleted: false },
    });

    if (!registration) {
      return res.status(404).json({
        updateRegistrationMessage: "Event registration not found!",
      });
    }

    // Validate if student exists if provided
    if (student_id_fk) {
      const studentExists = await Students.findOne({
        where: { student_id_pk: student_id_fk, is_deleted: false },
      });
      if (!studentExists) {
        return res.status(404).json({
          updateRegistrationMessage: "Student not found!",
        });
      }
      registration.student_id_fk = student_id_fk;
    }

    // Validate if event exists if provided
    if (event_id_fk) {
      const eventExists = await Events.findOne({
        where: { event_id_pk: event_id_fk, is_deleted: false },
      });
      if (!eventExists) {
        return res.status(404).json({
          updateRegistrationMessage: "Event not found!",
        });
      }
      registration.event_id_fk = event_id_fk;
    }

    await registration.save();

    return res.status(200).json({
      updateRegistrationMessage: "Event registration updated successfully!",
      registration,
    });
  } catch (error) {
    console.error("Error updating event registration:", error);
    return res.status(500).json({
      updateRegistrationMessage: "Server error. Please try again later.",
      updateRegistrationCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft delete an event registration
const deleteEventRegistration = async (req, res) => {
  const { registrationId } = req.params;

  try {
    // Find the registration by ID
    const registration = await Event_Registration.findOne({
      where: { registration_id_pk: registrationId, is_deleted: false },
    });

    if (!registration) {
      return res.status(404).json({
        deleteRegistrationMessage:
          "Event registration not found or might be already deleted!",
      });
    }

    // Soft delete by setting `is_deleted` to true
    registration.is_deleted = true;
    await registration.save();

    return res.status(200).json({
      deleteRegistrationMessage: "Event registration deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting event registration:", error);
    return res.status(500).json({
      deleteRegistrationMessage: "Server error. Please try again later.",
      deleteRegistrationCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover a soft-deleted event registration
const recoverEventRegistration = async (req, res) => {
  const { registrationId } = req.params;

  try {
    const registration = await Event_Registration.findOne({
      where: { registration_id_pk: registrationId, is_deleted: true },
    });

    if (!registration) {
      return res.status(404).json({
        recoverRegistrationMessage:
          "Event registration not found or is not deleted!",
      });
    }

    await registration.update({ is_deleted: false });

    return res.status(200).json({
      recoverRegistrationMessage: "Event registration recovered successfully!",
    });
  } catch (error) {
    console.error("Error recovering event registration:", error);
    return res.status(500).json({
      recoverRegistrationMessage: "Server error. Please try again later.",
      recoverRegistrationCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createEventRegistration,
  getAllEventRegistrations,
  getEventRegistrationById,
  updateEventRegistration,
  deleteEventRegistration,
  recoverEventRegistration,
};
