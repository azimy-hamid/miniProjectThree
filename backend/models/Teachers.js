import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Teachers = sequelize.define(
  "Teachers",
  {
    teacher_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    teacher_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacher_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Prefer not to say"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Male", "Female", "Prefer not to say"]],
          msg: "Gender must be one of the following: Male, Female, or Prefer not to say.",
        },
      },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    join_date: {
      type: DataTypes.DATE,
    },
    working_days: {
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
          msg: "Working days must be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Weekdays, Weekends, or Full Week.",
        },
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "teachers", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Teachers;
