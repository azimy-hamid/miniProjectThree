import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Classrooms from "./Classrooms.js";
import Semesters from "./Semesters.js"; // Import the Semesters model
import Grades from "./Grades.js";

const Subjects = sequelize.define(
  "Subjects",
  {
    subject_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    classroom_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Classrooms,
        key: "classroom_id_pk",
      },
    },
    semester_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Semesters, // Name of the referenced model
        key: "semester_id_pk", // Primary key in the Semesters model
      },
      allowNull: true, // Allow null if the subject might not have a semester assigned
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      onDelete: "CASCADE",
    },
    grade_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Grades, // Name of the referenced model
        key: "grade_id_pk", // Primary key in the Semesters model
      },
      allowNull: true, // Allow null if the subject might not have a semester assigned
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      onDelete: "CASCADE",
    },

    section: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "subjects",
    timestamps: true,
    hooks: {
      beforeValidate: async (subject) => {
        const latestSubject = await Subjects.findOne({
          order: [
            [
              sequelize.literal("CAST(SUBSTRING(subject_code, 5) AS UNSIGNED)"),
              "DESC",
            ],
          ],
        });

        const lastNumber = latestSubject
          ? parseInt(latestSubject.subject_code.split("-")[1], 10)
          : 0;
        subject.subject_code = `SUB-${lastNumber + 1}`;
      },
    },
  }
);

export default Subjects;
