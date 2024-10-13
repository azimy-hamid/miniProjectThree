import Notifications from "../models/Notifications.js"; // Adjust path as necessary
import Users from "../models/Users.js"; // Adjust path as necessary

// Create a new notification
const createNotification = async (req, res) => {
  const { recipient_type, notification_message, notification_type } = req.body;

  // Validate required input
  if (!recipient_type || !notification_message || !notification_type) {
    return res.status(400).json({
      createNotificationMessage:
        "Recipient type, notification message, and notification type are required.",
    });
  }

  try {
    const newNotification = await Notifications.create({
      recipient_type,
      notification_message,
      notification_type,
      send_date: new Date(),
    });

    return res.status(201).json({
      createNotificationMessage: "Notification created successfully!",
      newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({
      createNotificationMessage: "Server error. Please try again later.",
      createNotificationCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notifications.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Users,
          as: "recipient",
          attributes: ["user_id_pk", "username"], // Adjust as necessary
        },
      ],
    });

    return res.status(200).json({
      getAllNotificationsMessage: "Notifications retrieved successfully!",
      notifications,
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    return res.status(500).json({
      getAllNotificationsMessage: "Server error. Please try again later.",
      getAllNotificationsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notifications.findOne({
      where: { notification_id_pk: notificationId, is_deleted: false },
      include: [
        {
          model: Users,
          as: "recipient",
          attributes: ["user_id_pk", "username"], // Adjust as necessary
        },
      ],
    });

    if (!notification) {
      return res.status(404).json({
        getNotificationMessage: "Notification not found or deleted.",
      });
    }

    return res.status(200).json({
      getNotificationMessage: "Notification retrieved successfully!",
      notification,
    });
  } catch (error) {
    console.error("Error retrieving notification:", error);
    return res.status(500).json({
      getNotificationMessage: "Server error. Please try again later.",
      getNotificationCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a notification
const updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { notification_message, notification_status } = req.body;

  try {
    const notification = await Notifications.findOne({
      where: { notification_id_pk: notificationId, is_deleted: false },
    });

    if (!notification) {
      return res.status(404).json({
        updateNotificationMessage: "Notification not found or deleted.",
      });
    }

    // Update fields
    if (notification_message)
      notification.notification_message = notification_message;
    if (notification_status)
      notification.notification_status = notification_status;

    await notification.save();

    return res.status(200).json({
      updateNotificationMessage: "Notification updated successfully!",
      notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({
      updateNotificationMessage: "Server error. Please try again later.",
      updateNotificationCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notifications.findOne({
      where: { notification_id_pk: notificationId, is_deleted: false },
    });

    if (!notification) {
      return res.status(404).json({
        deleteNotificationMessage: "Notification not found or deleted.",
      });
    }

    // Mark as deleted
    notification.is_deleted = true;
    await notification.save();

    return res.status(200).json({
      deleteNotificationMessage: "Notification deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      deleteNotificationMessage: "Server error. Please try again later.",
      deleteNotificationCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted notification
const recoverNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notifications.findOne({
      where: { notification_id_pk: notificationId, is_deleted: true }, // Find only deleted notifications
    });

    if (!notification) {
      return res.status(404).json({
        recoverNotificationMessage: "Notification not found or not deleted.",
      });
    }

    // Restore the notification
    notification.is_deleted = false;
    await notification.save();

    return res.status(200).json({
      recoverNotificationMessage: "Notification recovered successfully!",
      notification,
    });
  } catch (error) {
    console.error("Error recovering notification:", error);
    return res.status(500).json({
      recoverNotificationMessage: "Server error. Please try again later.",
      recoverNotificationCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  recoverNotification,
};
