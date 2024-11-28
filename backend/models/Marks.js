import { DataTypes, Op } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";
import Subjects from "./Subjects.js";
import Academic_History from "./Academic_History.js";

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
    is_passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // New column with default value false
    },
    is_done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // New column with default value false
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

// Hook to set is_passed before saving the mark
Marks.addHook("beforeSave", (mark) => {
  if (mark.subject_mark > 70) {
    mark.is_passed = true;
  }
});

Marks.addHook("afterCreate", async (mark) => {
  // After a new mark is created, update the total_marks for the corresponding AcademicHistory
  await updateTotalMarksForStudent(mark.student_id_fk, mark.createdAt);
});

Marks.addHook("afterUpdate", async (mark) => {
  // After a mark is updated, update the total_marks for the corresponding AcademicHistory
  await updateTotalMarksForStudent(mark.student_id_fk, mark.createdAt);
});

// Function to update the total marks in AcademicHistory
async function updateTotalMarksForStudent(studentId, markCreatedAt) {
  // Extract the year from the createdAt field of the mark
  const markYear = new Date(markCreatedAt).getFullYear();

  // Find the AcademicHistory for the student where the calendar_year matches the mark's year
  const academicHistory = await Academic_History.findOne({
    where: {
      student_id_fk: studentId,
      calendar_year: markYear, // Match the calendar year to the year of the mark
    },
  });

  if (academicHistory) {
    // Calculate the total marks for the student in that year
    const totalMarks = await Marks.sum("subject_mark", {
      where: {
        student_id_fk: studentId,
        is_deleted: false,
        is_done: false,
        createdAt: {
          [Op.gte]: new Date(markYear, 0, 1), // Start of the year
          [Op.lt]: new Date(markYear + 1, 0, 1), // Start of the next year
        },
      },
    });

    // Update the total_marks field in AcademicHistory
    academicHistory.total_marks = totalMarks || 0;
    await academicHistory.save();
  }
}

export default Marks;
