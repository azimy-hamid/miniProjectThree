import { DataTypes, DATE } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Users from "./Users";

const Notifications = sequelize.define(
  "Notifications",
  {
    notification_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    recipient_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notification_message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    send_date: {
      type: DATE,
    },
    notification_status: {
      type: DataTypes.ENUM("unread", "read", "archived"), // Using ENUM for notification status
      defaultValue: "unread",
      allowNull: false,
      validate: {
        isIn: {
          args: [["sent", "delivered", "read"]],
          msg: "Notification status must be one of the following: 'sent', 'delivered', or 'read'.",
        },
      },
    },
    notification_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Notifications;
