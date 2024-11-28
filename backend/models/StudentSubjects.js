import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";
import Subjects from "./Subjects.js";

const Student_Subjects = sequelize.define(
  "Student_Subjects",
  {
    student_subjects_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Students,
        key: "student_id_pk",
      },
      onDelete: "CASCADE",
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subjects,
        key: "subject_id_pk",
      },
      onDelete: "CASCADE",
    },
    is_done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "student_subjects",
    timestamps: true,
  }
);

// Add a hook to enforce no re-enrollment logic
Student_Subjects.addHook("beforeCreate", async (studentSubject, options) => {
  const existingEnrollment = await Student_Subjects.findOne({
    where: {
      student_id_fk: studentSubject.student_id_fk,
      subject_id_fk: studentSubject.subject_id_fk,
      is_done: false,
      is_deleted: false, // Ensure not deleted records are considered
    },
  });

  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this subject.");
  }
});

export default Student_Subjects;
