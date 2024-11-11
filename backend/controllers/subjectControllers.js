import Subjects from "../models/Subjects.js";
import Classrooms from "../models/Classrooms.js";
import Grades from "../models/Grades.js"; // Assuming this is the grade model
import Semesters from "../models/Semesters.js"; // Assuming this is the semester model
import ClassSchedule from "../models/ClassSchedule.js";
import Teacher_Subjects from "../models/TeacherSubjects.js";
import Teachers from "../models/Teachers.js";
import Students from "../models/Students.js";
import Student_Subjects from "../models/StudentSubjects.js";
import Marks from "../models/Marks.js";

// Create a new subject
const createSubject = async (req, res) => {
  const {
    subject_name,
    classroom_code,
    section,
    grade_code,
    semester_number,
    teacher_code,
    day_of_week, // Comma-separated string of days
    start_time,
    end_time,
  } = req.body;

  // Validate required fields
  if (
    !subject_name ||
    !classroom_code ||
    !grade_code ||
    !semester_number ||
    !teacher_code ||
    !day_of_week ||
    !start_time ||
    !end_time
  ) {
    return res.status(400).json({
      createSubjectMessage: "All fields are required.",
    });
  }

  try {
    // Validate that the classroom exists
    const classroom = await Classrooms.findOne({
      where: { classroom_code: classroom_code },
      paranoid: false, // Include soft-deleted records if necessary
    });
    if (!classroom) {
      return res.status(404).json({
        createSubjectMessage: "Classroom not found.",
      });
    }

    // Validate that the grade exists
    const grade = await Grades.findOne({
      where: { grade_code: grade_code },
    });
    if (!grade) {
      return res.status(404).json({
        createSubjectMessage: "Grade not found.",
      });
    }

    // Validate that the semester exists
    const semester = await Semesters.findOne({
      where: { semester_number: semester_number },
    });
    if (!semester) {
      return res.status(404).json({
        createSubjectMessage: "Semester not found.",
      });
    }

    // Validate that the teacher exists
    const teacher = await Teachers.findOne({
      where: { teacher_code: teacher_code },
    });
    if (!teacher) {
      return res.status(404).json({
        createSubjectMessage: "Teacher not found.",
      });
    }

    // Split the days into an array
    const daysArray = day_of_week
      .split(",")
      .map((day) => day.trim().toLowerCase());

    // Check for existing class schedule conflicts and create class schedules
    for (const day of daysArray) {
      const existingSchedule = await ClassSchedule.findOne({
        where: {
          classroom_id_fk: classroom.classroom_id_pk,
          day_of_week: day,
          start_time,
          end_time,
          is_deleted: false, // Exclude deleted schedules
        },
      });
      if (existingSchedule) {
        return res.status(400).json({
          createSubjectMessage: `A class schedule already exists for ${day}.`,
        });
      }
    }

    // Check for existing subject conflict
    const existingSubject = await Subjects.findOne({
      where: {
        subject_name,
      },
    });
    if (existingSubject) {
      return res.status(400).json({
        createSubjectMessage: "This subject already exists!.",
      });
    }

    // Create the new subject
    const newSubject = await Subjects.create({
      subject_name,
      classroom_id_fk: classroom.classroom_id_pk,
      grade_id_fk: grade.grade_id_pk,
      semester_id_fk: semester.semester_id_pk,
      section,
    });

    // Create the teacher-subject association
    await Teacher_Subjects.create({
      teacher_id_fk: teacher.teacher_id_pk,
      subject_id_fk: newSubject.subject_id_pk,
    });

    // Create the class schedules for each day
    for (const day of daysArray) {
      await ClassSchedule.create({
        subject_id_fk: newSubject.subject_id_pk,
        classroom_id_fk: classroom.classroom_id_pk,
        day_of_week: day,
        start_time,
        end_time,
      });
    }

    return res.status(201).json({
      createSubjectMessage:
        "Subject, teacher assignment, and class schedules created successfully!",
      newSubject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    return res.status(500).json({
      createSubjectMessage: "Server error. Please try again later.",
      createSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subjects.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Classrooms,
          as: "classroom",
        },
        {
          model: Grades,
          as: "Grade",
        },
        {
          model: Semesters,
          as: "Semester",
        },
      ],
    });

    return res.status(200).json({
      getAllSubjectsMessage: "Subjects retrieved successfully!",
      subjects,
    });
  } catch (error) {
    console.error("Error retrieving subjects:", error);
    return res.status(500).json({
      getAllSubjectsMessage: "Server error. Please try again later.",
      getAllSubjectsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single subject by ID
const getSubjectById = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false },
      include: [
        {
          model: Classrooms,
          as: "classroom",
        },
        {
          model: Grades,
          as: "Grade",
        },
        {
          model: Semesters,
          as: "Semester",
        },
        {
          model: ClassSchedule,
          as: "schedules", // Include the class schedules associated with the subject
        },
      ],
    });

    if (!subject) {
      return res.status(404).json({
        getSubjectMessage: "Subject not found or deleted.",
      });
    }

    return res.status(200).json({
      getSubjectMessage: "Subject retrieved successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error retrieving subject:", error);
    return res.status(500).json({
      getSubjectMessage: "Server error. Please try again later.",
      getSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a subject
const updateSubject = async (req, res) => {
  const { subjectId } = req.params;
  const {
    subject_name,
    classroom_code,
    section,
    grade_code,
    semester_number,
    teacher_code,
    day_of_week,
    start_time,
    end_time,
  } = req.body;

  try {
    // Find the subject to update
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false },
    });

    if (!subject) {
      return res.status(404).json({
        updateSubjectMessage: "Subject not found or deleted.",
      });
    }

    // Validate classroom, grade, semester, and teacher if provided in the request
    if (classroom_code) {
      const classroom = await Classrooms.findOne({
        where: { classroom_code: classroom_code },
        paranoid: false,
      });
      if (!classroom) {
        return res.status(404).json({
          updateSubjectMessage: "Classroom not found.",
        });
      }
      subject.classroom_id_fk = classroom.classroom_id_pk;
    }

    if (grade_code) {
      const grade = await Grades.findOne({
        where: { grade_code: grade_code },
      });
      if (!grade) {
        return res.status(404).json({
          updateSubjectMessage: "Grade not found.",
        });
      }
      subject.grade_id_fk = grade.grade_id_pk;
    }

    if (semester_number) {
      const semester = await Semesters.findOne({
        where: { semester_number: semester_number },
      });
      if (!semester) {
        return res.status(404).json({
          updateSubjectMessage: "Semester not found.",
        });
      }
      subject.semester_id_fk = semester.semester_id_pk;
    }

    if (teacher_code) {
      const teacher = await Teachers.findOne({
        where: { teacher_code: teacher_code },
      });
      if (!teacher) {
        return res.status(404).json({
          updateSubjectMessage: "Teacher not found.",
        });
      }
      // Optionally, update teacher-subject association here if needed
    }

    // Update subject fields
    if (subject_name) subject.subject_name = subject_name;
    if (section) subject.section = section;

    // Check for schedule conflicts if day and time are provided
    if (day_of_week && start_time && end_time) {
      const existingSchedule = await ClassSchedule.findOne({
        where: {
          classroom_id_fk: subject.classroom_id_fk,
          day_of_week,
          start_time,
          end_time,
          is_deleted: false, // Exclude deleted schedules
        },
      });
      if (existingSchedule) {
        return res.status(400).json({
          updateSubjectMessage:
            "A class schedule already exists for this time.",
        });
      }
    }

    // Save the updated subject
    await subject.save();

    return res.status(200).json({
      updateSubjectMessage: "Subject updated successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    return res.status(500).json({
      updateSubjectMessage: "Server error. Please try again later.",
      updateSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false },
    });

    if (!subject) {
      return res.status(404).json({
        deleteSubjectMessage: "Subject not found or already deleted.",
      });
    }

    subject.is_deleted = true;
    await subject.save();

    return res.status(200).json({
      deleteSubjectMessage: "Subject deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return res.status(500).json({
      deleteSubjectMessage: "Server error. Please try again later.",
      deleteSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted subject
const recoverSubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: true },
    });

    if (!subject) {
      return res.status(404).json({
        recoverSubjectMessage: "Subject not found or not deleted.",
      });
    }

    subject.is_deleted = false;
    await subject.save();

    return res.status(200).json({
      recoverSubjectMessage: "Subject recovered successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error recovering subject:", error);
    return res.status(500).json({
      recoverSubjectMessage: "Server error. Please try again later.",
      recoverSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

const getAllSubjectCodes = async (req, res) => {
  try {
    const subjects = await Subjects.findAll({
      where: { is_deleted: false },
      attributes: ["subject_code"], // Adjust this if you have a different field name
    });

    // Extract subject codes from the retrieved subjects
    const subjectCodes = subjects.map((subject) => subject.subject_code);

    return res.status(200).json({
      getAllSubjectCodesMessage: "Subject codes retrieved successfully!",
      subjectCodes,
    });
  } catch (error) {
    console.error("Error retrieving subject codes:", error);
    return res.status(500).json({
      getAllSubjectCodesMessage: "Server error. Please try again later.",
      getAllSubjectCodesCatchBlkErr: error.message || "Unknown error",
    });
  }
};

const getOnlyOneSubjectDetails = async (req, res) => {
  try {
    const { subjectId } = req.params; // Extract subjectId from URL parameters

    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId, is_deleted: false }, // Using subjectId in the filter
    });

    if (!subject) {
      return res.status(404).json({
        getSubjectMessage: "Subject not found",
      });
    }

    return res.status(200).json({
      getSubjectMessage: "Subject details retrieved successfully!",
      subject,
    });
  } catch (error) {
    console.error("Error retrieving subject details:", error);
    return res.status(500).json({
      getSubjectMessage: "Server error. Please try again later.",
      getSubjectCatchBlkErr: error.message || "Unknown error",
    });
  }
};

const getStudentsForSubject = async (req, res) => {
  const { subjectId } = req.params; // Assuming subjectId is passed as a URL parameter

  // Validate that the subjectId is provided
  if (!subjectId) {
    return res.status(400).json({
      message: "Subject ID is required.",
    });
  }

  try {
    // Check if the subject exists
    const subject = await Subjects.findOne({
      where: { subject_id_pk: subjectId },
    }); // Use subject_id_pk to find the subject
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    // Fetch all students
    const allStudents = await Students.findAll({
      attributes: [
        "student_id_pk",
        "student_code",
        "student_first_name",
        "student_last_name",
      ],
    });

    // Fetch all student enrollments for the subject
    const studentEnrollments = await Student_Subjects.findAll({
      where: { subject_id_fk: subject.subject_id_pk }, // Use the foreign key from Subjects
      attributes: ["student_id_fk"], // Get only the student IDs from the junction table
    });

    // Extract student IDs from the enrollments
    const enrolledStudentIds = studentEnrollments.map(
      (enrollment) => enrollment.student_id_fk
    );

    // Filter students based on the enrolled student IDs
    const enrolledStudents = allStudents.filter((student) =>
      enrolledStudentIds.includes(student.student_id_pk)
    );

    // Get the count of enrolled students
    const studentCount = enrolledStudents.length;

    // Return the count and list of students enrolled in the subject
    res.status(200).json({
      subjectId,
      student_count: studentCount,
      students: enrolledStudents, // List of enrolled students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching the enrolled students.",
    });
  }
};

// Get subjects for a student by student ID (primary key)
const getSubjectsForStudent = async (req, res) => {
  const { studentId } = req.params; // Extract studentId from URL parameters

  try {
    // Find the student by primary key
    const student = await Students.findOne({
      where: { student_id_pk: studentId, is_deleted: false }, // Ensure the student exists and is not deleted
    });

    if (!student) {
      return res.status(404).json({
        getSubjectsMessage: "Student not found or deleted.",
      });
    }

    // Get all subjects associated with the student, including marks
    const studentSubjects = await Student_Subjects.findAll({
      where: { student_id_fk: studentId }, // Filter by student ID
      include: [
        {
          model: Subjects,
          as: "subject", // Assuming a relationship with the Subjects model
          required: true, // Ensures only subjects associated with the student are retrieved
          include: [
            {
              model: Teachers,
              as: "Teachers", // Assuming a relationship with the Teachers model
              required: true,
            },
            {
              model: Classrooms,
              as: "classroom", // Assuming a relationship with the Classrooms model
              required: true,
            },
            {
              model: Marks,
              as: "marks", // Include the Marks model for each subject
              where: { student_id_fk: studentId }, // Filter marks by student ID
              required: false, // Allow subjects even if no marks exist for them
            },
          ],
        },
      ],
    });

    if (studentSubjects.length === 0) {
      return res.status(404).json({
        getSubjectsMessage: "No subjects found for this student.",
      });
    }

    // Extract subject, teacher, classroom, and mark data
    const subjectsWithDetails = studentSubjects.map((studentSubject) => ({
      subject: studentSubject.subject,
      teacher: studentSubject.subject.teacher,
      classroom: studentSubject.subject.classroom,
      mark:
        studentSubject.subject.marks.length > 0
          ? studentSubject.subject.marks // If a mark is found, retrieve it
          : null, // Otherwise, set mark to null if not available
    }));

    return res.status(200).json({
      getSubjectsMessage:
        "Subjects, teachers, classrooms, and marks retrieved successfully!",
      subjects: subjectsWithDetails,
    });
  } catch (error) {
    console.error("Error retrieving subjects for student:", error);
    return res.status(500).json({
      getSubjectsMessage: "Server error. Please try again later.",
      getSubjectsCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  recoverSubject,
  getAllSubjectCodes,
  getOnlyOneSubjectDetails,
  getStudentsForSubject,
  getSubjectsForStudent,
};
