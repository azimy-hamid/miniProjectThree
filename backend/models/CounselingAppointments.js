import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";
import Teachers from "./Teachers.js";

const Counseling_Appointments = sequelize.define(
  "Counseling_Appointments",
  {
    appointment_id_pk: {
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
    teacher_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Teachers,
        key: "teacher_id_pk",
      },
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    appointment_purpose: {
      type: DataTypes.STRING,
    },
    appointment_status: {
      type: DataTypes.ENUM("scheduled", "completed", "canceled", "no show"),
      allowNull: false,
      defaultValue: "Scheduled", // Default value for the appointment status
      validate: {
        isIn: {
          args: [["scheduled", "completed", "canceled", "no show"]],
          msg: "Appointment status must be one of the following: scheduled, completed, canceled, no show.",
        },
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "counseling_appointments", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Counseling_Appointments;
