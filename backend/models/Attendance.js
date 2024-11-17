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
        "present",
        "absent",
        "late",
        "excused" // You can add more statuses as needed
      ),
      allowNull: false,
      validate: {
        isIn: {
          args: [["present", "absent", "late", "excused"]],
          msg: "Attendance status must be one of the following: 'present', 'absent', 'late', or 'excused'.",
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
