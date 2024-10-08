import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";
import Students from "./Students.js";
import Teachers from "./Teachers.js";
import Classrooms from "./Classrooms.js";

const Subjects = sequelize.define(
  "Subjects",
  {
    subject_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    classroom_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Classrooms,
        key: "classroom_id_pk",
      },
    },
    section: {
      type: DataTypes.STRING,
    },
    semester: {
      type: DataTypes.ENUM("1", "2", "3", "4"), // Specify valid semester values as ENUM
      allowNull: false,
      validate: {
        isIn: {
          args: [["1", "2", "3", "4"]], // Optional, since ENUM already restricts values
          msg: "Subject Semester must be one of the following values: '1', '2', '3', or '4'.",
        },
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "subjects", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Subjects;
