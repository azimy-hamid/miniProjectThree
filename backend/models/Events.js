import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Events = sequelize.define(
  "Events",
  {
    event_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_description: {
      type: DataTypes.TEXT,
    },
    event_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false, // Adjust based on whether this should be required
    },
    event_location: {
      type: DataTypes.STRING(255), // Specifies max length
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Soft delete flag
    },
  },
  {
    tableName: "events", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Events;
