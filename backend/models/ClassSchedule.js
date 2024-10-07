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
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Weekdays", // Monday to Friday
        "Weekends", // Saturday, Sunday
        "Full Week" // All days
      ),
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
              "Weekdays",
              "Weekends",
              "Full Week",
            ],
          ],
          msg: "Must be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Weekdays, Weekends, or Full Week.",
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
