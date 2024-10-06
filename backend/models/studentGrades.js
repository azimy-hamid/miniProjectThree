import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";

const StudentGrades = sequelize.define(
  "StudentGrades",
  {
    student_grades_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "students", // Name of the Students table
        key: "student_id_pk", // Foreign key that references Students
      },
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    academic_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM("1", "2", "3", "4"), // Specify valid semester values as ENUM
      allowNull: false,
      validate: {
        isIn: {
          args: [["1", "2", "3", "4"]], // Optional, since ENUM already restricts values
          msg: "Student Grade Semester must be one of the following values: '1', '2', '3', or '4'.",
        },
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "student_grades", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

Students.hasMany(StudentGrades, {
  foreignKey: "student_id_fk",
  sourceKey: "student_id_pk", // Source key in Students
  as: "grades", // Alias for accessing related grades
});

StudentGrades.belongsTo(Students, {
  foreignKey: "student_id_fk",
  targetKey: "student_id_pk", // Target key in Students
  as: "student", // Alias for accessing the related student
});

export default StudentGrades;
