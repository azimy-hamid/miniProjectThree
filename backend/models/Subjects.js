import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Classrooms from "./Classrooms.js";

const Subjects = sequelize.define(
  "Subjects",
  {
    subject_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    classroom_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Classrooms,
        key: "classroom_id_pk",
      },
    },
    section: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "subjects",
    timestamps: true,
    hooks: {
      beforeValidate: async (subject) => {
        // Find the latest subject_code in the database
        const latestSubject = await Subjects.findOne({
          order: [
            [
              sequelize.literal("CAST(SUBSTRING(subject_code, 5) AS UNSIGNED)"),
              "DESC",
            ],
          ],
        });

        // Extract the numeric part and increment it
        const lastNumber = latestSubject
          ? parseInt(latestSubject.subject_code.split("-")[1], 10)
          : 0;
        subject.subject_code = `SUB-${lastNumber + 1}`;
      },
    },
  }
);

export default Subjects;
