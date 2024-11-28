import { DataTypes, Op } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js"; // Import the Students model
import dayjs from "dayjs";
import Marks from "./Marks.js";
import Student_Subjects from "./StudentSubjects.js";
import Subjects from "./Subjects.js";
import Grades from "./Grades.js";

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
      is_done: false, // Include only non-failed marks
      createdAt: {
        [Op.gte]: dayjs().year(calendarYear).startOf("year").toDate(), // Start of the calendar year
        [Op.lt]: dayjs().year(calendarYear).endOf("year").toDate(), // End of the calendar year
      },
    },
  });

  // Update total_marks field
  academicHistory.total_marks = totalMarks || 0;
});

// Academic_History.addHook("beforeUpdate", async (academicHistory) => {
//   // Check if the `academic_history_status` field is being updated
//   if (academicHistory.changed("academic_history_status")) {
//     const currentMonth = dayjs().month(); // Get the current month (0 for Jan, 11 for Dec)

//     // Restrict updates to `academic_history_status` if it's not December
//     if (currentMonth !== 11) {
//       throw new Error(
//         "The academic_history_status field can only be updated during the month of December."
//       );
//     }
//   }
// });

Academic_History.addHook("afterUpdate", async (academicHistory) => {
  if (academicHistory.changed("academic_history_status")) {
    const calendarYear = academicHistory.calendar_year;
    const studentId = academicHistory.student_id_fk;

    // Update student_subjects.is_done to true for the current academic year
    await Student_Subjects.update(
      { is_done: true },
      {
        where: {
          student_id_fk: studentId,
          is_deleted: false,
          createdAt: {
            [Op.gte]: dayjs().year(calendarYear).startOf("year").toDate(),
            [Op.lt]: dayjs().year(calendarYear).endOf("year").toDate(),
          },
        },
      }
    );

    // Update marks.is_done to true for the current academic year and student
    await Marks.update(
      { is_done: true },
      {
        where: {
          student_id_fk: studentId,
          is_deleted: false,
          createdAt: {
            [Op.gte]: dayjs().year(calendarYear).startOf("year").toDate(),
            [Op.lt]: dayjs().year(calendarYear).endOf("year").toDate(),
          },
        },
      }
    );

    if (academicHistory.academic_history_status === "failed") {
      // Handle "failed" status
      const nextCalendarYear = calendarYear + 1;

      // Create a new academic history record for the same academic year in the next calendar year
      await Academic_History.create({
        student_id_fk: studentId,
        calendar_year: nextCalendarYear,
        academic_year: academicHistory.academic_year, // Same academic year
        total_marks: 0, // Reset marks to zero for the new year
        academic_history_status: null, // No status initially
      });

      console.log(
        `New academic history created for student ${studentId} for academic year ${academicHistory.academic_year} and calendar year ${nextCalendarYear}.`
      );

      // Re-enroll the student in subjects for the current grade
      const currentGradeId = academicHistory.grade_id_fk;
      const subjects = await Subjects.findAll({
        where: {
          grade_id_fk: currentGradeId,
          is_deleted: false,
        },
      });

      const subjectEnrollments = subjects.map((subject) => ({
        student_id_fk: studentId,
        subject_id_fk: subject.subject_id_pk,
        is_done: false, // Reset for new enrollment
      }));

      await Student_Subjects.bulkCreate(subjectEnrollments);
      console.log(
        `Student ${studentId} re-enrolled in subjects for current grade.`
      );
    } else if (academicHistory.academic_history_status === "passed") {
      // Handle "passed" status
      const nextAcademicYear = academicHistory.academic_year + 1;
      const nextCalendarYear = calendarYear + 1;

      // Create a new academic history record for the next academic year and calendar year
      await Academic_History.create({
        student_id_fk: studentId,
        calendar_year: nextCalendarYear,
        academic_year: nextAcademicYear,
        total_marks: 0, // New academic year starts with zero marks
        academic_history_status: null, // No status initially
      });

      console.log(
        `New academic history created for student ${studentId} for academic year ${nextAcademicYear} and calendar year ${nextCalendarYear}.`
      );

      // Enroll the student in subjects for the next grade
      const nextGrade = await Grades.findOne({
        where: { grade_level: nextAcademicYear },
      });

      if (nextGrade) {
        const nextGradeSubjects = await Subjects.findAll({
          where: {
            grade_id_fk: nextGrade.grade_id_pk,
            is_deleted: false,
          },
        });

        const nextGradeEnrollments = nextGradeSubjects.map((subject) => ({
          student_id_fk: studentId,
          subject_id_fk: subject.subject_id_pk,
          is_done: false, // New enrollment
        }));

        await Student_Subjects.bulkCreate(nextGradeEnrollments);

        // Update the grade in the Students table
        await Students.update(
          { grade_id_fk: nextGrade.grade_id_pk },
          {
            where: { student_id_pk: studentId },
          }
        );

        console.log(
          `Student ${studentId} enrolled in next grade and updated to grade level ${nextGrade.grade_level}.`
        );
      } else {
        console.error(
          `Grade not found for level ${nextAcademicYear}. Student's enrollment in subjects not updated.`
        );
      }
    }
  }
});

export default Academic_History;
