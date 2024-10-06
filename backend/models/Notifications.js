import { DataTypes } from "sequelize";
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
    user_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "user_id_pk",
      },
    },
    notification_message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notification_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notification_status: {
      type: DataTypes.STRING,
      defaultValue: "unread",
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

// Associations
Users.hasMany(Notifications, { foreignKey: "user_id_fk", as: "notifications" });
Notifications.belongsTo(Users, { foreignKey: "user_id_fk", as: "user" });

export default Notifications;
