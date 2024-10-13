import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Teachers from "./Teachers.js";
import Subjects from "./Subjects.js";

const Teacher_Subjects = sequelize.define(
  "Teacher_Subjects",
  {
    teacher_subjects_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    teacher_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Teachers, // References the Teachers table
        key: "teacher_id_pk",
      },
      onDelete: "CASCADE", // Deletes associated records if a teacher is deleted
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subjects, // References the Subjects table
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
    tableName: "teacher_subjects", // Name of the table in the database
    timestamps: true, // Manages createdAt and updatedAt fields automatically
  }
);

export default Teacher_Subjects;
