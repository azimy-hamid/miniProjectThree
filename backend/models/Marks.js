import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students";
import Subjects from "./Subjects";

const Marks = sequelize.define(
  "Marks",
  {
    mark_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Subjects,
        key: "subject_id_pk",
      },
    },
    student_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Students,
        key: "student_id_pk",
      },
    },
    subject_mark: {
      type: DataTypes.DECIMAL,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "marks", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Students.hasMany(Marks, { foreignKey: "student_id_fk", as: "marks" });
Marks.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

Subjects.hasMany(Marks, { foreignKey: "subject_id_fk", as: "marks" });
Marks.belongsTo(Subjects, { foreignKey: "subject_id_fk", as: "subject" });

export default Marks;
