import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Grades from "./Grades.js";

const Teachers = sequelize.define(
  "Teachers",
  {
    teacher_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    teacher_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidDays(value) {
          const validDays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ];
          const daysArray = value.split(",").map((day) => day.trim());

          daysArray.forEach((day) => {
            if (!validDays.includes(day)) {
              throw new Error(
                `Invalid day: ${day}. Valid options are: ${validDays.join(
                  ", "
                )}.`
              );
            }
          });
        },
      },
    },

    grade_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Grades, // Name of the referenced model
        key: "grade_id_pk", // Primary key in the Semesters model
      },
      allowNull: true, // Allow null if the subject might not have a semester assigned
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      onDelete: "CASCADE",
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "teachers",
    timestamps: true,
    hooks: {
      beforeValidate: async (teacher) => {
        // Find the latest teacher_code in the database
        const latestTeacher = await Teachers.findOne({
          order: [
            [
              sequelize.literal("CAST(SUBSTRING(teacher_code, 5) AS UNSIGNED)"),
              "DESC",
            ],
          ],
        });

        // Extract the numeric part and increment it
        const lastNumber = latestTeacher
          ? parseInt(latestTeacher.teacher_code.split("-")[1], 10)
          : 0;
        teacher.teacher_code = `TEA-${lastNumber + 1}`;
      },
    },
  }
);

export default Teachers;
