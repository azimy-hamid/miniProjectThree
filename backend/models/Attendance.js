import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";
import Subjects from "./Subjects.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id_pk: {
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
    subject_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Subjects,
        key: "subject_id_pk",
      },
    },
    attendance_date: {
      type: DataTypes.DATE,
    },
    attendance_status: {
      type: DataTypes.ENUM(
        "Present",
        "Absent",
        "Late",
        "Excused" // You can add more statuses as needed
      ),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Present", "Absent", "Late", "Excused"]],
          msg: "Attendance status must be one of the following: 'Present', 'Absent', 'Late', or 'Excused'.",
        },
      },
    },
    attendance_type: {
      type: DataTypes.ENUM("In-Person", "Online", "Hybrid"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["In-Person", "Online", "Hybrid"]],
          msg: "Attendance type must be one of the following: 'In-Person', 'Online', or 'Hybrid'.",
        },
      },
    },
    reason: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "attendance", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Attendance;
