import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Events from "./Events.js";
import Students from "./Students.js";

const Event_Registration = sequelize.define(
  "Event_Registration",
  {
    registration_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Students,
        key: "student_id_pk",
      },
    },
    event_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Events,
        key: "event_id_pk",
      },
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "event_registration", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Event_Registration;
