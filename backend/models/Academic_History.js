import { DataTypes, Op } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js"; // Import the Students model
import dayjs from "dayjs";
import Marks from "./Marks.js";

const Academic_History = sequelize.define(
  "Academic_History",
  {
    academic_history_id_pk: {
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
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    calendar_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1900,
        max: new Date().getFullYear(), // Ensures the year is not in the future
      },
    },
    academic_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_marks: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field
      validate: {
        isInt: true,
        min: 0,
      },
    },
    academic_history_status: {
      type: DataTypes.ENUM("failed", "passed"), // Restrict to "failed" or "passed"
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "academic_history",
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

Academic_History.addHook("beforeSave", async (academicHistory) => {
  // Get the calendar year from the academicHistory object
  const calendarYear = academicHistory.calendar_year;

  // Calculate total marks for the student associated with this record
  const totalMarks = await Marks.sum("subject_mark", {
    where: {
      student_id_fk: academicHistory.student_id_fk,
      is_deleted: false,
      is_failed: false, // Include only non-failed marks
      createdAt: {
        [Op.gte]: dayjs().year(calendarYear).startOf("year").toDate(), // Start of the calendar year
        [Op.lt]: dayjs().year(calendarYear).endOf("year").toDate(), // End of the calendar year
      },
    },
  });

  // Update total_marks field
  academicHistory.total_marks = totalMarks || 0;
});

Academic_History.addHook("afterUpdate", async (academicHistory) => {
  // Check if the academic_history_status was updated
  if (academicHistory.changed("academic_history_status")) {
    const calendarYear = academicHistory.calendar_year;

    if (academicHistory.academic_history_status === "failed") {
      // Set is_failed to true for all marks of this student in the given year
      await Marks.update(
        { is_failed: true },
        {
          where: {
            student_id_fk: academicHistory.student_id_fk,
            is_deleted: false,
            createdAt: {
              [Op.gte]: dayjs().year(calendarYear).startOf("year").toDate(),
              [Op.lt]: dayjs().year(calendarYear).endOf("year").toDate(),
            },
          },
        }
      );
    } else if (academicHistory.academic_history_status === "passed") {
      // Optionally, reset is_failed to false for all marks if the status is "passed"
      await Marks.update(
        { is_failed: false },
        {
          where: {
            student_id_fk: academicHistory.student_id_fk,
            is_deleted: false,
            createdAt: {
              [Op.gte]: dayjs().year(calendarYear).startOf("year").toDate(),
              [Op.lt]: dayjs().year(calendarYear).endOf("year").toDate(),
            },
          },
        }
      );
    }
  }
});

export default Academic_History;
