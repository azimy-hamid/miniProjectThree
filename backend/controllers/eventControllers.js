import Events from "../models/Events.js";

// Create a new event
const createEvent = async (req, res) => {
  const {
    event_name,
    event_description,
    event_start_date,
    event_end_date,
    event_capacity,
    event_location,
  } = req.body;

  // Validate required input
  if (
    !event_name ||
    !event_start_date ||
    !event_end_date ||
    !event_capacity ||
    !event_location
  ) {
    return res.status(400).json({
      createEventMessage:
        "Event name, start date, end date, capacity, and location are required.",
    });
  }

  try {
    const newEvent = await Events.create({
      event_name,
      event_description,
      event_start_date,
      event_end_date,
      event_capacity,
      event_location,
    });

    return res.status(201).json({
      createEventMessage: "Event created successfully!",
      newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      createEventMessage: "Server error. Please try again later.",
      createEventCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Events.findAll({
      where: { is_deleted: false }, // Fetch only non-deleted events
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      getAllEventsMessage: "Server error. Please try again later.",
      getAllEventsCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Events.findOne({
      where: { event_id_pk: eventId, is_deleted: false },
    });

    if (!event) {
      return res.status(404).json({
        getEventMessage: "Event not found!",
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({
      getEventMessage: "Server error. Please try again later.",
      getEventCatchBlkErr: error.message || error.toString() || "Unknown error",
    });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const {
    event_name,
    event_description,
    event_start_date,
    event_end_date,
    event_capacity,
    event_location,
  } = req.body;

  try {
    // Find the event by ID
    const event = await Events.findOne({
      where: { event_id_pk: eventId, is_deleted: false },
    });

    if (!event) {
      return res.status(404).json({
        updateEventMessage: "Event not found!",
      });
    }

    // Update event fields
    event.event_name = event_name || event.event_name;
    event.event_description = event_description || event.event_description;
    event.event_start_date = event_start_date || event.event_start_date;
    event.event_end_date = event_end_date || event.event_end_date;
    event.event_capacity = event_capacity || event.event_capacity;
    event.event_location = event_location || event.event_location;

    await event.save();

    return res.status(200).json({
      updateEventMessage: "Event updated successfully!",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      updateEventMessage: "Server error. Please try again later.",
      updateEventCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft delete an event
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event by ID
    const event = await Events.findOne({
      where: { event_id_pk: eventId, is_deleted: false },
    });

    if (!event) {
      return res.status(404).json({
        deleteEventMessage: "Event not found or might be already deleted!",
      });
    }

    // Soft delete by setting `is_deleted` to true
    event.is_deleted = true;
    await event.save();

    return res.status(200).json({
      deleteEventMessage: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      deleteEventMessage: "Server error. Please try again later.",
      deleteEventCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Recover a soft-deleted event
const recoverEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Events.findOne({
      where: { event_id_pk: eventId, is_deleted: true },
    });

    if (!event) {
      return res.status(404).json({
        recoverEventMessage: "Event not found or is not deleted!",
      });
    }

    await event.update({ is_deleted: false });

    return res.status(200).json({
      recoverEventMessage: "Event recovered successfully!",
    });
  } catch (error) {
    console.error("Error recovering event:", error);
    return res.status(500).json({
      recoverEventMessage: "Server error. Please try again later.",
      recoverEventCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  recoverEvent,
};
