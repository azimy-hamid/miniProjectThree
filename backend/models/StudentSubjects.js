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
        model: "Students", // References the Students table
        key: "student_id_pk",
      },
      onDelete: "CASCADE", // Deletes associated records if a student is deleted
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Subjects", // References the Subjects table
        key: "subject_id_pk",
      },
      onDelete: "CASCADE", // Deletes associated records if a subject is deleted
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "student_subjects", // Name of the table in the database
    timestamps: true, // Manages createdAt and updatedAt fields automatically
  }
);

export default Student_Subjects;
