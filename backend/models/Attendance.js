import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    student_id_fk: {
      type: DataTypes.UUID, // Use UUID for Student foreign key
      allowNull: false,
      references: {
        model: "students", // Reference to Student model
        key: "student_id_pk", // Primary key in Student model
      },
    },
    class_id_fk: {
      type: DataTypes.UUID, // Use UUID for Classroom foreign key
      allowNull: false,
      references: {
        model: "classrooms", // Reference to Classroom model
        key: "classroom_id_pk", // Primary key in Classroom model
      },
    },
    attendance_date: {
      type: DataTypes.DATEONLY, // Date only for attendance date
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10), // Status can be Present, Absent, Late
      allowNull: false,
      validate: {
        isIn: [["Present", "Absent", "Late"]], // Validate the status
      },
    },
  },
  {
    tableName: "attendance", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Attendance.associate = (models) => {
  Attendance.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in Attendance model
    targetKey: "student_id_pk", // PK in Student model
  });

  Attendance.belongsTo(models.Classroom, {
    foreignKey: "class_id_fk", // FK in Attendance model
    targetKey: "classroom_id_pk", // PK in Classroom model
  });
};

export default Attendance;
