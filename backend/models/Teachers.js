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
      type: DataTypes.ENUM("male", "female", "prefer not to say"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["male", "female", "prefer not to say"]],
          msg: "Gender must be one of the following: male, female, or prefer not to say.",
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
          msg: "Working days must be one of the following: monday, tuesday, wednesday, thursday, friday, saturday, sunday, weekdays, weekends, or full week.",
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
