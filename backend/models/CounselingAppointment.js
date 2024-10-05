import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const CounselingAppointment = sequelize.define(
  "CounselingAppointment",
  {
    appointment_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    student_id_fk: {
      type: DataTypes.UUID, // Use UUID for the foreign key referencing Student
      allowNull: false,
      references: {
        model: "students", // Reference to the Student model
        key: "student_id_pk", // PK in Student model
      },
    },
    counselor_name: {
      type: DataTypes.STRING(100), // Name of the counselor
      allowNull: false,
    },
    appointment_date: {
      type: DataTypes.DATE, // Date and time of the appointment
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING(255), // Purpose of the appointment
      allowNull: true, // Can be null if no purpose is specified
    },
    status: {
      type: DataTypes.STRING(20), // Status of the appointment
      allowNull: false,
      defaultValue: "Scheduled", // Default status
      // You can also add a validation for allowed values if needed
    },
  },
  {
    tableName: "counseling_appointments", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
CounselingAppointment.associate = (models) => {
  CounselingAppointment.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in CounselingAppointment model
    targetKey: "student_id_pk", // PK in Student model
  });
};

export default CounselingAppointment;
