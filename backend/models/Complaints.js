import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";

const Complaints = sequelize.define(
  "Complaints",
  {
    complaint_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "students", // Name of the Students table
        key: "student_id_pk", // Key in the Students table
      },
    },
    complaint_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Open", "In Progress", "Resolved", "Closed"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Open", "In Progress", "Resolved", "Closed"]],
          msg: "Status must be one of the following: 'Open', 'In Progress', 'Resolved', or 'Closed'.",
        },
      },
    },
    resolution_message: {
      type: DataTypes.TEXT,
    },
    submitted_date: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resolution_date: {
      type: DataTypes.TIMESTAMP,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Soft delete flag
    },
  },
  {
    tableName: "complaints", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

Students.associate = () => {
  Students.hasMany(StudentDocuments, {
    foreignKey: "student_id_fk",
    as: "documents",
  });
};

Complaints.associate = () => {
  Complaints.belongsTo(Students, {
    foreignKey: "student_id_fk", // Foreign key in Complaints
    targetKey: "student_id_pk", // Target key in Students
    as: "student", // Alias for accessing the related student
  });
};

export default Complaints;
