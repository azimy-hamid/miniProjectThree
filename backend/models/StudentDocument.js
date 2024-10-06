import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";

const StudentDocuments = sequelize.define(
  "StudentDocuments",
  {
    document_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Students,
        key: "student_id_pk",
      },
    },
    document_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uploaded_date: {
      type: DataTypes.DATE,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "student_documents", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Students.hasMany(StudentDocuments, {
  foreignKey: "student_id_fk",
  as: "documents",
});

StudentDocuments.belongsTo(Students, {
  foreignKey: "student_id_fk",
  as: "student",
});

export default StudentDocuments;
