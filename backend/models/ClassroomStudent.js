import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Classroom_Student = sequelize.define(
  "Classroom_Student",
  {
    classroom_student_id_pk: {
      type: DataTypes.UUID, // Using UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID
    },
    class_id_fk: {
      type: DataTypes.UUID, // UUID for Classroom foreign key
      allowNull: false,
      references: {
        model: "classrooms", // Reference to Classroom model
        key: "classroom_id_pk", // PK in Classroom model
      },
    },
    student_id_fk: {
      type: DataTypes.UUID, // UUID for Student foreign key
      allowNull: false,
      references: {
        model: "students", // Reference to Student model
        key: "student_id_pk", // PK in Student model
      },
    },
    subject_id_fk: {
      type: DataTypes.UUID, // UUID for Subject foreign key
      allowNull: false,
      references: {
        model: "subjects", // Reference to Subject model
        key: "subject_id_pk", // PK in Subject model
      },
    },
  },
  {
    tableName: "classroom_student", // Name of the table in the database
    timestamps: true, // Use Sequelize's default timestamps (createdAt, updatedAt)
  }
);

// Associations
Classroom_Student.associate = (models) => {
  Classroom_Student.belongsTo(models.Classroom, {
    foreignKey: "class_id_fk", // FK in Classroom_Student model
    targetKey: "classroom_id_pk", // PK in Classroom model
  });

  Classroom_Student.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in Classroom_Student model
    targetKey: "student_id_pk", // PK in Student model
  });

  Classroom_Student.belongsTo(models.Subject, {
    foreignKey: "subject_id_fk", // FK in Classroom_Student model
    targetKey: "subject_id_pk", // PK in Subject model
  });
};

export default Classroom_Student;
