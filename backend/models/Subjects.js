import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";
import Students from "./Students";
import Teachers from "./Teachers";
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

// Associations
Students.hasMany(Subjects, { foreignKey: "student_id_fk", as: "subjects" });
Subjects.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

Teachers.hasMany(Subjects, { foreignKey: "teacher_id_fk", as: "subjects" });
Subjects.belongsTo(Teachers, { foreignKey: "teacher_id_fk", as: "teacher" });

Classrooms.hasMany(Subjects, { foreignKey: "classroom_id_fk", as: "subjects" });
Subjects.belongsTo(Classrooms, {
  foreignKey: "classroom_id_fk",
  as: "classroom",
});

export default Subjects;
