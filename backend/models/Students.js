import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Semesters from "./Semesters.js"; // Import the Semesters model
import Grades from "./Grades.js"; // Import the Grades model

const Students = sequelize.define(
  "Students",
  {
    student_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    student_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "prefer not to say"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["male", "female", "prefer not to say"]],
          msg: "Gender must be one of the following: male, female, or prefer not to say.",
        },
      },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    join_date: {
      type: DataTypes.DATE,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    semester_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Semesters,
        key: "semester_id_pk",
      },
      allowNull: true,
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    grade_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Grades,
        key: "grade_id_pk",
      },
      allowNull: true,
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "students",
    timestamps: true,
    hooks: {
      beforeValidate: async (student) => {
        const latestStudent = await Students.findOne({
          order: [
            [
              sequelize.literal("CAST(SUBSTRING(student_code, 5) AS UNSIGNED)"),
              "DESC",
            ],
          ],
        });

        const lastNumber = latestStudent
          ? parseInt(latestStudent.student_code.split("-")[1], 10)
          : 0;
        student.student_code = `STU-${lastNumber + 1}`;
      },
    },
  }
);

export default Students;
