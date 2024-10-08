import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Classrooms from "./Classrooms.js";
import Subjects from "./Subjects.js";

const ClassSchedule = sequelize.define(
  "ClassSchedule",
  {
    schedule_id_pk: {
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
    classroom_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Classrooms,
        key: "classroom_id_pk",
      },
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "weekdays", // Monday to Friday
        "weekends", // Saturday, Sunday
        "full Week" // All days
      ),
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
              "weekdays",
              "weekends",
              "full Week",
            ],
          ],
          msg: "Must be one of the following: monday, tuesday, wednesday, thursday, friday, saturday, sunday, weekdays, weekends, or full week.",
        },
      },
    },
    start_time: {
      type: DataTypes.TIME,
    },
    end_time: {
      type: DataTypes.TIME,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "class_schedule", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default ClassSchedule;
