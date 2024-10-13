import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";
import Semesters from "./Semesters.js";
import Subjects from "./Subjects.js";

const Semester_Subject = sequelize.define(
  "Semester_Subject",
  {
    semester_subject_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    semester_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Semesters,
        key: "semester_id_pk",
      },
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Subjects,
        key: "subject_id_pk",
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "semester_subject",
    timestamps: true,
  }
);

export default Semester_Subject;
