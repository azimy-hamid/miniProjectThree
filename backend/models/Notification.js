import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Notification = sequelize.define(
  "Notification",
  {
    notification_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    recipient_id_fk: {
      type: DataTypes.UUID, // Use UUID for recipient foreign key
      allowNull: false,
    },
    recipient_type: {
      type: DataTypes.STRING(10), // Can be either "student" or "teacher"
      allowNull: false,
      validate: {
        isIn: [["student", "teacher"]], // Validate recipient type
      },
    },
    notification_message: {
      type: DataTypes.TEXT, // Notification message
      allowNull: false,
    },
    send_date: {
      type: DataTypes.DATE, // Date and time the notification was sent
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10), // Status can be Sent, Delivered, or Read
      allowNull: false,
      validate: {
        isIn: [["Sent", "Delivered", "Read"]], // Validate status
      },
    },
  },
  {
    tableName: "notification", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Notification.associate = (models) => {
  // Define association to Student or Teacher model based on recipient_type
  Notification.belongsTo(models.Student, {
    foreignKey: "recipient_id_fk", // FK in Notification model
    targetKey: "student_id_pk", // PK in Student model
    constraints: false, // Disable foreign key constraints for polymorphic associations
  });

  Notification.belongsTo(models.Teacher, {
    foreignKey: "recipient_id_fk", // FK in Notification model
    targetKey: "teacher_id_pk", // PK in Teacher model
    constraints: false, // Disable foreign key constraints for polymorphic associations
  });
};

export default Notification;
