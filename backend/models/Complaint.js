import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Complaint = sequelize.define(
  "Complaint",
  {
    complaint_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    student_id_fk: {
      type: DataTypes.UUID, // FK referencing Student
      allowNull: false,
      references: {
        model: "students", // Reference to Students model
        key: "student_id_pk", // PK in Students model
      },
    },
    grievance_message: {
      type: DataTypes.TEXT, // Grievance message text
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20), // Status of the complaint
      allowNull: false,
      defaultValue: "Pending", // Default status
    },
    resolution_message: {
      type: DataTypes.TEXT, // Resolution message (if any)
      allowNull: true, // Can be null if not resolved
    },
    submitted_date: {
      type: DataTypes.DATE, // Date when the complaint was submitted
      allowNull: false,
    },
    resolution_date: {
      type: DataTypes.DATE, // Date when the complaint was resolved
      allowNull: true, // Can be null if not resolved
    },
  },
  {
    tableName: "complaints", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Complaint.associate = (models) => {
  Complaint.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in Complaints model
    targetKey: "student_id_pk", // PK in Students model
  });
};

export default Complaint;
