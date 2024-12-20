import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";

const Feedbacks = sequelize.define(
  "Feedbacks",
  {
    feedback_id_pk: {
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
    feedback_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "in progress", "resolved", "closed"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["open", "in progress", "resolved", "closed"]],
          msg: "Status must be one of the following: open, in progress, resolved, closed.",
        },
      },
    },
    resolution_message: {
      type: DataTypes.TEXT,
    },
    submitted_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resolution_date: {
      type: DataTypes.DATE,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Soft delete flag
    },
  },
  {
    tableName: "feedbacks", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Feedbacks;
