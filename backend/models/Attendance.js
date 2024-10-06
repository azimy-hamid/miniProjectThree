import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students";
import Subjects from "./Subjects";

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Subjects,
        key: "subject_id_pk",
      },
    },
    student_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Students,
        key: "student_id_pk",
      },
    },
    attendance_date: {
      type: DataTypes.DATE,
    },
    attendance_status: {
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

// Associations
Students.hasMany(Attendance, { foreignKey: "student_id_fk", as: "attendance" });
Attendance.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

Subjects.hasMany(Attendance, { foreignKey: "subject_id_fk", as: "attendance" });
Attendance.belongsTo(Subjects, { foreignKey: "subject_id_fk", as: "subject" });

export default Attendance;
