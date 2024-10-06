import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Events from "./Events";
import Students from "./Students";

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

// Associations
Events.hasMany(Event_Registration, {
  foreignKey: "event_id_fk",
  as: "registrations",
});
Event_Registration.belongsTo(Events, {
  foreignKey: "event_id_fk",
  as: "event",
});

Students.hasMany(Event_Registration, {
  foreignKey: "student_id_fk",
  as: "event_registrations",
});
Event_Registration.belongsTo(Students, {
  foreignKey: "student_id_fk",
  as: "student",
});

export default Event_Registration;
