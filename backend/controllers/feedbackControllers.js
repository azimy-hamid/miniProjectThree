import Feedbacks from "../models/Feedbacks.js";
import Students from "../models/Students.js";

const createFeedback = async (req, res) => {
  const { student_id_fk, feedback_message, status } = req.body;

  // Validate required input
  if (!student_id_fk || !feedback_message || !status) {
    return res.status(400).json({
      createFeedbackMessage:
        "Student ID, feedback message, and status are required.",
    });
  }

  try {
    // Check if the student exists, whether deleted or not
    const student = await Students.findOne({
      where: { student_id_pk: student_id_fk },
      paranoid: false, // Include soft-deleted records in the query
    });

    if (!student) {
      return res.status(404).json({
        createFeedbackMessage: "Student not found.",
      });
    }

    // Check if the student is deleted
    if (student.is_deleted) {
      return res.status(400).json({
        createFeedbackMessage: "Student has been deleted.",
      });
    }

    // Create a new feedback entry
    const newFeedback = await Feedbacks.create({
      student_id_fk,
      feedback_message,
      status,
    });

    return res.status(201).json({
      createFeedbackMessage: "Feedback created successfully!",
      newFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({
      createFeedbackMessage: "Server error. Please try again later.",
      createFeedbackCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get All Feedbacks Controller
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedbacks.findAll({
      where: { is_deleted: false }, // Fetch only non-deleted feedbacks
    });

    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return res.status(500).json({
      getAllFeedbacksMessage: "Server error. Please try again later.",
      getAllFeedbacksCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Get Single Feedback by ID Controller
const getFeedbackById = async (req, res) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await Feedbacks.findOne({
      where: { feedback_id_pk: feedbackId, is_deleted: false },
    });

    if (!feedback) {
      return res.status(404).json({
        getFeedbackMessage: "Feedback not found!",
      });
    }

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({
      getFeedbackMessage: "Server error. Please try again later.",
      getFeedbackCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Update Feedback Controller
const updateFeedbackStudent = async (req, res) => {
  const { feedbackId } = req.params;
  const { feedback_message } = req.body;

  try {
    // Find the feedback by ID
    const feedback = await Feedbacks.findOne({
      where: { feedback_id_pk: feedbackId, is_deleted: false },
    });

    if (!feedback) {
      return res.status(404).json({
        updateFeedbackMessage: "Feedback not found or might be deleted!",
      });
    }

    // Update the feedback
    feedback.feedback_message = feedback_message || feedback.feedback_message;

    await feedback.save();

    return res.status(200).json({
      updateFeedbackMessage: "Feedback updated successfully!",
      feedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return res.status(500).json({
      updateFeedbackMessage: "Server error. Please try again later.",
      updateFeedbackCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Soft Delete Feedback Controller
const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.params;

  try {
    // Find the feedback by ID
    const feedback = await Feedbacks.findOne({
      where: { feedback_id_pk: feedbackId, is_deleted: false },
    });

    if (!feedback) {
      return res.status(404).json({
        deleteFeedbackMessage:
          "Feedback not found or might be already deleted!",
      });
    }

    // Soft delete by setting `is_deleted` to true
    feedback.is_deleted = true;
    await feedback.save();

    return res.status(200).json({
      deleteFeedbackMessage: "Feedback deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({
      deleteFeedbackMessage: "Server error. Please try again later.",
      deleteFeedbackCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

const recoverFeedback = async (req, res) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await Feedbacks.findOne({
      where: { feedback_id_pk: feedbackId, is_deleted: true },
    });

    if (!feedback) {
      return res.status(404).json({
        recoverFeedbackMessage: "Feedback not found or is not deleted!",
      });
    }

    await feedback.update({ is_deleted: false });

    return res.status(200).json({
      recoverFeedbackMessage: "Feedback recovered successfully!",
    });
  } catch (error) {
    console.error("Error recovering feedback:", error);
    return res.status(500).json({
      recoverFeedbackMessage: "Server error. Please try again later.",
      recoverFeedbackCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

// Resolve Feedback Controller (For Teachers and Admins only)
const resolveFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  const { resolution_message } = req.body;

  try {
    // Find the feedback that needs to be resolved
    const feedback = await Feedbacks.findOne({
      where: { feedback_id_pk: feedbackId, is_deleted: false },
    });

    if (!feedback) {
      return res.status(404).json({
        resolveFeedbackMessage: "Feedback not found or already deleted!",
      });
    }

    // Check if the feedback is already resolved or closed
    if (feedback.status === "resolved" || feedback.status === "closed") {
      return res.status(400).json({
        resolveFeedbackMessage:
          "This feedback has already been resolved or closed.",
      });
    }

    // Update the feedback with resolution details
    await feedback.update({
      status: "resolved",
      resolution_message: resolution_message || feedback.resolution_message,
      resolution_date: new Date(), // Set the current date as the resolution date
    });

    return res.status(200).json({
      resolveFeedbackMessage: "Feedback resolved successfully!",
      feedback,
    });
  } catch (error) {
    console.error("Error resolving feedback:", error);
    return res.status(500).json({
      resolveFeedbackMessage: "Server error. Please try again later.",
      resolveFeedbackCatchBlkErr:
        error.message || error.toString() || "Unknown error",
    });
  }
};

export {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackStudent,
  deleteFeedback,
  recoverFeedback,
  resolveFeedback,
};
