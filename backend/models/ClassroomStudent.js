import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students";
import Classrooms from "./Classrooms";

const Classroom_Student = sequelize.define(
  "Classroom_Student",
  {
    classroom_student_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    classroom_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Classrooms,
        key: "classroom_id_pk",
      },
    },
    student_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Students,
        key: "student_id_pk",
      },
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "classroom_students", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Classrooms.belongsToMany(Students, {
  through: Classroom_Student,
  foreignKey: "classroom_id_fk",
  as: "students",
});
Students.belongsToMany(Classrooms, {
  through: Classroom_Student,
  foreignKey: "student_id_fk",
  as: "classrooms",
});

export default Classroom_Student;
